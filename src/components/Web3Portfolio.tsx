import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, DollarSign, Coins, Image, ExternalLink } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useAccountInfo, useAlgoPrice, useNFTCollection } from "@/hooks/useAlgorandData";

const Web3Portfolio = () => {
  const { isConnected, accountAddress } = useWeb3();
  const { data: accountInfo, isLoading: accountLoading } = useAccountInfo();
  const { data: algoPrice, isLoading: priceLoading } = useAlgoPrice();
  const { data: nftCollection, isLoading: nftLoading } = useNFTCollection();

  if (!isConnected || !accountAddress) {
    return (
      <Card className="card-modern p-8 max-w-md mx-auto">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-primary/20 rounded-2xl flex items-center justify-center mx-auto">
            <Coins className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Connect Your Wallet</h3>
          <p className="text-muted-foreground">Connect your wallet to view your portfolio and start tracking your assets</p>
        </div>
      </Card>
    );
  }

  if (accountLoading || priceLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="card-modern p-6">
              <div className="space-y-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const algoBalance = accountInfo ? Number(accountInfo.amount) / 1_000_000 : 0;
  const algoValue = algoBalance * (algoPrice || 0);
  const nftCount = nftCollection?.length || 0;
  const assetCount = accountInfo?.assets?.length || 0;

  const portfolioStats = [
    { 
      title: "ALGO Balance", 
      value: `${algoBalance.toFixed(2)} ALGO`, 
      change: `$${algoValue.toFixed(2)}`, 
      positive: true, 
      icon: Coins 
    },
    { 
      title: "NFT Collection", 
      value: `${nftCount} NFTs`, 
      change: "Unique Assets", 
      positive: true, 
      icon: Image 
    },
    { 
      title: "Total Assets", 
      value: `${assetCount} Assets`, 
      change: "Holdings", 
      positive: true, 
      icon: DollarSign 
    },
    { 
      title: "Portfolio Value", 
      value: `$${algoValue.toFixed(2)}`, 
      change: `${algoPrice ? ((algoPrice - 0.30) / 0.30 * 100).toFixed(1) : '0'}%`, 
      positive: (algoPrice || 0) > 0.30, 
      icon: TrendingUp 
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {portfolioStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="group card-modern p-6 hover:scale-105 transition-all duration-500">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <div className="flex items-center space-x-1">
                    {stat.positive ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                    <span className={`text-sm font-semibold ${
                      stat.positive ? 'text-success' : 'text-destructive'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow-primary group-hover:shadow-glow-primary transition-all duration-300">
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {nftCollection && nftCollection.length > 0 && (
        <Card className="card-modern p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-ai rounded-xl flex items-center justify-center">
              <Image className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Your NFT Collection</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nftCollection.map((nft) => (
              <div key={nft.id} className="group glass rounded-2xl p-6 space-y-4 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">{nft.name}</h4>
                    <p className="text-sm text-muted-foreground">{nft.unitName}</p>
                    <Badge variant="outline" className="bg-gradient-primary/10 border-primary/20 text-primary">
                      ID: {nft.id}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="hover:bg-white/10">
                    <a 
                      href={`https://testnet.algoexplorer.io/asset/${nft.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
                {nft.url && (
                  <div className="aspect-square bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <Image className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {accountInfo?.assets && accountInfo.assets.length > 0 && (
        <Card className="card-modern p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-success rounded-xl flex items-center justify-center">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Asset Holdings</h3>
          </div>
          <div className="space-y-4">
            {accountInfo.assets.slice(0, 10).map((asset, index) => (
              <div key={index} className="group glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow-primary">
                      <Coins className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Asset #{Number(asset['asset-id'])}</p>
                      <p className="text-sm text-muted-foreground">Amount: {Number(asset.amount).toLocaleString()}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="hover:bg-white/10">
                    <a 
                      href={`https://testnet.algoexplorer.io/asset/${asset['asset-id']}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Web3Portfolio;