import algosdk from 'algosdk';

export class AlgorandService {
  private algodClient: algosdk.Algodv2;
  private indexerClient: algosdk.Indexer;

  constructor(algodClient: algosdk.Algodv2, indexerClient: algosdk.Indexer) {
    this.algodClient = algodClient;
    this.indexerClient = indexerClient;
  }

  // Create an asset transfer transaction
  async createAssetTransferTransaction(
    from: string,
    to: string,
    assetId: number,
    amount: number
  ): Promise<algosdk.Transaction> {
    const suggestedParams = await this.algodClient.getTransactionParams().do();
    
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      sender: from,
      receiver: to,
      assetIndex: assetId,
      amount,
      suggestedParams,
    });

    return txn;
  }

  // Create a payment transaction
  async createPaymentTransaction(
    from: string,
    to: string,
    amount: number,
    note?: string
  ): Promise<algosdk.Transaction> {
    const suggestedParams = await this.algodClient.getTransactionParams().do();
    
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      sender: from,
      receiver: to,
      amount: algosdk.algosToMicroalgos(amount),
      note: note ? new TextEncoder().encode(note) : undefined,
      suggestedParams,
    });

    return txn;
  }

  // Create an asset opt-in transaction
  async createAssetOptInTransaction(
    from: string,
    assetId: number
  ): Promise<algosdk.Transaction> {
    const suggestedParams = await this.algodClient.getTransactionParams().do();
    
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      sender: from,
      receiver: from,
      assetIndex: assetId,
      amount: 0,
      suggestedParams,
    });

    return txn;
  }

  // Submit a signed transaction
  async submitTransaction(signedTxn: Uint8Array): Promise<string> {
    try {
      const response = await this.algodClient.sendRawTransaction(signedTxn).do();
      const txId = response.txid;
      
      // Wait for confirmation
      await algosdk.waitForConfirmation(this.algodClient, txId, 4);
      
      return txId;
    } catch (error) {
      console.error('Failed to submit transaction:', error);
      throw error;
    }
  }

  // Get asset information
  async getAssetInfo(assetId: number) {
    try {
      return await this.algodClient.getAssetByID(assetId).do();
    } catch (error) {
      console.error(`Failed to get asset info for ${assetId}:`, error);
      throw error;
    }
  }

  // Search for assets by name
  async searchAssets(query: string, limit: number = 20) {
    try {
      const response = await this.indexerClient
        .searchForAssets()
        .name(query)
        .limit(limit)
        .do();
      
      return response.assets || [];
    } catch (error) {
      console.error('Failed to search assets:', error);
      throw error;
    }
  }

  // Get NFT metadata from IPFS URL
  async getNFTMetadata(url: string) {
    try {
      // Handle IPFS URLs
      if (url.startsWith('ipfs://')) {
        url = url.replace('ipfs://', 'https://ipfs.io/ipfs/');
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch metadata');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch NFT metadata:', error);
      return null;
    }
  }

  // Calculate portfolio value
  async calculatePortfolioValue(accountAddress: string, algoPrice: number) {
    try {
      const accountInfo = await this.algodClient.accountInformation(accountAddress).do();
      
      // ALGO balance
      const algoBalance = algosdk.microalgosToAlgos(Number(accountInfo.amount));
      const algoValue = algoBalance * algoPrice;
      
      // Asset values (simplified - in reality you'd need price feeds for each asset)
      let assetsValue = 0;
      const assets = accountInfo.assets || [];
      
      // For demo purposes, we'll estimate asset values
      for (const asset of assets) {
        if (Number(asset.amount) > 0) {
          try {
            const assetInfo = await this.getAssetInfo(Number(asset['asset-id']));
            // This is a simplified estimation - real implementation would need price oracles
            if (Number(assetInfo.params.total) === 1 && Number(assetInfo.params.decimals) === 0) {
              // NFT - estimate value
              assetsValue += 50; // Placeholder NFT value in USD
            } else {
              // Fungible token - would need actual price data
              assetsValue += 10; // Placeholder token value in USD
            }
          } catch (error) {
            // Skip assets we can't get info for
            continue;
          }
        }
      }
      
      return {
        algoBalance,
        algoValue,
        assetsValue,
        totalValue: algoValue + assetsValue,
        assets: assets.length,
        nfts: 0 // Will be calculated separately due to async nature
      };
    } catch (error) {
      console.error('Failed to calculate portfolio value:', error);
      throw error;
    }
  }
}