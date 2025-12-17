import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaSearch } from "react-icons/fa";

function Navbar({ sidebarOpen }) {
  const { user, logout } = useAuth();

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        background: "linear-gradient(90deg, #1e3a8a, #2563eb)",
        borderBottom: "1px solid #0f172a",
        position: "fixed",
        top: 0,
        left: sidebarOpen ? "200px" : "60px",
        width: `calc(100% - ${sidebarOpen ? "200px" : "60px"})`,
        zIndex: 1000,
        transition: "all 0.3s",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Left side: Title */}
      <h1
        style={{
          color: "white",
          fontSize: "20px",
          fontWeight: "bold",
          letterSpacing: "1px",
        }}
      >
        Water Safety Index
      </h1>

      {/* Right side: Search + Auth */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          flexShrink: 0,
          marginRight: "30px",
        }}
      >
        {/* Search box */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "white",
            borderRadius: "20px",
            padding: "4px 10px",
            maxWidth: "180px",
          }}
        >
          <input
            type="text"
            placeholder="Search..."
            style={{
              border: "none",
              outline: "none",
              flex: 1,
              fontSize: "14px",
              background: "transparent",
              minWidth: "80px",
            }}
          />
          <FaSearch style={{ color: "#2563eb", cursor: "pointer" }} />
        </div>

        {/* Auth buttons */}
        {!user ? (
          <Link to="/login" style={linkStyle}>
            Login
          </Link>
        ) : (
          <button onClick={logout} style={btnStyle}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "600",
};

const btnStyle = {
  background: "transparent",
  border: "1px solid white",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
  padding: "6px 16px",
  borderRadius: "8px",
};

export default Navbar;
