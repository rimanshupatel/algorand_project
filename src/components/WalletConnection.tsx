import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, LogOut, Copy, ExternalLink, Sparkles, ArrowRight } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import { toast } from "@/hooks/use-toast";

const WalletConnection = () => {
  const { accountAddress, isConnected, isConnecting, connectWallet, disconnectWallet } = useWeb3();

  const copyAddress = () => {
    if (accountAddress) {
      navigator.clipboard.writeText(accountAddress);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const viewOnExplorer = () => {
    if (accountAddress) {
      window.open(`https://testnet.algoexplorer.io/address/${accountAddress}`, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <Card className="card-modern p-8 max-w-md mx-auto">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-glow-primary">
              <Wallet className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-ai rounded-full flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-foreground">Connect Your Wallet</h3>
            <p className="text-muted-foreground leading-relaxed">
              Connect your Pera Wallet to access your Algorand portfolio and start trading NFTs with AI-powered insights
            </p>
          </div>
          
          <Button 
            onClick={connectWallet} 
            disabled={isConnecting}
            size="lg"
            className="btn-hero text-white font-semibold w-full py-4 text-lg group"
          >
            {isConnecting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </div>
            ) : (
              <>
                Connect Pera Wallet
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
          
          <div className="text-xs text-muted-foreground">
            Your wallet stays in your control. We never store your private keys.
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="card-modern p-8 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-success rounded-2xl flex items-center justify-center shadow-glow-success">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-primary rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">Wallet Connected</h3>
              <Badge variant="default" className="bg-gradient-success text-white px-3 py-1">
                Pera Wallet
              </Badge>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={disconnectWallet}
            className="glass border-white/20 hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </Button>
        </div>

        <div className="glass rounded-2xl p-6 space-y-4 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Wallet Address</span>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyAddress}
                className="hover:bg-white/10"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={viewOnExplorer}
                className="hover:bg-white/10"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-sm font-mono text-foreground break-all leading-relaxed">
              {accountAddress}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WalletConnection;