import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, TrendingUp, AlertCircle } from "lucide-react";

const ChatInterface = () => {
  const mockMessages = [
    {
      type: "bot",
      message:
        "Hello! I'm your Copilot AI assistant. I can help you analyze your Algorand portfolio, track NFT trends, and provide market insights. What would you like to know?",
      timestamp: "2:34 PM",
    },
    {
      type: "user",
      message: "Show me my portfolio performance for this week",
      timestamp: "2:35 PM",
    },
    {
      type: "bot",
      message:
        "Your portfolio is up 12.5% this week! Your ALGO holdings gained 8.2% and your NFT collection increased by 24%. Would you like me to break down the performance by asset class?",
      timestamp: "2:35 PM",
    },
  ];

  return (
    <Card className="card-modern p-8 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-ai rounded-2xl flex items-center justify-center shadow-glow-accent">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-primary rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">
              AI Copilot Assistant
            </h3>
            <p className="text-muted-foreground">
              Powered by advanced analytics and machine learning
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6 h-96 overflow-y-auto custom-scrollbar">
          {mockMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              } animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`max-w-md p-4 rounded-2xl ${
                  msg.type === "user"
                    ? "bg-gradient-primary text-white shadow-glow-primary"
                    : "glass border border-white/10 text-foreground"
                }`}
              >
                <div className="flex items-start space-x-3">
                  {msg.type === "bot" && (
                    <Bot className="w-5 h-5 mt-0.5 text-accent" />
                  )}
                  {msg.type === "user" && <User className="w-5 h-5 mt-0.5" />}
                  <div className="space-y-2">
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                    <span className="text-xs opacity-70">{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-3">
          <Input
            placeholder="Ask me about your portfolio, market trends, or NFT insights..."
            className="flex-1 glass border-white/20 focus:border-primary/50"
          />
          <Button className="btn-hero text-white px-6">
            <Send className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            className="glass border-white/20 hover:bg-white/10"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Market Analysis
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="glass border-white/20 hover:bg-white/10"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Risk Assessment
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="glass border-white/20 hover:bg-white/10"
          >
            Portfolio Summary
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;
