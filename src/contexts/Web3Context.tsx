import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PeraWalletConnect } from '@perawallet/connect';
import algosdk from 'algosdk';
import { toast } from '@/hooks/use-toast';

interface Web3ContextType {
  peraWallet: PeraWalletConnect;
  accountAddress: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  signTransaction: (txn: algosdk.Transaction) => Promise<Uint8Array>;
  algodClient: algosdk.Algodv2;
  indexerClient: algosdk.Indexer;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Algorand node configuration
const algodServer = 'https://testnet-api.algonode.cloud';
const indexerServer = 'https://testnet-idx.algonode.cloud';
const algodPort = '';
const algodToken = '';

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Initialize Pera Wallet
  const peraWallet = new PeraWalletConnect({
    shouldShowSignTxnToast: false,
  });

  // Initialize Algorand clients
  const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
  const indexerClient = new algosdk.Indexer(algodToken, indexerServer, algodPort);

  // Check for existing connection on mount
  useEffect(() => {
    peraWallet.reconnectSession().then((accounts) => {
      if (accounts.length > 0) {
        setAccountAddress(accounts[0]);
        setIsConnected(true);
        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      }
    }).catch((error) => {
      console.error('Failed to reconnect:', error);
    });

    // Listen for wallet events
    peraWallet.connector?.on('disconnect', () => {
      setAccountAddress(null);
      setIsConnected(false);
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
    });
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const accounts = await peraWallet.connect();
      if (accounts.length > 0) {
        setAccountAddress(accounts[0]);
        setIsConnected(true);
        toast({
          title: "Wallet Connected Successfully",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Pera Wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    peraWallet.disconnect();
    setAccountAddress(null);
    setIsConnected(false);
  };

  const signTransaction = async (txn: algosdk.Transaction): Promise<Uint8Array> => {
    try {
      const signerTransaction = [{ txn, signers: [accountAddress!] }];
      const signedTxns = await peraWallet.signTransaction([signerTransaction]);
      return signedTxns[0];
    } catch (error) {
      console.error('Failed to sign transaction:', error);
      throw error;
    }
  };

  return (
    <Web3Context.Provider value={{
      peraWallet,
      accountAddress,
      isConnected,
      isConnecting,
      connectWallet,
      disconnectWallet,
      signTransaction,
      algodClient,
      indexerClient,
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};