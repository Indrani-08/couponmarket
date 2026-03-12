import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const AuthLayout = () => {
  const location = useLocation();
  const isEntryPage = location.pathname === "/";

  if (isAuthenticated() && location.pathname !== "/admin/login") {
    return <Navigate to="/browse" replace />;
  }

  // Entry (landing) page: full-width, no card wrapper
  if (isEntryPage) {
    return <Outlet />;
  }

  // Login / Register / Forgot Password: centered card layout
  return (
    <div className="auth-page">
      <div className="auth-card">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
