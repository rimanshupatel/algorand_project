import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Coins, Image } from "lucide-react";

const PortfolioDashboard = () => {
  const portfolioStats = [
    { 
      title: "Total Portfolio Value", 
      value: "$124,567", 
      change: "+12.5%", 
      positive: true, 
      icon: DollarSign 
    },
    { 
      title: "ALGO Holdings", 
      value: "45,230 ALGO", 
      change: "+8.2%", 
      positive: true, 
      icon: Coins 
    },
    { 
      title: "NFT Collection", 
      value: "23 NFTs", 
      change: "+24.1%", 
      positive: true, 
      icon: Image 
    },
    { 
      title: "Weekly P&L", 
      value: "$13,897", 
      change: "+15.7%", 
      positive: true, 
      icon: TrendingUp 
    }
  ];

  const topAssets = [
    { name: "Algorand (ALGO)", value: "$0.34", change: "+8.2%", positive: true },
    { name: "AlgoWorld NFT", value: "$2,340", change: "+15.6%", positive: true },
    { name: "Yieldly (YLDY)", value: "$0.012", change: "-2.1%", positive: false },
    { name: "Tinyman LP", value: "$5,670", change: "+12.3%", positive: true }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {portfolioStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 bg-card border-border shadow-elevated hover:shadow-glow-primary transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.positive ? (
                      <TrendingUp className="w-4 h-4 text-success mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.positive ? 'text-success' : 'text-destructive'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 bg-card border-border shadow-elevated">
        <h3 className="text-lg font-semibold text-foreground mb-4">Top Assets</h3>
        <div className="space-y-4">
          {topAssets.map((asset, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-full"></div>
                <div>
                  <p className="font-medium text-foreground">{asset.name}</p>
                  <p className="text-sm text-muted-foreground">{asset.value}</p>
                </div>
              </div>
              <Badge variant={asset.positive ? "default" : "destructive"}>
                {asset.change}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default PortfolioDashboard;