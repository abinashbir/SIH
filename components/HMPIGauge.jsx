import React from "react";

const HMPIGauge = ({ hmpiValue }) => {
  const normalizedValue = Math.min(hmpiValue, 200); // Cap at 200
  const rotation = (normalizedValue / 200) * 180; // 0–200 mapped to 0–180°

  // Dynamic pointer color
  let pointerColor = "#22c55e"; // Safe (Green)
  if (normalizedValue > 50) pointerColor = "#facc15"; // Moderate (Yellow)
  if (normalizedValue > 100) pointerColor = "#ef4444"; // Unsafe (Red)

  // Container
  const gaugeContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginTop: "20px",
    position: "relative",
  };

  // Base half circle
  const halfCircleStyle = {
    width: "200px",
    height: "100px",
    backgroundColor: "#e5e7eb",
    borderRadius: "200px 200px 0 0",
    position: "relative",
    overflow: "hidden",
  };

  // Colored risk zones
  const segmentStyle = (color, width, left) => ({
    width: `${width}px`,
    height: "100px",
    backgroundColor: color,
    borderRadius: "200px 200px 0 0",
    position: "absolute",
    bottom: "0",
    left: `${left}px`,
  });

  // Inner white cover (makes gauge hollow)
  const innerCircleStyle = {
    width: "160px",
    height: "80px",
    backgroundColor: "white",
    borderRadius: "160px 160px 0 0",
    position: "absolute",
    bottom: "0",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 2,
  };

  // Pointer (needle)
  const indicatorStyle = {
    position: "absolute",
    bottom: "0",
    left: "50%",
    transformOrigin: "bottom center",
    transform: `translateX(-50%) rotate(${90 + rotation}deg)`,
    width: "3px",
    height: "90px",
    backgroundColor: pointerColor,
    zIndex: 3,
    transition: "transform 0.5s ease-in-out",
  };

  // Center text
  const textStyle = {
    position: "absolute",
    top: "60%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#111",
    zIndex: 4,
  };

  return (
    <div style={gaugeContainerStyle}>
      <div style={halfCircleStyle}>
        {/* Segments: Safe (0-50), Moderate (50-100), Unsafe (100-200) */}
        <div style={segmentStyle("#22c55e", 100, 0)}></div>
        <div style={segmentStyle("#facc15", 70, 65)}></div>
        <div style={segmentStyle("#ef4444", 65, 135)}></div>

        {/* Cover inner circle */}
        <div style={innerCircleStyle}></div>

        {/* Needle */}
        <div style={indicatorStyle}></div>

        {/* Value text */}
        <div style={textStyle}>{normalizedValue}</div>
      </div>

      {/* Labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "200px",
          marginTop: "8px",
          fontSize: "0.85rem",
        }}
      >
        <span>Safe</span>
        <span>Moderate</span>
        <span>Unsafe</span>
      </div>
    </div>
  );
};

export default HMPIGauge;
