import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { saveAuth } from "../utils/auth";
import { FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import "./Login.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password
      });

      if (res.data.user.role?.toUpperCase() !== 'ADMIN') {
        setError("Access Denied. Only Administrators can log in here.");
        setLoading(false);
        return;
      }

      saveAuth({ token: res.data.token, user: res.data.user });
      // Clear wallet cache on login
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ borderTop: "4px solid #4f46e5" }}>
        <div className="flex justify-center mb-4 text-indigo-600">
          <FiShield size={48} />
        </div>
        <h2 className="login-title">Admin Portal</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Sign in to manage the marketplace</p>

        <form onSubmit={handleLogin}>
          <input
            className="login-input"
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-input-wrapper">
            <input
              className="login-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle flex items-center justify-center text-gray-500 hover:text-indigo-500 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
            </button>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Authenticating..." : "Admin Login"}
          </button>
        </form>
        
        <div className="login-links">
          <p>
            <span onClick={() => navigate("/login")}>
              Return to User Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
