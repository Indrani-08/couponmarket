import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getStoredUser } from "../utils/auth";
import { FiCopy, FiCheck, FiPieChart, FiTag, FiClock, FiDollarSign, FiPlusCircle, FiEdit2, FiTrash2 } from "react-icons/fi";

function ClaimedCoupons() {
    const navigate = useNavigate();
    const [purchasedCoupons, setPurchasedCoupons] = useState([]);
    const [listedCoupons, setListedCoupons] = useState([]);
    const [stats, setStats] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const currentUser = getStoredUser();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch purchased coupons (boughtBy current user)
            const [couponsRes, statsRes] = await Promise.all([
                api.get("/coupons"),
                api.get("/profile/stats"),
            ]);
            // Filter for coupons purchased and listed by current user
            const allCoupons = couponsRes.data;
            setPurchasedCoupons(allCoupons.filter(c => c.status === "SOLD" && c.boughtBy === currentUser?._id));
            setListedCoupons(allCoupons.filter(c => c.userId === currentUser?._id));
            setStats(statsRes.data);
        } catch (err) {
            console.error("Error fetching data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (id, code) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this coupon?")) {
            try {
                await api.delete(`/coupons/${id}`);
                setListedCoupons(listedCoupons.filter(c => c._id !== id));
            } catch (err) {
                console.error("Failed to delete coupon", err);
                alert("Failed to delete the coupon. Please try again.");
            }
        }
    };

    if (loading) return <div className="p-12 text-center text-text-secondary">Loading dashboard...</div>;

    return (
        <div className="container section">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
                    <p className="text-text-secondary">Track your coupon activity and earnings.</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate("/upload")}>
                    <FiPlusCircle /> Sell a Coupon
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                <div className="glass-card p-6 text-center">
                    <FiPieChart className="text-primary text-3xl mx-auto mb-3" />
                    <div className="text-3xl font-bold mb-1">{stats?.couponsCreated || 0}</div>
                    <div className="text-xs text-text-secondary uppercase tracking-widest">Total Created</div>
                </div>
                <div className="glass-card p-6 text-center">
                    <FiTag className="text-secondary text-3xl mx-auto mb-3" />
                    <div className="text-3xl font-bold mb-1">{stats?.activeCoupons || 0}</div>
                    <div className="text-xs text-text-secondary uppercase tracking-widest">Active</div>
                </div>
                <div className="glass-card p-6 text-center">
                    <FiClock className="text-accent text-3xl mx-auto mb-3" />
                    <div className="text-3xl font-bold mb-1">{stats?.couponsPurchased || 0}</div>
                    <div className="text-xs text-text-secondary uppercase tracking-widest">Purchased</div>
                </div>
                <div className="glass-card p-6 text-center">
                    <FiDollarSign className="text-green-400 text-3xl mx-auto mb-3" />
                    <div className="text-3xl font-bold mb-1">₹{stats?.totalEarnings || 0}</div>
                    <div className="text-xs text-text-secondary uppercase tracking-widest">Earnings</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <button className="glass-card p-6 text-left hover:border-primary transition-colors" onClick={() => navigate("/upload")}>
                    <FiPlusCircle className="text-primary text-2xl mb-3" />
                    <h3 className="font-bold mb-1">Create Coupon</h3>
                    <p className="text-sm text-text-secondary">List a new coupon for sale</p>
                </button>
                <button className="glass-card p-6 text-left hover:border-primary transition-colors" onClick={() => navigate("/browse")}>
                    <FiTag className="text-secondary text-2xl mb-3" />
                    <h3 className="font-bold mb-1">Browse Coupons</h3>
                    <p className="text-sm text-text-secondary">Find deals in the marketplace</p>
                </button>
                <button className="glass-card p-6 text-left hover:border-primary transition-colors" onClick={() => navigate("/profile")}>
                    <FiPieChart className="text-accent text-2xl mb-3" />
                    <h3 className="font-bold mb-1">View Profile</h3>
                    <p className="text-sm text-text-secondary">Manage account & payment info</p>
                </button>
            </div>

            {/* My Listed Coupons */}
            <h2 className="text-2xl font-bold mb-6 mt-12">My Listed Coupons</h2>
            {listedCoupons.length === 0 ? (
                <div className="glass-card text-center py-16 mb-12">
                    <div className="text-5xl mb-4">🏷️</div>
                    <h3 className="font-bold mb-2">You haven't listed any coupons</h3>
                    <p className="text-text-secondary mb-6">Start earning by selling your unused coupons.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {listedCoupons.map((coupon) => (
                        <div key={coupon._id} className="glass-card">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={coupon.image ? (coupon.image.startsWith('http') ? coupon.image : `http://localhost:5000${coupon.image}`) : "http://localhost:5000/images/default-coupon.png"}
                                        alt={coupon.title}
                                        className="w-12 h-12 rounded-lg object-cover border border-border bg-surface shrink-0"
                                        onError={(e) => { e.target.onError = null; e.target.src = "http://localhost:5000/images/default-coupon.png" }}
                                    />
                                    <div>
                                        <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">{coupon.brand}</p>
                                        <h3 className="font-bold">{coupon.title}</h3>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${coupon.status === 'AVAILABLE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{coupon.status}</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${new Date(coupon.expiryDate) < new Date() ? 'text-red-400 bg-red-400 bg-opacity-10' : 'text-blue-400 bg-blue-400 bg-opacity-10'}`}>
                                        {new Date(coupon.expiryDate) < new Date() ? "❌ Expired" : "✅ Valid"}
                                    </span>
                                </div>
                            </div>
                            <div className="glass p-3 rounded-lg flex justify-between items-center mb-4">
                                <span className="text-sm">Price: <strong>₹{coupon.price}</strong></span>
                                <span className="text-sm font-bold text-accent">{coupon.discount} OFF</span>
                            </div>
                            <div className="pt-4 border-t border-border flex justify-between items-center">
                                <p className="text-xs text-text-secondary flex items-center gap-2">
                                    <FiClock /> Exp: {new Date(coupon.expiryDate).toLocaleDateString()}
                                </p>
                                <div className="flex gap-2">
                                    {coupon.status === "AVAILABLE" && (
                                        <>
                                            <button
                                                className="p-2 text-text-secondary hover:text-primary transition-colors bg-white/5 rounded-lg"
                                                onClick={() => navigate(`/edit/${coupon._id}`)}
                                                title="Edit Coupon"
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                className="p-2 text-text-secondary hover:text-red-500 transition-colors bg-white/5 rounded-lg"
                                                onClick={() => handleDelete(coupon._id)}
                                                title="Delete Coupon"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Purchased Coupons */}
            <h2 className="text-2xl font-bold mb-6">My Purchased Coupons</h2>
            {purchasedCoupons.length === 0 ? (
                <div className="glass-card text-center py-16">
                    <div className="text-5xl mb-4">🛒</div>
                    <h3 className="font-bold mb-2">No purchases yet</h3>
                    <p className="text-text-secondary mb-6">Browse the marketplace and grab some great deals!</p>
                    <button className="btn btn-primary" onClick={() => navigate("/browse")}>
                        Browse Coupons
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {purchasedCoupons.map((coupon) => (
                        <div key={coupon._id} className="glass-card">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={coupon.image ? (coupon.image.startsWith('http') ? coupon.image : `http://localhost:5000${coupon.image}`) : "http://localhost:5000/images/default-coupon.png"}
                                        alt={coupon.title}
                                        className="w-12 h-12 rounded-lg object-cover border border-border bg-surface shrink-0"
                                        onError={(e) => { e.target.onError = null; e.target.src = "http://localhost:5000/images/default-coupon.png" }}
                                    />
                                    <div>
                                        <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">{coupon.brand}</p>
                                        <h3 className="font-bold">{coupon.title}</h3>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="text-sm font-bold text-accent">{coupon.discount} OFF</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${new Date(coupon.expiryDate) < new Date() ? 'text-red-400 bg-red-400 bg-opacity-10' : 'text-blue-400 bg-blue-400 bg-opacity-10'}`}>
                                        {new Date(coupon.expiryDate) < new Date() ? "❌ Expired" : "✅ Valid"}
                                    </span>
                                </div>
                            </div>
                            <div className="glass p-3 rounded-lg flex justify-between items-center mb-4">
                                <code className="text-sm font-bold tracking-wider">{coupon.code}</code>
                                <button onClick={() => handleCopy(coupon._id, coupon.code)} className="text-primary">
                                    {copiedId === coupon._id ? <FiCheck /> : <FiCopy />}
                                </button>
                            </div>
                            <p className="text-xs text-text-secondary flex items-center gap-2">
                                <FiClock /> Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ClaimedCoupons;
