import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UploadCoupon.css";

const CATEGORIES = [
  "Electronics",
  "Food",
  "Travel",
  "Fashion",
  "Health",
  "Grocery",
  "Entertainment"
];

function UploadCoupon() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    store: "",
    discount: "",
    code: "",
    category: "Electronics",
    expiryDate: "",
    description: "",
    price: "",
    color: ""
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");

  const getLogoUrl = (storeName) => {
    if (!storeName.trim()) return "";
    const domain = storeName.toLowerCase().replace(/\s+/g, "") + ".com";
    return `https://logo.clearbit.com/${domain}?size=128`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

    setErrors({
      ...errors,
      [name]: ""
    });

    if (name === "store") {
      setLogoPreview(getLogoUrl(value));
    }
  };

  const validate = () => {
    const errs = {};

    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.code.trim()) errs.code = "Coupon code required";
    if (!form.discount.trim()) errs.discount = "Discount required";
    if (!form.store.trim()) errs.store = "Store name required";
    if (!form.expiryDate) errs.expiry = "Expiry date required";
    if (!form.price || isNaN(form.price)) errs.price = "Valid price required";

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/coupons",
        { ...form, brand: form.store },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setSubmitted(true);

    } catch (error) {
      console.error("Full error:", error);
      console.log("Backend response:", error.response?.data);
      alert("Failed to upload coupon");
    }
  };

  if (submitted) {
    return (
      <div className="upload-page">
        <div className="upload-success">
          <div className="success-icon">✅</div>
          <h2>Coupon Uploaded!</h2>
          <p>Your coupon is now live in the marketplace.</p>

          <div className="success-btns">
            <button
              className="btn-primary"
              onClick={() => navigate("/")}
            >
              View Marketplace
            </button>

            <button
              className="btn-secondary"
              onClick={() => {
                setSubmitted(false);
                setForm({
                  title: "",
                  store: "",
                  discount: "",
                  code: "",
                  category: "Electronics",
                  expiryDate: "",
                  description: "",
                  price: "",
                  color: ""
                });
              }}
            >
              Upload Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-page">
      <div className="upload-container">

        <h2 className="upload-title">📤 Upload a Coupon</h2>
        <p className="upload-subtitle">
          Share your deals with the marketplace
        </p>

        <form onSubmit={handleSubmit} className="upload-form">

          <div className="form-row">

            <div className="form-group">
              <label>Coupon Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. 50% Off Electronics"
              />
              {errors.title && <span className="error">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label>Store Name *</label>

              <div className="input-with-preview">

                <input
                  name="store"
                  value={form.store}
                  onChange={handleChange}
                  placeholder="e.g. Amazon"
                />

                {logoPreview && (
                  <div className="logo-preview-small">
                    <img
                      src={logoPreview}
                      alt="logo"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>
                )}

              </div>

              {errors.store && <span className="error">{errors.store}</span>}
            </div>

          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the coupon offer..."
              rows={3}
            />

          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Coupon Code *</label>

              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="SAVE50"
                style={{ textTransform: "uppercase" }}
              />

              {errors.code && <span className="error">{errors.code}</span>}
            </div>

            <div className="form-group">
              <label>Discount *</label>

              <input
                name="discount"
                value={form.discount}
                onChange={handleChange}
                placeholder="50% or ₹200"
              />

              {errors.discount && (
                <span className="error">{errors.discount}</span>
              )}

            </div>

          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Category</label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

            </div>

            <div className="form-group">
              <label>Price (₹) *</label>

              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="299"
                min="0"
              />

              {errors.price && <span className="error">{errors.price}</span>}

            </div>

            <div className="form-group">
              <label>Expiry Date *</label>

              <input
                name="expiryDate"
                type="date"
                value={form.expiryDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
              />

              {errors.expiry && <span className="error">{errors.expiry}</span>}

            </div>

          </div>

          <div className="platform-note">
            💡 <strong>Note:</strong> A 10% platform fee will be added on top of
            the listed price during checkout.
          </div>

          <button type="submit" className="submit-btn">
            Upload Coupon 🚀
          </button>

        </form>

      </div>
    </div>
  );
}

export default UploadCoupon;