import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  FiUsers, FiTag, FiFileText, FiPieChart,
  FiTrash2, FiCheckCircle, FiShield, FiLogOut, FiArrowLeft
} from "react-icons/fi";

function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "dashboard") {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } else if (activeTab === "users") {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      } else if (activeTab === "coupons") {
        const res = await api.get("/admin/coupons");
        setCoupons(res.data);
      } else if (activeTab === "transactions") {
        const res = await api.get("/admin/transactions");
        setTransactions(res.data);
      }
    } catch (err) {
      console.error("Fetch Data Error:", err);
      if (err.response?.status === 403) {
        alert("Access Denied: You are not an admin.");
        window.location.href = "/browse";
      } else {
        alert("Error fetching admin data: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/users/${id}`);
        setUsers(users.filter((u) => u._id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete user");
      }
    }
  };

  const handleToggleRole = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/role`);
      setUsers(users.map((u) => (u._id === id ? { ...u, role: res.data.role } : u)));
    } catch (err) {
      console.error(err);
      alert("Failed to change user role");
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await api.delete(`/admin/coupons/${id}`);
        setCoupons(coupons.filter((c) => c._id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete coupon");
      }
    }
  };

  const handleVerifyCoupon = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await api.put(`/admin/coupons/${id}/verify`, { verified: newStatus });
      setCoupons(coupons.map((c) => (c._id === id ? { ...c, verified: newStatus } : c)));
    } catch (err) {
      console.error(err);
      alert("Failed to update coupon verification");
    }
  };

  if (user?.role?.toUpperCase() !== "ADMIN") {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ background: "#fff", border: "2px solid #fee2e2", borderRadius: "16px", padding: "48px", maxWidth: "480px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <h2 style={{ color: "#ef4444", fontSize: "24px", fontWeight: "800", marginBottom: "12px" }}>Admin Access Required</h2>
          <p style={{ color: "#6b7280", marginBottom: "24px" }}>This portal is reserved for administrators only.</p>
          <button
            style={{ background: "#4f46e5", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 28px", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}
            onClick={() => (window.location.href = "/browse")}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const navTabs = [
    { id: "dashboard", label: "Overview",     icon: <FiPieChart /> },
    { id: "users",     label: "Users",        icon: <FiUsers /> },
    { id: "coupons",   label: "Coupons",      icon: <FiTag /> },
    { id: "transactions", label: "Transactions", icon: <FiFileText /> },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: "32px 16px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* ── Header ───────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
          <div style={{ background: "#4f46e5", borderRadius: "12px", padding: "10px", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(79,70,229,0.35)" }}>
            <FiShield style={{ fontSize: "22px" }} />
          </div>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#1e1b4b", margin: 0 }}>Admin Panel</h1>
            <p style={{ fontSize: "11px", color: "#6b7280", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: "600", margin: 0 }}>Control Center</p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
            <button
              onClick={() => (window.location.href = "/browse")}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", color: "#6b7280", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}
            >
              <FiArrowLeft /> Return to Shop
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.dispatchEvent(new Event("authChanged"));
                window.location.href = "/login";
              }}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "8px", border: "1px solid #fee2e2", background: "#fff5f5", color: "#ef4444", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>

        {/* ── Horizontal Tab Navigation ─────────────────────────── */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", background: "#fff", padding: "10px 12px", borderRadius: "14px", marginBottom: "20px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" }}>
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.18s ease",
                background: activeTab === tab.id ? "#4f46e5" : "transparent",
                color: activeTab === tab.id ? "#fff" : "#6b7280",
                boxShadow: activeTab === tab.id ? "0 4px 12px rgba(79,70,229,0.3)" : "none",
              }}
            >
              <span style={{ fontSize: "15px" }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Content Panel ─────────────────────────────────────── */}
        <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid #e5e7eb", minHeight: "520px", padding: "28px" }}>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "400px", color: "#4f46e5" }}>
              <svg style={{ width: "40px", height: "40px", marginBottom: "16px", animation: "spin 1s linear infinite" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p style={{ fontWeight: "600", fontSize: "14px" }}>Syncing platform data...</p>
            </div>
          ) : (
            <>
              {/* ── Overview Tab ─────────────────────────────── */}
              {activeTab === "dashboard" && stats && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                    <div>
                      <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", margin: 0 }}>Platform Summary</h2>
                      <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "4px" }}>Real-time performance metrics</p>
                    </div>
                    <span style={{ padding: "4px 14px", background: "#f0fdf4", color: "#16a34a", borderRadius: "999px", fontSize: "11px", fontWeight: "700", border: "1px solid #bbf7d0", textTransform: "uppercase", letterSpacing: "0.08em" }}>System Online</span>
                  </div>

                  {/* Stats Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
                    {[
                      { label: "Total Users",      value: stats.totalUsers,        bg: "#eff6ff", border: "#bfdbfe", icon: <FiUsers />,    color: "#3b82f6" },
                      { label: "Total Coupons",    value: stats.totalCoupons,      bg: "#faf5ff", border: "#e9d5ff", icon: <FiTag />,      color: "#8b5cf6" },
                      { label: "Transactions",     value: stats.totalTransactions, bg: "#f0fdf4", border: "#bbf7d0", icon: <FiFileText />, color: "#22c55e" },
                      { label: "Platform Revenue", value: `₹${stats.totalRevenue}`,bg: "#fffbeb", border: "#fde68a", icon: <FiPieChart />, color: "#f59e0b" },
                    ].map((s, i) => (
                      <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: "12px", padding: "20px" }}>
                        <div style={{ color: s.color, fontSize: "20px", marginBottom: "10px" }}>{s.icon}</div>
                        <p style={{ fontSize: "11px", fontWeight: "600", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>{s.label}</p>
                        <p style={{ fontSize: "26px", fontWeight: "800", color: "#111827", margin: 0 }}>{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h4 style={{ fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <FiCheckCircle style={{ color: "#22c55e" }} /> Recent System Activities
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {[
                        { text: "System sync completed successfully", time: "Just now" },
                        { text: `Monitored ${stats.totalUsers} active user sessions`, time: "2 mins ago" },
                        { text: "New transaction reported in database", time: "15 mins ago" },
                        { text: "Automated verification sweep completed", time: "1 hour ago" },
                      ].map((act, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#f9fafb", borderRadius: "8px", fontSize: "13px" }}>
                          <span style={{ color: "#4b5563", fontWeight: "500" }}>{act.text}</span>
                          <span style={{ color: "#9ca3af", fontSize: "12px", fontStyle: "italic", flexShrink: 0, marginLeft: "16px" }}>{act.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Users Tab ────────────────────────────────── */}
              {activeTab === "users" && (
                <div>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", margin: 0 }}>User Management</h2>
                    <div style={{ position: "relative" }}>
                      <FiUsers style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                      <input
                        type="text"
                        placeholder="Search by email or name..."
                        style={{ paddingLeft: "34px", paddingRight: "14px", paddingTop: "8px", paddingBottom: "8px", border: "1px solid #e5e7eb", borderRadius: "10px", fontSize: "13px", outline: "none", width: "240px", background: "#f9fafb" }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #f3f4f6" }}>
                          {["Name", "Email", "Role", "Joined", "Actions"].map((h, i) => (
                            <th key={i} style={{ padding: "10px 14px", textAlign: i === 4 ? "right" : "left", fontWeight: "700", color: "#6b7280", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users
                          .filter((u) => u.email.toLowerCase().includes(searchTerm.toLowerCase()) || (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()))
                          .map((u) => (
                            <tr key={u._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                              <td style={{ padding: "12px 14px", fontWeight: "600", color: "#111827" }}>{u.name || "N/A"}</td>
                              <td style={{ padding: "12px 14px", color: "#6b7280" }}>{u.email}</td>
                              <td style={{ padding: "12px 14px" }}>
                                <span style={{ padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "700", background: u.role?.toUpperCase() === "ADMIN" ? "#eef2ff" : "#f3f4f6", color: u.role?.toUpperCase() === "ADMIN" ? "#4f46e5" : "#6b7280" }}>
                                  {u.role || "USER"}
                                </span>
                              </td>
                              <td style={{ padding: "12px 14px", color: "#9ca3af" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                              <td style={{ padding: "12px 14px", textAlign: "right" }}>
                                <button onClick={() => handleToggleRole(u._id)} style={{ marginRight: "6px", padding: "6px", borderRadius: "6px", border: "none", cursor: "pointer", background: u.role?.toUpperCase() === "ADMIN" ? "#fef9c3" : "#f0fdf4", color: u.role?.toUpperCase() === "ADMIN" ? "#ca8a04" : "#16a34a", fontSize: "15px" }} title={u.role?.toUpperCase() === "ADMIN" ? "Revoke Admin" : "Make Admin"}>
                                  <FiUsers />
                                </button>
                                <button onClick={() => handleDeleteUser(u._id)} style={{ padding: "6px", borderRadius: "6px", border: "none", cursor: "pointer", background: "#fff5f5", color: "#ef4444", fontSize: "15px" }} title="Delete User">
                                  <FiTrash2 />
                                </button>
                              </td>
                            </tr>
                          ))}
                        {users.length === 0 && (
                          <tr><td colSpan={5} style={{ textAlign: "center", padding: "60px", color: "#9ca3af", fontWeight: "600" }}>No users found</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── Coupons Tab ───────────────────────────────── */}
              {activeTab === "coupons" && (
                <div>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", margin: 0 }}>Coupon Control</h2>
                    <div style={{ display: "flex", gap: "6px", background: "#f3f4f6", padding: "4px", borderRadius: "10px" }}>
                      {["ALL", "AVAILABLE", "SOLD"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setFilterStatus(s)}
                          style={{ padding: "6px 14px", borderRadius: "7px", border: "none", fontWeight: "700", fontSize: "11px", cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase", background: filterStatus === s ? "#fff" : "transparent", color: filterStatus === s ? "#4f46e5" : "#9ca3af", boxShadow: filterStatus === s ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #f3f4f6" }}>
                          {["Title & Code", "Seller", "Price", "Status", "Verified", "Actions"].map((h, i) => (
                            <th key={i} style={{ padding: "10px 14px", textAlign: i === 5 ? "right" : "left", fontWeight: "700", color: "#6b7280", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {coupons.filter((c) => filterStatus === "ALL" || c.status === filterStatus).map((c) => (
                          <tr key={c._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                            <td style={{ padding: "12px 14px" }}>
                              <div style={{ fontWeight: "700", color: "#111827" }}>{c.title}</div>
                              <div style={{ fontSize: "11px", color: "#9ca3af" }}>{c.code}</div>
                            </td>
                            <td style={{ padding: "12px 14px", color: "#6b7280" }}>{c.userId?.email || "Unknown"}</td>
                            <td style={{ padding: "12px 14px", fontWeight: "700", color: "#16a34a" }}>₹{c.price}</td>
                            <td style={{ padding: "12px 14px" }}>
                              <span style={{ padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "700", background: c.status === "AVAILABLE" ? "#f0fdf4" : c.status === "SOLD" ? "#eff6ff" : "#fffbeb", color: c.status === "AVAILABLE" ? "#16a34a" : c.status === "SOLD" ? "#3b82f6" : "#f59e0b" }}>
                                {c.status || "PENDING"}
                              </span>
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                              <span style={{ padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "700", background: c.verified ? "#eff6ff" : "#fff5f5", color: c.verified ? "#4f46e5" : "#ef4444" }}>
                                {c.verified ? "VERIFIED" : "UNVERIFIED"}
                              </span>
                            </td>
                            <td style={{ padding: "12px 14px", textAlign: "right" }}>
                              <button onClick={() => handleVerifyCoupon(c._id, c.verified)} style={{ marginRight: "6px", padding: "6px", borderRadius: "6px", border: "none", cursor: "pointer", background: c.verified ? "#fef9c3" : "#f0fdf4", color: c.verified ? "#ca8a04" : "#16a34a", fontSize: "15px" }} title={c.verified ? "Revoke Verification" : "Verify Coupon"}>
                                <FiCheckCircle />
                              </button>
                              <button onClick={() => handleDeleteCoupon(c._id)} style={{ padding: "6px", borderRadius: "6px", border: "none", cursor: "pointer", background: "#fff5f5", color: "#ef4444", fontSize: "15px" }} title="Delete Coupon">
                                <FiTrash2 />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {coupons.length === 0 && (
                          <tr><td colSpan={6} style={{ textAlign: "center", padding: "60px", color: "#9ca3af", fontWeight: "600" }}>No coupons found</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── Transactions Tab ──────────────────────────── */}
              {activeTab === "transactions" && (
                <div>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", margin: 0 }}>Transaction History</h2>
                    <div style={{ padding: "8px 16px", background: "#f0fdf4", color: "#16a34a", borderRadius: "8px", border: "1px solid #bbf7d0", fontSize: "12px", fontWeight: "700" }}>
                      Total Success: {transactions.filter((t) => t.payment_status === "SUCCESS").length}
                    </div>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "820px" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #f3f4f6" }}>
                          {["Transaction ID", "Buyer", "Seller", "Coupon Info", "Amount", "Status", "Date & Time"].map((h, i) => (
                            <th key={i} style={{ padding: "10px 14px", textAlign: i === 6 ? "right" : "left", fontWeight: "700", color: "#6b7280", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((t) => (
                          <tr key={t._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                            <td style={{ padding: "12px 14px" }}>
                              <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#9ca3af", fontWeight: "600" }}>TXN-{t.payment_id.slice(-8).toUpperCase()}</div>
                              <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#d1d5db", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100px" }} title={t.payment_id}>{t.payment_id}</div>
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                              <div style={{ fontWeight: "600", color: "#111827" }}>{t.user_id?.name || "Anonymous"}</div>
                              <div style={{ fontSize: "11px", color: "#9ca3af" }}>{t.user_id?.email || "Unknown"}</div>
                            </td>
                            <td style={{ padding: "12px 14px", fontSize: "12px", color: "#9ca3af", fontStyle: "italic" }}>{t.coupon_id?.seller?.email || "N/A"}</td>
                            <td style={{ padding: "12px 14px" }}>
                              <div style={{ borderLeft: "3px solid #4f46e5", paddingLeft: "10px" }}>
                                <div style={{ fontWeight: "700", color: "#374151", fontSize: "13px" }}>{t.coupon_id?.title}</div>
                                <div style={{ fontSize: "10px", color: "#9ca3af" }}>CODE: {t.coupon_id?.code}</div>
                              </div>
                            </td>
                            <td style={{ padding: "12px 14px", fontWeight: "800", color: "#111827" }}>₹{t.amount}</td>
                            <td style={{ padding: "12px 14px" }}>
                              <span style={{ padding: "4px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "800", letterSpacing: "0.06em", textTransform: "uppercase", background: t.payment_status === "SUCCESS" ? "rgba(34,197,94,0.1)" : t.payment_status === "FAILED" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)", color: t.payment_status === "SUCCESS" ? "#16a34a" : t.payment_status === "FAILED" ? "#dc2626" : "#d97706", border: `1px solid ${t.payment_status === "SUCCESS" ? "rgba(34,197,94,0.25)" : t.payment_status === "FAILED" ? "rgba(239,68,68,0.25)" : "rgba(245,158,11,0.25)"}` }}>
                                {t.payment_status}
                              </span>
                            </td>
                            <td style={{ padding: "12px 14px", textAlign: "right" }}>
                              <div style={{ color: "#374151", fontSize: "13px" }}>{new Date(t.createdAt).toLocaleDateString()}</div>
                              <div style={{ color: "#9ca3af", fontSize: "11px" }}>{new Date(t.createdAt).toLocaleTimeString()}</div>
                            </td>
                          </tr>
                        ))}
                        {transactions.length === 0 && (
                          <tr><td colSpan={7} style={{ textAlign: "center", padding: "60px", color: "#9ca3af", fontWeight: "600", fontStyle: "italic" }}>No transaction records found</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
