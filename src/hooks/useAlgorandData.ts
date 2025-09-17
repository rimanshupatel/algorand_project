import { useQuery } from '@tanstack/react-query';
import { useWeb3 } from '@/contexts/Web3Context';
import algosdk from 'algosdk';

interface NFTCollection {
  id: number;
  name: string;
  unitName: string;
  url?: string;
  creator: string;
  amount: number;
}

export const useAccountInfo = () => {
  const { accountAddress, algodClient, isConnected } = useWeb3();

  return useQuery({
    queryKey: ['accountInfo', accountAddress],
    queryFn: async () => {
      if (!accountAddress || !isConnected) return null;

      try {
        const accountInfo = await algodClient.accountInformation(accountAddress).do();
        return accountInfo;
      } catch (error) {
        console.error('Failed to fetch account info:', error);
        throw error;
      }
    },
    enabled: !!accountAddress && isConnected,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useAssetInfo = (assetId: number) => {
  const { algodClient } = useWeb3();

  return useQuery({
    queryKey: ['assetInfo', assetId],
    queryFn: async () => {
      try {
        const assetInfo = await algodClient.getAssetByID(assetId).do();
        return assetInfo;
      } catch (error) {
        console.error(`Failed to fetch asset info for ${assetId}:`, error);
        throw error;
      }
    },
    enabled: !!assetId,
    staleTime: 300000, // Asset info doesn't change often, cache for 5 minutes
  });
};

export const useNFTCollection = () => {
  const { accountAddress, algodClient, isConnected } = useWeb3();

  return useQuery({
    queryKey: ['nftCollection', accountAddress],
    queryFn: async (): Promise<NFTCollection[]> => {
      if (!accountAddress || !isConnected) return [];

      try {
        const accountInfo = await algodClient.accountInformation(accountAddress).do();
        const nfts: NFTCollection[] = [];

        // Process assets (NFTs are assets with total supply of 1 and 0 decimals)
        if (accountInfo.assets) {
          for (const asset of accountInfo.assets) {
            if (Number(asset.amount) > 0) {
              try {
                const assetInfo = await algodClient.getAssetByID(Number(asset['asset-id'])).do();
                
                // Check if it's an NFT (total supply of 1 and 0 decimals)
                if (Number(assetInfo.params.total) === 1 && Number(assetInfo.params.decimals) === 0) {
                  nfts.push({
                    id: Number(asset['asset-id']),
                    name: assetInfo.params.name || 'Unnamed NFT',
                    unitName: assetInfo.params['unit-name'] || 'NFT',
                    url: assetInfo.params.url,
                    creator: assetInfo.params.creator,
                    amount: Number(asset.amount),
                  });
                }
              } catch (error) {
                console.error(`Failed to fetch info for asset ${asset['asset-id']}:`, error);
              }
            }
          }
        }

        // Process created assets
        if (accountInfo['created-assets']) {
          for (const createdAsset of accountInfo['created-assets']) {
            if (Number(createdAsset.params.total) === 1 && Number(createdAsset.params.decimals) === 0) {
              nfts.push({
                id: Number(createdAsset.index),
                name: createdAsset.params.name || 'Unnamed NFT',
                unitName: createdAsset.params['unit-name'] || 'NFT',
                url: createdAsset.params.url,
                creator: accountAddress,
                amount: 1,
              });
            }
          }
        }

        return nfts;
      } catch (error) {
        console.error('Failed to fetch NFT collection:', error);
        throw error;
      }
    },
    enabled: !!accountAddress && isConnected,
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useAlgoPrice = () => {
  return useQuery({
    queryKey: ['algoPrice'],
    queryFn: async (): Promise<number> => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=algorand&vs_currencies=usd');
        const data = await response.json();
        return data.algorand.usd;
      } catch (error) {
        console.error('Failed to fetch ALGO price:', error);
        return 0.34; // Fallback price
      }
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });
};

export const useTransactionHistory = () => {
  const { accountAddress, indexerClient, isConnected } = useWeb3();

  return useQuery({
    queryKey: ['transactionHistory', accountAddress],
    queryFn: async () => {
      if (!accountAddress || !isConnected) return [];

      try {
        const response = await indexerClient
          .lookupAccountTransactions(accountAddress)
          .limit(50)
          .do();
        
        return response.transactions || [];
      } catch (error) {
        console.error('Failed to fetch transaction history:', error);
        throw error;
      }
    },
    enabled: !!accountAddress && isConnected,
    refetchInterval: 30000,
  });
};