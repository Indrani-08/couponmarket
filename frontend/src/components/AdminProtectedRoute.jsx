import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getStoredUser } from "../utils/auth";

function AdminProtectedRoute({ children }) {
  const location = useLocation();
  const user = getStoredUser();

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (user?.role?.toUpperCase() !== "ADMIN") {
    // If authenticated but not admin, redirect to browse with a warning or just browse
    return <Navigate to="/browse" replace />;
  }

  return children;
}

export default AdminProtectedRoute;
