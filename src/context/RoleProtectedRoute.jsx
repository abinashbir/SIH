// src/context/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // If user is not logged in, redirect to dashboard
  if (!user) {
    return <Navigate to="/dashboard" replace />;
  }

  // If logged in, allow access
  return children;
};

export default ProtectedRoute;
