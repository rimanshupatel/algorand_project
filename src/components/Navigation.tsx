import { Button } from "@/components/ui/button";
import {
  Brain,
  BarChart3,
  Wallet,
  MessageSquare,
  Sparkles,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { Badge } from "@/components/ui/badge";
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isConnected } = useWeb3();
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/portfolio", label: "Portfolio", icon: Wallet },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/ai-assistant", label: "AI Assistant", icon: MessageSquare },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-ai rounded-full flex items-center justify-center">
                <Sparkles className="w-2 h-2 text-white" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold text-gradient-primary">
                Copilot
              </span>
              <span className="text-sm text-muted-foreground ml-2">
                Analytics
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-300 group"
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item.label}</span>
                </a>
              );
            })}
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
                <Badge
                  variant="default"
                  className="bg-gradient-success text-white px-6 py-3 text-lg"
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  Wallet Connected
                </Badge>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </a>
                );
              })}
            </div>
            <div className="flex flex-col space-y-2 mt-4 pt-4 border-t border-white/10">
              <Button variant="ghost" className="justify-start">
                Sign In
              </Button>
              <Button className="btn-hero text-white font-semibold">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
