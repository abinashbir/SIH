import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./TrendsChartPart.css";

const TrendsChartPart = ({ data, filters }) => {
  // Mock data if nothing is passed
  const chartData =
    data || [
      { month: "Jan", Lead: 20, Mercury: 40, Arsenic: 10 },
      { month: "Feb", Lead: 30, Mercury: 35, Arsenic: 15 },
      { month: "Mar", Lead: 25, Mercury: 50, Arsenic: 20 },
      { month: "Apr", Lead: 40, Mercury: 20, Arsenic: 25 },
    ];

  return (
    <div className="trends-chart-card">
      <h2 className="chart-title">📈 Pollution Trends</h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Lead" stroke="#ff4d4f" />
          <Line type="monotone" dataKey="Mercury" stroke="#1a73e8" />
          <Line type="monotone" dataKey="Arsenic" stroke="#52c41a" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendsChartPart;
