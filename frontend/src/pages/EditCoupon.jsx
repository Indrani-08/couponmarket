import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { FiTag, FiShoppingBag, FiCreditCard, FiCalendar, FiFileText, FiUploadCloud, FiDollarSign } from "react-icons/fi";

const EditCoupon = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: "",
        brand: "",
        coupon_code: "",
        discount: "",
        price: "",
        category: "All",
        expiryDate: "",
        description: "",
        store: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCoupon = async () => {
            try {
                const res = await api.get(`/coupons/${id}`);
                const c = res.data;
                setFormData({
                    title: c.title || "",
                    brand: c.brand || "",
                    coupon_code: c.coupon_code || c.code || "",
                    discount: c.discount || "",
                    price: c.price || "",
                    category: c.category || "All",
                    expiryDate: c.expiryDate ? new Date(c.expiryDate).toISOString().split('T')[0] : "",
                    description: c.description || "",
                    store: c.store || ""
                });
            } catch (err) {
                setMessage("Failed to load coupon details");
            } finally {
                setLoading(false);
            }
        };
        fetchCoupon();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put(`/coupons/${id}`, formData);
            setMessage("Coupon updated successfully!");
            setTimeout(() => navigate("/claimed"), 2000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to edit coupon");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-text-secondary">Loading...</div>;

    return (
        <div className="container section max-w-2xl">
            <div className="glass-card mb-8">
                <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <FiUploadCloud className="text-primary" /> Edit Your Coupon
                </h2>
                <p className="text-text-secondary mb-8">Update the details of your listed coupon.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <FiTag className="text-primary" /> Coupon Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                className="w-full glass p-3 outline-none focus:border-primary transition-colors"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <FiShoppingBag className="text-primary" /> Brand Name
                            </label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                className="w-full glass p-3 outline-none focus:border-primary transition-colors"
                                required
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <FiCreditCard className="text-primary" /> Coupon Code
                            </label>
                            <input
                                type="text"
                                name="coupon_code"
                                value={formData.coupon_code}
                                className="w-full glass p-3 outline-none focus:border-primary transition-colors"
                                style={{ textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: "bold" }}
                                required
                                onChange={handleChange}
                                placeholder="e.g. SAVE50"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <FiTag className="text-primary" /> Discount Value
                            </label>
                            <input
                                type="text"
                                name="discount"
                                value={formData.discount}
                                className="w-full glass p-3 outline-none focus:border-primary transition-colors"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <FiDollarSign className="text-primary" /> Selling Price (₹)
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                className="w-full glass p-3 outline-none focus:border-primary transition-colors"
                                required
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <FiCalendar className="text-primary" /> Expiry Date
                            </label>
                            <input
                                type="date"
                                name="expiryDate"
                                value={formData.expiryDate}
                                className="w-full glass p-3 outline-none focus:border-primary transition-colors"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                className="w-full glass p-3 outline-none focus:border-primary transition-colors"
                                onChange={handleChange}
                            >
                                <option value="All">All Categories</option>
                                <option value="Food">Food</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Travel">Travel</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Grocery">Grocery</option>
                                <option value="Beauty">Beauty</option>
                                <option value="Tech">Tech</option>
                                <option value="Software">Software</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Store / Merchant</label>
                            <input
                                type="text"
                                name="store"
                                value={formData.store}
                                className="w-full glass p-3 outline-none focus:border-primary transition-colors"
                                required
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <FiFileText className="text-primary" /> Description
                        </label>
                        <textarea
                            name="description"
                            rows="3"
                            value={formData.description}
                            className="w-full glass p-3 outline-none focus:border-primary transition-colors"
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    {message && <p className="text-sm text-accent">{message}</p>}

                    <div className="flex gap-4">
                        <button
                            type="button"
                            className="btn btn-secondary w-full"
                            onClick={() => navigate("/claimed")}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn btn-primary w-full text-lg py-4"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCoupon;
