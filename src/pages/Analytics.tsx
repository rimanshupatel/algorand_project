import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const Analytics = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Fetch your analytics data here
    // Example data structure
    setChartData({
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      datasets: [
        {
          label: "Portfolio Value",
          data: [100, 120, 115, 134, 168],
          borderColor: "#3b82f6",
          tension: 0.1,
        },
      ],
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Portfolio Performance</h2>
          {chartData && <Line data={chartData} />}
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
          {/* Add market data components */}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
