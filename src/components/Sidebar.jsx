// src/components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaUpload,
  FaTachometerAlt,
  FaBars,
  FaChartLine,
  FaRegFileAlt,
} from "react-icons/fa";
import "./sidebar.css";

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { path: "/upload", label: "Upload", icon: <FaUpload /> },
  // { path: "/visualization", label: "Visualization", icon: <FaChartLine /> },
  { path: "/reports", label: "Reports", icon: <FaRegFileAlt /> },
];

function Sidebar({ onToggle }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <div
      className={`sidebar ${isOpen ? "open" : "collapsed"}`}
      style={{
        width: isOpen ? "200px" : "60px",
        background: "linear-gradient(180deg, #1a2a6c, #0d1b33)",
        color: "#fff",
        height: "100vh",
        transition: "width 0.3s",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 2001,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="toggle-btn"
        style={{
          background: "#142850",
          border: "none",
          color: "white",
          fontSize: "20px",
          margin: "10px auto",
          cursor: "pointer",
          padding: "10px 15px",
          borderRadius: "6px",
          transition: "background 0.3s",
        }}
      >
        <FaBars />
      </button>

      {/* Menu Items */}
      <div className="sidebar-links" style={{ marginTop: "20px", flex: 1 }}>
        {menuItems.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            title={!isOpen ? label : ""}
          >
            <span className="icon">{icon}</span>
            {isOpen && <span className="label">{label}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
