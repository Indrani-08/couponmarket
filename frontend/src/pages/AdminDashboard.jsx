import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import { FiUsers, FiTag, FiFileText, FiPieChart, FiTrash2, FiCheckCircle } from "react-icons/fi";

function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Re-fetch data depending on active tab
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
      console.error(err);
      alert("Error fetching admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete user");
      }
    }
  };

  const handleToggleRole = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/role`);
      setUsers(users.map(u => u._id === id ? { ...u, role: res.data.role } : u));
    } catch (err) {
      console.error(err);
      alert("Failed to change user role");
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await api.delete(`/admin/coupons/${id}`);
        setCoupons(coupons.filter(c => c._id !== id));
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
      setCoupons(coupons.map(c => c._id === id ? { ...c, verified: newStatus } : c));
    } catch (err) {
      console.error(err);
      alert("Failed to update coupon verification");
    }
  };

  if (user?.role?.toUpperCase() !== "ADMIN") {
    return (
      <div className="container section text-center py-20 min-h-[50vh] flex flex-col justify-center items-center">
        <h2 className="text-3xl text-red-500 font-bold mb-4">Admin Access Required</h2>
        <p className="text-gray-500 mb-8">You do not have permission to view the Admin Dashboard.</p>
        <button className="btn btn-primary" onClick={() => window.location.href = '/browse'}>Return to Browse</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-4 max-w-[95%]">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        
        {/* Sidebar */}
        <div className="flex-shrink-0 w-full md:w-56 sticky top-20">
          <div className="glass-card p-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-lg font-bold mb-4 px-2 gradient-text">Admin Panel</h2>
            <nav className="flex flex-col gap-1">
              <button
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-indigo-600'}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <FiPieChart className="text-sm" /> Overview
              </button>
              <button
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-indigo-600'}`}
                onClick={() => setActiveTab('users')}
              >
                <FiUsers className="text-sm" /> Users
              </button>
              <button
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all ${activeTab === 'coupons' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-indigo-600'}`}
                onClick={() => setActiveTab('coupons')}
              >
                <FiTag className="text-sm" /> Coupons
              </button>
              <button
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all ${activeTab === 'transactions' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-indigo-600'}`}
                onClick={() => setActiveTab('transactions')}
              >
                <FiFileText className="text-sm" /> Transactions
              </button>
              
              <hr className="my-2 border-gray-200 dark:border-gray-700" />
              
              <button
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-indigo-600"
                onClick={() => window.location.href = '/browse'}
              >
                Return to Shop
              </button>
              <button
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.dispatchEvent(new Event("authChanged"));
                  window.location.href = '/login';
                }}
              >
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 w-full overflow-hidden">
          {loading ? (
            <div className="flex justify-center p-12 text-indigo-500">
               <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            </div>
          ) : (
            <div className="glass-card shadow-sm border border-gray-100 dark:border-gray-800 p-0 min-h-[500px]">
              
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && stats && (
                <div className="p-4 md:p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Platform Overview</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                <FiUsers className="text-xl text-blue-500 mb-2" />
                <h3 className="text-gray-500 text-[10px] font-medium uppercase tracking-wider mb-1">Total Users</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
                <FiTag className="text-xl text-purple-500 mb-2" />
                <h3 className="text-gray-500 text-[10px] font-medium uppercase tracking-wider mb-1">Total Coupons</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCoupons}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
                <FiFileText className="text-xl text-green-500 mb-2" />
                <h3 className="text-gray-500 text-[10px] font-medium uppercase tracking-wider mb-1">Transactions</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTransactions}</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-800">
                <FiPieChart className="text-xl text-yellow-500 mb-2" />
                <h3 className="text-gray-500 text-[10px] font-medium uppercase tracking-wider mb-1">Platform Revenue</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{stats.totalRevenue}</p>
              </div>
            </div>
          </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Name</th>
                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Email</th>
                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Role</th>
                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Joined</th>
                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4">{u.name || "N/A"}</td>
                      <td className="py-3 px-4">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role?.toUpperCase() === 'ADMIN' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                          {u.role || "USER"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button 
                          onClick={() => handleToggleRole(u._id)} 
                          className={`p-2 transition-colors ${u.role?.toUpperCase() === 'ADMIN' ? 'text-yellow-500 hover:text-yellow-700' : 'text-green-500 hover:text-green-700'}`} 
                          title={u.role?.toUpperCase() === 'ADMIN' ? 'Revoke Admin' : 'Make Admin'}
                        >
                          <FiUsers />
                        </button>
                        <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 hover:text-red-700 transition-colors p-2" title="Delete User">
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && <tr><td colSpan="5" className="text-center py-8 text-gray-500">No users found</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* Coupons Tab */}
          {activeTab === 'coupons' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Title & Code</th>
                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Seller</th>
                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Price</th>
                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Verified</th>
                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map(c => (
                    <tr key={c._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4">
                        <div className="font-bold">{c.title}</div>
                        <div className="text-xs text-gray-500">{c.code}</div>
                      </td>
                      <td className="py-3 px-4 text-sm">{c.userId?.email || 'Unknown'}</td>
                      <td className="py-3 px-4 font-medium text-green-600">₹{c.price}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${c.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : c.status === 'SOLD' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {c.status || "PENDING"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${c.verified ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                          {c.verified ? "VERIFIED" : "UNVERIFIED"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button 
                          onClick={() => handleVerifyCoupon(c._id, c.verified)} 
                          className={`p-2 transition-colors ${c.verified ? 'text-yellow-500 hover:text-yellow-700' : 'text-green-500 hover:text-green-700'}`} 
                          title={c.verified ? "Revoke Verification" : "Verify Coupon"}
                        >
                          <FiCheckCircle />
                        </button>
                        <button onClick={() => handleDeleteCoupon(c._id)} className="text-red-500 hover:text-red-700 transition-colors p-2" title="Delete Coupon">
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {coupons.length === 0 && <tr><td colSpan="6" className="text-center py-8 text-gray-500">No coupons found</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Txn ID</th>
                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">User</th>
                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Coupon</th>
                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Amount</th>
                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-sm">
                      <td className="py-3 px-4 font-mono text-xs">{t.payment_id}</td>
                      <td className="py-3 px-4">{t.user_id?.email || 'Unknown'}</td>
                      <td className="py-3 px-4">{t.coupon_id?.title || 'Unknown'}</td>
                      <td className="py-3 px-4 font-bold text-green-600">₹{t.amount}</td>
                      <td className="py-3 px-4">
                         <span className={`px-2 py-1 rounded-full text-xs font-bold ${t.payment_status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {t.payment_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{new Date(t.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                  {transactions.length === 0 && <tr><td colSpan="6" className="text-center py-8 text-gray-500">No transactions found</td></tr>}
                </tbody>
              </table>
            </div>
          )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
