import React from "react";
import "./Alerts.css";

const Alerts = () => {
  const alerts = [
    { id: 1, message: "Lead level exceeded in Delhi region", time: "10 min ago" },
    { id: 2, message: "Mercury contamination detected in Mumbai", time: "1 hr ago" },
    { id: 3, message: "Arsenic alert in Kolkata river sample", time: "Yesterday" },
  ];

  return (
    <div className="alerts-container">
      {alerts.map((alert) => (
        <div key={alert.id} className="alert">
          <p>{alert.message}</p>
          <span>{alert.time}</span>
        </div>
      ))}
    </div>
  );
};

export default Alerts;
