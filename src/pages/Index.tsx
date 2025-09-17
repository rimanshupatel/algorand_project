import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Sparkles, Shield, TrendingUp, Wallet, ArrowRight, MessageSquare } from "lucide-react";
import heroImage from "@/assets/hero-crypto.jpg";
import WalletConnection from "@/components/WalletConnection";
import ChatInterface from "@/components/ChatInterface";
import Web3Portfolio from "@/components/Web3Portfolio";
import NFTTransactionPanel from "@/components/NFTTransactionPanel";
import { useWeb3 } from "@/contexts/Web3Context";

const Index = () => {
  const { isConnected } = useWeb3();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-hero">
          <div className="absolute inset-0 hero-noise"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-primary/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-ai/20 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-gradient-success/20 rounded-full blur-xl animate-float" style={{animationDelay: '4s'}}></div>
        
        <div className="relative container mx-auto px-4 py-24 z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-slide-up">
              <div className="space-y-6">
                <Badge variant="secondary" className="glass text-white border-white/20 px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                  Powered by Advanced AI
                </Badge>
                
                <h1 className="text-6xl lg:text-7xl font-black leading-tight">
                  <span className="text-white">Your AI-Powered</span>
                  <span className="block text-gradient-ai mt-2">Algorand Copilot</span>
                </h1>
                
                <p className="text-xl text-white/80 leading-relaxed max-w-lg">
                  Experience the future of crypto analytics with personalized portfolio insights, 
                  NFT trend analysis, and smart contract interactions on Algorand blockchain.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {!isConnected ? (
                  <Button 
                    size="lg" 
                    className="btn-hero text-white font-semibold px-8 py-4 text-lg group"
                  >
                    Connect Pera Wallet
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Badge variant="default" className="bg-gradient-success text-white px-6 py-3 text-lg">
                      <Wallet className="w-5 h-5 mr-2" />
                      Wallet Connected
                    </Badge>
                    <Button variant="outline" size="lg" className="glass text-white border-white/20 hover:bg-white/10">
                      View Dashboard
                    </Button>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-sm text-white/60">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">$2.4B+</div>
                  <div className="text-sm text-white/60">Assets Tracked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50K+</div>
                  <div className="text-sm text-white/60">Active Users</div>
                </div>
              </div>
            </div>
            
            <div className="relative animate-slide-up" style={{animationDelay: '0.2s'}}>
              {/* Main Hero Image */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary/20 rounded-3xl blur-3xl scale-110"></div>
                <img 
                  src={heroImage} 
                  alt="Algorand Copilot AI Platform" 
                  className="relative rounded-3xl shadow-2xl w-full border border-white/10"
                />
                
                {/* Floating AI Badge */}
                <div className="absolute -top-6 -right-6 bg-gradient-ai p-6 rounded-2xl shadow-glow-accent animate-pulse-glow">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-1/4 -left-8 w-16 h-16 bg-gradient-success/30 rounded-full blur-xl animate-float"></div>
                <div className="absolute bottom-1/4 -right-8 w-12 h-12 bg-gradient-primary/30 rounded-full blur-lg animate-float" style={{animationDelay: '1s'}}></div>
              </div>
              
              {/* Feature Cards */}
              <div className="absolute -bottom-8 -left-8 glass rounded-2xl p-4 border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-success rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Real-time Analytics</div>
                    <div className="text-xs text-white/60">Live portfolio tracking</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-8 -left-8 glass rounded-2xl p-4 border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-ai rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Secure & Private</div>
                    <div className="text-xs text-white/60">Non-custodial wallet</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="glass text-foreground border-border/50 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Revolutionary Technology
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              <span className="text-gradient-primary">Crypto Intelligence</span>
              <br />
              <span className="text-foreground">Reimagined</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Harness the power of AI to navigate the Algorand ecosystem with confidence and precision. 
              Experience the future of decentralized finance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group card-modern p-8 text-center hover:scale-105 transition-all duration-500">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-ai rounded-2xl flex items-center justify-center mx-auto shadow-glow-accent group-hover:shadow-glow-accent transition-all duration-300">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">AI-Powered Analytics</h3>
              <p className="text-muted-foreground leading-relaxed">
                Advanced machine learning algorithms analyze market trends and provide personalized investment insights with unprecedented accuracy.
              </p>
            </Card>
            
            <Card className="group card-modern p-8 text-center hover:scale-105 transition-all duration-500">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-success rounded-2xl flex items-center justify-center mx-auto shadow-glow-success group-hover:shadow-glow-success transition-all duration-300">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-ai rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Secure & Decentralized</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built on Algorand's secure blockchain with non-custodial wallet integration for maximum security and privacy.
              </p>
            </Card>
            
            <Card className="group card-modern p-8 text-center hover:scale-105 transition-all duration-500">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-glow-primary group-hover:shadow-glow-primary transition-all duration-300">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-success rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Real-time Insights</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get instant notifications about portfolio changes, NFT opportunities, and market movements as they happen.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="glass text-foreground border-border/50 mb-4">
              <Wallet className="w-4 h-4 mr-2" />
              Your Command Center
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              <span className="text-gradient-primary">Personal Crypto</span>
              <br />
              <span className="text-foreground">Command Center</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Monitor your portfolio, chat with AI, and execute transactions all in one place. 
              Experience the future of decentralized finance management.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="wallet" className="space-y-8">
              <div className="flex justify-center">
                <TabsList className="glass border border-white/10 p-1 grid w-full max-w-2xl grid-cols-4">
                  <TabsTrigger 
                    value="wallet" 
                    className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-300"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Wallet
                  </TabsTrigger>
                  <TabsTrigger 
                    value="portfolio"
                    className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-300"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Portfolio
                  </TabsTrigger>
                  <TabsTrigger 
                    value="transactions"
                    className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-300"
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    Transactions
                  </TabsTrigger>
                  <TabsTrigger 
                    value="ai-chat"
                    className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-300"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    AI Assistant
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="wallet" className="space-y-6 animate-slide-up">
                <WalletConnection />
              </TabsContent>
              
              <TabsContent value="portfolio" className="space-y-6 animate-slide-up">
                <Web3Portfolio />
              </TabsContent>
              
              <TabsContent value="transactions" className="space-y-6 animate-slide-up">
                <NFTTransactionPanel />
              </TabsContent>
              
              <TabsContent value="ai-chat" className="space-y-6 animate-slide-up">
                <ChatInterface />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;