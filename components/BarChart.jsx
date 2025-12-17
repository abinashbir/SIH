import React from "react";
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const BarChart = ({ data, filters }) => {
  // Example dummy data if none provided
  const chartData = data || [
    { name: "Sample 1", Pb: 30, Cd: 20, As: 10, Hg: 15 },
    { name: "Sample 2", Pb: 40, Cd: 15, As: 25, Hg: 10 },
    { name: "Sample 3", Pb: 20, Cd: 30, As: 15, Hg: 20 },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <ReBarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Pb" fill="#8884d8" />
        <Bar dataKey="Cd" fill="#82ca9d" />
        <Bar dataKey="As" fill="#ffc658" />
        <Bar dataKey="Hg" fill="#ff7f7f" />
      </ReBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
