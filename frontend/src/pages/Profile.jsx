import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { FiUser, FiCalendar, FiPhone, FiCreditCard, FiPieChart, FiTarget, FiClock, FiDollarSign, FiLogOut, FiSearch, FiPlusCircle } from "react-icons/fi";
import { logout } from "../components/logout";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    upi_id: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      setProfile(res.data);
      setFormData({
        name: res.data.name || "",
        phone: res.data.phone || "",
        upi_id: res.data.upi_id || "",
      });
    } catch (err) {
      console.error("Error fetching profile", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/profile/stats");
      setStats(res.data);
      const paymentsRes = await api.get("/profile/payments");
      setPayments(paymentsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching stats or payments", err);
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\s+/g, ''))) {
      setMessage("Please enter a valid 10-digit phone number.");
      return;
    }
    if (formData.upi_id && !/^[a-zA-Z0-9.\-_]+@[a-zA-Z0-9.\-_]+$/.test(formData.upi_id)) {
      setMessage("Please enter a valid UPI ID (e.g., name@okaxis).");
      return;
    }
    try {
      const res = await api.put("/profile", formData);
      setProfile(res.data);
      setEditing(false);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    }
  };
  const handleLogout = () => {
    logout(navigate);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="container section">
      {/* Profile Header & Menu Bar */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold gradient-text mb-6">User Profile</h1>

        {/* Quick Menu Bar */}
        <div className="glass-card flex flex-wrap items-center gap-4 md:gap-8 p-4">
          <Link to="/claimed" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
            <FiPieChart className="text-primary" /> Dashboard
          </Link>
          <Link to="/browse" className="flex items-center gap-2 text-sm font-medium hover:text-secondary transition-colors">
            <FiSearch className="text-secondary" /> Browser
          </Link>
          <Link to="/upload" className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors">
            <FiPlusCircle className="text-accent" /> Sale Coupon
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="glass-card flex flex-col items-center">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-4xl text-primary mb-6 transition-transform group-hover:scale-110">
              <FiUser />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-1">{profile?.name || "Member"}</h2>
          <p className="text-text-secondary text-sm mb-6">{profile?.email}</p>

          <div className="w-full space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <FiCalendar className="text-primary" />
              <span>Joined {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FiPhone className="text-primary" />
              <span>{profile?.phone || "No phone linked"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FiCreditCard className="text-primary" />
              <span>{profile?.upi_id || "No UPI linked"}</span>
            </div>
          </div>

          <div className="w-full space-y-3 mt-8">
            <button
              className="btn btn-secondary w-full"
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
            <button
              className="btn w-full flex items-center justify-center gap-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
              onClick={handleLogout}
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>

        {/* Dynamic Stats & Edit Form */}
        <div className="md:col-span-2 space-y-8">
          {editing ? (
            <div className="glass-card animate-fade-in">
              <h3 className="text-xl font-bold mb-6">Edit Profile Details</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm mb-2 text-text-secondary">Full Name</label>
                  <input
                    type="text"
                    className="w-full glass p-3 outline-none focus:border-primary transition-colors rounded-lg"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-text-secondary">Phone Number</label>
                  <input
                    type="text"
                    className="w-full glass p-3 outline-none focus:border-primary transition-colors rounded-lg"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-text-secondary">UPI ID (for payments)</label>
                  <input
                    type="text"
                    className="w-full glass p-3 outline-none focus:border-primary transition-colors rounded-lg"
                    value={formData.upi_id}
                    onChange={(e) => setFormData({ ...formData, upi_id: e.target.value })}
                    placeholder="yourname@upi"
                  />
                </div>
                {message && <p className={`text-sm ${message.includes("failed") ? "text-red-400" : "text-accent"}`}>{message}</p>}
                <button type="submit" className="btn btn-primary w-full mt-4">Save Changes</button>
              </form>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
                <div className="glass-card p-6 text-center hover:border-primary/50 transition-colors">
                  <FiPieChart className="text-primary text-2xl mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats?.couponsCreated || 0}</div>
                  <div className="text-xs text-text-secondary uppercase tracking-wider">Created</div>
                </div>
                <div className="glass-card p-6 text-center hover:border-secondary/50 transition-colors">
                  <FiTarget className="text-secondary text-2xl mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats?.couponsPurchased || 0}</div>
                  <div className="text-xs text-text-secondary uppercase tracking-wider">Purchased</div>
                </div>
                <div className="glass-card p-6 text-center hover:border-accent/50 transition-colors">
                  <FiClock className="text-accent text-2xl mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats?.activeCoupons || 0}</div>
                  <div className="text-xs text-text-secondary uppercase tracking-wider">Active</div>
                </div>
                <div className="glass-card p-6 text-center hover:border-green-400/50 transition-colors">
                  <FiDollarSign className="text-green-400 text-2xl mx-auto mb-2" />
                  <div className="text-2xl font-bold">₹{stats?.totalEarnings || 0}</div>
                  <div className="text-xs text-text-secondary uppercase tracking-wider">Earnings</div>
                </div>
              </div>

              <div className="glass-card">
                <h3 className="font-bold mb-6 flex items-center gap-2">
                  <FiClock className="text-primary" /> Payment History
                </h3>
                {payments.length === 0 ? (
                  <div className="text-center py-12 text-text-secondary text-sm">
                    No transactions found yet. Start browsing to unlock deals!
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {payments.map(txn => (
                      <div key={txn._id} className="glass p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="font-bold">{txn.coupon_id?.title || "Unknown Coupon"}</p>
                          <p className="text-xs text-text-secondary">{new Date(txn.createdAt).toLocaleDateString()} • {txn.payment_id || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-400">₹{txn.amount}</p>
                          <p className="text-[10px] uppercase font-bold text-text-secondary">{txn.payment_status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
