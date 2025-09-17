import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Send, Coins, AlertCircle, CheckCircle } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import { AlgorandService } from "@/services/algorandService";
import { toast } from "@/hooks/use-toast";

const NFTTransactionPanel = () => {
  const { accountAddress, isConnected, signTransaction, algodClient, indexerClient } = useWeb3();
  const [recipient, setRecipient] = useState("");
  const [assetId, setAssetId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isTransacting, setIsTransacting] = useState(false);
  const [transactionType, setTransactionType] = useState<'transfer' | 'optin' | 'payment'>('transfer');

  const algorandService = new AlgorandService(algodClient, indexerClient);

  const handleTransaction = async () => {
    if (!isConnected || !accountAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (transactionType === 'transfer' && (!recipient || !assetId)) {
      toast({
        title: "Invalid Input",
        description: "Please provide recipient address and asset ID",
        variant: "destructive",
      });
      return;
    }

    if (transactionType === 'payment' && (!recipient || !amount)) {
      toast({
        title: "Invalid Input",
        description: "Please provide recipient address and amount",
        variant: "destructive",
      });
      return;
    }

    setIsTransacting(true);

    try {
      let transaction;

      switch (transactionType) {
        case 'transfer':
          transaction = await algorandService.createAssetTransferTransaction(
            accountAddress,
            recipient,
            parseInt(assetId),
            parseInt(amount) || 1
          );
          break;
        case 'optin':
          transaction = await algorandService.createAssetOptInTransaction(
            accountAddress,
            parseInt(assetId)
          );
          break;
        case 'payment':
          transaction = await algorandService.createPaymentTransaction(
            accountAddress,
            recipient,
            parseFloat(amount),
            note
          );
          break;
        default:
          throw new Error('Invalid transaction type');
      }

      const signedTxn = await signTransaction(transaction);
      const txId = await algorandService.submitTransaction(signedTxn);

      toast({
        title: "Transaction Successful",
        description: `Transaction ID: ${txId}`,
      });

      // Reset form
      setRecipient("");
      setAssetId("");
      setAmount("");
      setNote("");

    } catch (error) {
      console.error('Transaction failed:', error);
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsTransacting(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="card-modern p-8 max-w-md mx-auto">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-primary/20 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-foreground">Wallet Required</h3>
            <p className="text-muted-foreground leading-relaxed">
              Connect your wallet to perform transactions and interact with the Algorand blockchain
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="card-modern p-8 max-w-2xl mx-auto">
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow-primary">
              <Send className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-success rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">Transaction Panel</h3>
            <p className="text-muted-foreground">Send assets or ALGO on Algorand blockchain</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            variant={transactionType === 'transfer' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTransactionType('transfer')}
            className={transactionType === 'transfer' ? 'btn-hero text-white' : 'glass border-white/20 hover:bg-white/10'}
          >
            Transfer Asset
          </Button>
          <Button
            variant={transactionType === 'payment' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTransactionType('payment')}
            className={transactionType === 'payment' ? 'btn-hero text-white' : 'glass border-white/20 hover:bg-white/10'}
          >
            Send ALGO
          </Button>
          <Button
            variant={transactionType === 'optin' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTransactionType('optin')}
            className={transactionType === 'optin' ? 'btn-hero text-white' : 'glass border-white/20 hover:bg-white/10'}
          >
            Opt-in Asset
          </Button>
        </div>

        <Separator />

        <div className="space-y-6">
          {transactionType !== 'optin' && (
            <div className="space-y-2">
              <Label htmlFor="recipient" className="text-sm font-medium text-foreground">Recipient Address</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter Algorand address"
                className="glass border-white/20 focus:border-primary/50"
              />
            </div>
          )}

          {(transactionType === 'transfer' || transactionType === 'optin') && (
            <div className="space-y-2">
              <Label htmlFor="assetId" className="text-sm font-medium text-foreground">Asset ID</Label>
              <Input
                id="assetId"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                placeholder="Enter asset ID"
                type="number"
                className="glass border-white/20 focus:border-primary/50"
              />
            </div>
          )}

          {transactionType !== 'optin' && (
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium text-foreground">
                {transactionType === 'payment' ? 'Amount (ALGO)' : 'Amount'}
              </Label>
              <Input
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={transactionType === 'payment' ? '0.001' : '1'}
                type="number"
                step={transactionType === 'payment' ? '0.000001' : '1'}
                className="glass border-white/20 focus:border-primary/50"
              />
            </div>
          )}

          {transactionType === 'payment' && (
            <div className="space-y-2">
              <Label htmlFor="note" className="text-sm font-medium text-foreground">Note (Optional)</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note to your transaction"
                className="glass border-white/20 focus:border-primary/50"
                rows={3}
              />
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-6 space-y-4 border border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Transaction Type</span>
            <Badge variant="secondary" className="bg-gradient-primary/10 border-primary/20 text-primary">
              {transactionType === 'transfer' && 'Asset Transfer'}
              {transactionType === 'payment' && 'ALGO Payment'}
              {transactionType === 'optin' && 'Asset Opt-in'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Network</span>
            <Badge variant="outline" className="border-white/20">Algorand Testnet</Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Est. Fee</span>
            <span className="text-foreground font-semibold">0.001 ALGO</span>
          </div>
        </div>

        <Button 
          onClick={handleTransaction}
          disabled={isTransacting}
          className="w-full btn-hero text-white font-semibold py-4 text-lg"
        >
          {isTransacting ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              {transactionType === 'transfer' && 'Transfer Asset'}
              {transactionType === 'payment' && 'Send ALGO'}
              {transactionType === 'optin' && 'Opt-in to Asset'}
            </>
          )}
        </Button>

        <div className="glass rounded-2xl p-6 space-y-4 border border-white/10">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground">Important Notes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>This is Algorand Testnet - use only test funds</li>
                <li>Asset transfers require the recipient to opt-in first</li>
                <li>All transactions are irreversible</li>
                <li>Minimum ALGO balance of 0.1 ALGO required</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NFTTransactionPanel;