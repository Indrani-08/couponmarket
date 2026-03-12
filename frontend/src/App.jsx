import React, { useEffect, useState, Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthLayout from "./components/AuthLayout";
import MainLayout from "./components/MainLayout";
import { getStoredUser, isAuthenticated, setStoredUser } from "./utils/auth";
import { setScopedNumber } from "./utils/userScopedStorage";
import api from "./services/api";

import "./App.css";

const CouponsPage = lazy(() => import("./pages/CouponsPage"));
const UploadCoupon = lazy(() => import("./pages/UploadCoupon"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const ClaimedCoupons = lazy(() => import("./pages/ClaimedCoupons"));
const RewardsPage = lazy(() => import("./pages/RewardsPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const EntryPage = lazy(() => import("./pages/EntryPage"));
const Profile = lazy(() => import("./pages/Profile"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const EditCoupon = lazy(() => import("./pages/EditCoupon"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));

const LoadingFallback = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <h2>Loading...</h2>
  </div>
);

function App() {
  const [user, setUser] = useState(getStoredUser());

  const userEmail = user?.email || "";
  const username = userEmail ? userEmail.split("@")[0] : "User";

  useEffect(() => {
    if (!isAuthenticated()) {
      setUser(null);
      return;
    }

    let active = true;
    const loadProfile = async () => {
      try {
        const res = await api.get("/auth/profile");
        if (!active) return;
        setStoredUser(res.data);
        setScopedNumber("walletBalance", res.data.walletBalance ?? 0);
        window.dispatchEvent(new Event("walletUpdated"));
        setUser(res.data);
      } catch {
        if (!active) return;
        setUser(getStoredUser());
      }
    };

    const syncStoredUser = () => setUser(getStoredUser());
    loadProfile();
    window.addEventListener("storage", syncStoredUser);
    window.addEventListener("authChanged", syncStoredUser);

    return () => {
      active = false;
      window.removeEventListener("storage", syncStoredUser);
      window.removeEventListener("authChanged", syncStoredUser);
    };
  }, []);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<EntryPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* Regular User Routes wrapped in MainLayout */}
        <Route element={<ProtectedRoute><MainLayout user={user} username={username} userEmail={userEmail} /></ProtectedRoute>}>
          <Route path="/browse" element={<CouponsPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/upload" element={<UploadCoupon />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/claimed" element={<ClaimedCoupons />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit/:id" element={<EditCoupon />} />
        </Route>

        {/* Admin Dashboard distinct route */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard user={user} />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Suspense>
  );
}

export default App;
