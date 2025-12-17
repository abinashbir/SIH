// Visualization.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function Visualization() {
  // Get data passed from Upload.jsx
  const location = useLocation();
  const { formData, prediction } = location.state || {};

  // ==================== TIME SERIES DATA ====================
  const timeSeriesData = [
    { year: 2019, Pb: 30, Cd: 18, As: 20, Hg: 15 },
    { year: 2020, Pb: 35, Cd: 20, As: 25, Hg: 18 },
    { year: 2021, Pb: 28, Cd: 22, As: 18, Hg: 12 },
    { year: 2022, Pb: 40, Cd: 25, As: 30, Hg: 20 },
    { year: 2023, Pb: 38, Cd: 28, As: 27, Hg: 17 },
  ];

  if (formData) {
    timeSeriesData.push({
      year: 2024,
      Pb: Number(formData.lead) || 0,
      Cd: Number(formData.cadmium) || 0,
      As: Number(formData.zinc) || 0, // mapping zinc → As
      Hg: Number(formData.copper) || 0, // mapping copper → Hg
    });
  }

  // ==================== MAP LOCATIONS ====================
  const locations = [
    { lat: 20.3, lng: 85.8, metal: "Pb", value: 35 },
    { lat: 20.4, lng: 85.9, metal: "Cd", value: 20 },
    { lat: 20.5, lng: 86.0, metal: "As", value: 50 },
    { lat: 20.6, lng: 86.1, metal: "Hg", value: 15 },
  ];

  if (formData && prediction) {
    locations.push({
      lat: 20.7, // dummy lat/lng (replace with real geocoding later)
      lng: 86.2,
      metal: `${formData.city} Sample`,
      value: prediction.hmpiValue,
    });
  }

  // ==================== BAR CHART ====================
  const barData = [
    { name: "Sample 1", Pb: 30, Cd: 20, As: 10, Hg: 15 },
    { name: "Sample 2", Pb: 40, Cd: 15, As: 25, Hg: 10 },
    { name: "Sample 3", Pb: 20, Cd: 30, As: 15, Hg: 20 },
  ];

  if (formData) {
    barData.push({
      name: `${formData.city} Sample`,
      Pb: Number(formData.lead),
      Cd: Number(formData.cadmium),
      As: Number(formData.zinc),
      Hg: Number(formData.copper),
    });
  }

  // ==================== TABLE ====================
  const topContaminated = [
    { sample: "Sample 3", total: 95, status: "Unsafe" },
    { sample: "Sample 2", total: 90, status: "Moderate Risk" },
    { sample: "Sample 1", total: 75, status: "Moderate Risk" },
    { sample: "Sample 5", total: 60, status: "Safe" },
    { sample: "Sample 4", total: 50, status: "Safe" },
  ];

  if (formData && prediction) {
    topContaminated.unshift({
      sample: `${formData.city}, ${formData.state}`,
      total: prediction.hmpiValue,
      status: prediction.riskStatus,
    });
  }

  // ==================== STYLES ====================
  const cardStyle = {
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    backgroundColor: "#1a2a4f",
    color: "#ffffff",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  };

  const thStyle = {
    textAlign: "left",
    padding: "10px",
    backgroundColor: "#14213d",
    color: "#ffffff",
  };

  const tdStyle = {
    padding: "10px",
    color: "#e0e0e0",
  };

  const getAlertIcon = (status) => {
    if (status === "Unsafe") return "🔴";
    if (status === "Moderate Risk") return "⚠️";
    if (status === "Safe") return "🟢";
    return "⚪";
  };

  const getStatusColor = (status) => {
    if (status === "Unsafe") return "#ff4d4d";
    if (status === "Moderate Risk") return "#ffa500";
    if (status === "Safe") return "#00ff00";
    return "#e0e0e0";
  };

  // ==================== RENDER ====================
  return (
    <div style={{ padding: "30px", backgroundColor: "#0d1b33", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#ffffff" }}>
        Visualization Dashboard
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: "30px",
        }}
      >
        {/* Line Chart */}
        <div style={cardStyle}>
          <h3 style={{ textAlign: "center", marginBottom: "15px" }}>
            Yearly Trends of Heavy Metals
          </h3>
          <LineChart width={500} height={300} data={timeSeriesData}>
            <CartesianGrid stroke="#ffffff20" strokeDasharray="3 3" />
            <XAxis dataKey="year" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Pb" stroke="#8884d8" />
            <Line type="monotone" dataKey="Cd" stroke="#82ca9d" />
            <Line type="monotone" dataKey="As" stroke="#ffc658" />
            <Line type="monotone" dataKey="Hg" stroke="#ff7f7f" />
          </LineChart>
        </div>

        {/* Map */}
        <div style={cardStyle}>
          <h3 style={{ textAlign: "center", marginBottom: "15px" }}>
            Heavy Metal Distribution Map
          </h3>
          <MapContainer
            center={[20.3, 85.8]}
            zoom={7}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {locations.map((loc, idx) => (
              <CircleMarker
                key={idx}
                center={[loc.lat, loc.lng]}
                radius={10}
                color={loc.value > 30 ? "red" : "lime"}
              >
                <Popup style={{ color: "#000" }}>
                  <b>{loc.metal}</b> level: {loc.value} ppm
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Bar Chart */}
        <div style={cardStyle}>
          <h3 style={{ textAlign: "center", marginBottom: "15px" }}>
            Heavy Metal Levels in Samples
          </h3>
          <BarChart width={500} height={300} data={barData}>
            <CartesianGrid stroke="#ffffff20" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip />
            <Legend />
            <Bar dataKey="Pb" fill="#8884d8" />
            <Bar dataKey="Cd" fill="#82ca9d" />
            <Bar dataKey="As" fill="#ffc658" />
            <Bar dataKey="Hg" fill="#ff7f7f" />
          </BarChart>
        </div>

        {/* Table */}
        <div style={cardStyle}>
          <h3 style={{ textAlign: "center", marginBottom: "15px" }}>
            Top Contaminated Samples
          </h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Sample</th>
                <th style={thStyle}>Total Pollution (ppm)</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Alert</th>
              </tr>
            </thead>
            <tbody>
              {topContaminated.map((item, idx) => (
                <tr
                  key={idx}
                  style={{ backgroundColor: idx % 2 === 0 ? "#1f2e5a" : "#1a2a4f" }}
                >
                  <td style={tdStyle}>{item.sample}</td>
                  <td style={tdStyle}>{item.total}</td>
                  <td
                    style={{
                      ...tdStyle,
                      color: getStatusColor(item.status),
                      fontWeight: "600",
                    }}
                  >
                    {item.status}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    {getAlertIcon(item.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Visualization;
