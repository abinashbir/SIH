import React from "react";
import { RadialBarChart, RadialBar, Legend } from "recharts";

const HMPIGauge = ({ hmpiValue }) => {
  const data = [
    {
      name: "HMPI",
      value: hmpiValue,
      fill: hmpiValue > 100 ? "#e53935" : hmpiValue > 50 ? "#fb8c00" : "#43a047",
    },
  ];

  return (
    <div style={{ marginTop: "20px" }}>
      <RadialBarChart
        width={300}
        height={250}
        innerRadius="70%"
        outerRadius="100%"
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <RadialBar minAngle={15} clockWise dataKey="value" />
        <Legend
          iconSize={10}
          layout="horizontal"
          verticalAlign="bottom"
          wrapperStyle={{ color: "#fff" }}
        />
      </RadialBarChart>
      <h3 style={{ color: "white" }}>HMPI: {hmpiValue}</h3>
    </div>
  );
};

export default HMPIGauge;
