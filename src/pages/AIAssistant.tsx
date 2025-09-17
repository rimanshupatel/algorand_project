import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiTrendingUp, FiPieChart, FiDollarSign } from "react-icons/fi";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface MarketData {
  btcPrice: number;
  ethPrice: number;
  marketSentiment: "bullish" | "bearish" | "neutral";
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Welcome! I'm your crypto & NFT analytics assistant. I can help you with:\n• Portfolio analysis\n• Market trends\n• NFT valuations\n• Risk assessment",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    // Fetch market data periodically
    const fetchMarketData = async () => {
      try {
        // Replace with your actual API endpoints
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
        );
        const data = await response.json();
        setMarketData({
          btcPrice: data.bitcoin.usd,
          ethPrice: data.ethereum.usd,
          marketSentiment: "neutral",
        });
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const systemInstruction = `
        You are an advanced crypto and NFT analytics assistant with expertise in:
        1. Portfolio analysis and optimization
        2. Market trend analysis and predictions
        3. NFT valuation and collection insights
        4. Risk assessment and management
        5. DeFi strategy recommendations

        Current market context:
        - BTC Price: ${marketData?.btcPrice ?? "Unknown"}
        - ETH Price: ${marketData?.ethPrice ?? "Unknown"}
        - Market Sentiment: ${marketData?.marketSentiment ?? "Unknown"}

        Provide detailed, data-driven responses while maintaining clarity and professionalism.
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: systemInstruction + "\nUser: " + input }],
              },
            ],
          }),
        }
      );

      // ... rest of the streaming logic remains the same ...
      // ... existing code for response handling ...
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header with Market Data */}
      <header className="p-6 bg-gray-800 border-b border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">
            🚀 Crypto & NFT Analytics Assistant
          </h1>
          {marketData && (
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center text-green-400">
                <FiTrendingUp className="mr-2" />
                <span>BTC: ${marketData.btcPrice?.toLocaleString()}</span>
              </div>
              <div className="flex items-center text-blue-400">
                <FiPieChart className="mr-2" />
                <span>ETH: ${marketData.ethPrice?.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-6 py-3 rounded-2xl max-w-2xl ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-100"
              }`}
            >
              <div className="text-sm mb-1">{msg.content}</div>
              <div className="text-xs opacity-50">
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-6 py-3 bg-gray-700 rounded-2xl text-gray-300">
              <div className="flex items-center space-x-2">
                <div className="animate-pulse">⏳</div>
                <span>Analyzing market data...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input Area */}
      <div className="p-6 bg-gray-800 border-t border-gray-700">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about market trends, portfolio analysis, or NFT insights..."
            className="flex-1 bg-gray-700 text-white border-none rounded-xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 disabled:opacity-50 transition-colors duration-200"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
