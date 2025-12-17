// src/components/RoleBasedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user) {
    // User is not logged in
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // User is logged in but does not have permission
    return <Navigate to="/dashboard" replace />;
  }

  // User has the correct role
  return children;
};

export default RoleBasedRoute;
