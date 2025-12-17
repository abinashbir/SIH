import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import "./PollutionChart.css";

const PollutionChart = ({ filters }) => {
  // mock data
  const data = [
    { month: "Jan", Lead: 20, Mercury: 40 },
    { month: "Feb", Lead: 30, Mercury: 35 },
    { month: "Mar", Lead: 25, Mercury: 50 },
    { month: "Apr", Lead: 40, Mercury: 20 },
  ];

  return (
    <div className="pollution-chart">
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Lead" stroke="#ff4d4f" />
        <Line type="monotone" dataKey="Mercury" stroke="#1a73e8" />
      </LineChart>
    </div>
  );
};

export default PollutionChart;
