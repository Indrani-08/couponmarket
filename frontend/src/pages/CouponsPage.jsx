import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import initialCoupons from "../data/coupons.json";
import "./CouponsPage.css";

const STORE_DOMAINS = {
    "Amazon": "amazon.com",
    "Spotify": "spotify.com",
    "Netflix": "netflix.com",
    "Uber": "uber.com",
    "MakeMyTrip": "makemytrip.com",
    "Swiggy": "swiggy.com",
    "Zomato": "zomato.com",
    "Myntra": "myntra.com",
    "Blinkit": "blinkit.com",
    "Apple": "apple.com",
    "Adobe": "adobe.com",
    "Airbnb": "airbnb.com",
    "Disney+ Hotstar": "hotstar.com",
    "YouTube": "youtube.com",
    "Domino's": "dominos.com",
    "Starbucks": "starbucks.com",
    "McDonald's": "mcdonalds.com",
    "IRCTC": "irctc.com",
    "OYO": "oyorooms.com",
    "Rapido": "rapido.bike",
    "AJIO": "ajio.com",
    "H&M": "hm.com",
    "Nykaa": "nykaa.com",
    "Nike": "nike.com",
    "BigBasket": "bigbasket.com",
    "Zepto": "zeptonow.com",
    "JioMart": "jiomart.com",
    "Nature's Basket": "naturesbasket.co.in",
    "Notion": "notion.so",
    "Figma": "figma.com",
    "GitHub": "github.com",
    "Canva": "canva.com",
    "OpenAI": "openai.com",
    "Cleartrip": "cleartrip.com",
    "KFC": "kfc.com",
    "Dunzo": "dunzo.com",
    "Lenskart": "lenskart.com",
    "Grammarly": "grammarly.com",
    "Cult.fit": "cult.fit",
    "Audible": "audible.in",
    "Flipkart": "flipkart.com",
    "Meesho": "meesho.com",
    "Paytm": "paytm.com"
};

const getLogoUrl = (coupon) => {
    // If the coupon already has a logo URL (e.g. from UploadCoupon)
    if (coupon.logo) return coupon.logo;

    const domain = STORE_DOMAINS[coupon.store];
    if (domain) {
        // Primary: Google Favicon Service (High Res)
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    }
    // Auto-generate beautiful initials icon for uploaded custom stores
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(coupon.store)}&background=random&color=fff&bold=true&size=128`;
};



const CATEGORIES = ["All", "Entertainment", "Food", "Travel", "Fashion", "Grocery", "Software"];

function CouponsPage() {
    const navigate = useNavigate();
    const [coupons, setCoupons] = useState([]);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedCoupon, setSelectedCoupon] = useState(null);


    useEffect(() => {
        if (selectedCoupon) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [selectedCoupon]);

    useEffect(() => {

        const fetchCoupons = async () => {

            try {

                const res = await axios.get("http://localhost:5000/api/coupons");

                const dbCoupons = res.data;
                const today = new Date();

                const stored = JSON.parse(localStorage.getItem("coupons") || "[]");

                const updated = dbCoupons.map(c => {

                    const existing = stored.find(s => s._id === c._id);
                    const expiryStr = c.expiryDate ? new Date(c.expiryDate).toISOString().split('T')[0] : (c.expiry || "");

                    return {
                        ...c,
                        id: c._id, // keep compatibility with your UI
                        expiry: expiryStr,
                        claimed: existing ? existing.claimed : false,
                        locked: existing ? existing.locked : false,
                        expired: new Date(c.expiryDate || c.expiry) < today
                    };

                });

                const uploadedCoupons = stored.filter(
                    s => !dbCoupons.some(c => c._id === s._id)
                );

                updated.unshift(...uploadedCoupons);

                setCoupons(updated);

                localStorage.setItem("coupons", JSON.stringify(updated));

            } catch (error) {

                console.log("Backend not available, using local JSON");

                /* fallback to local json */
                const today = new Date();

                const updated = initialCoupons.map(c => ({
                    ...c,
                    expired: new Date(c.expiry) < today
                }));

                setCoupons(updated);

            }

        };

        fetchCoupons();

    }, []);

    const filtered = coupons.filter((c) => {
        const matchCat = activeCategory === "All" || c.category === activeCategory;
        const matchSearch =
            String(c.title || "").toLowerCase().includes(search.toLowerCase()) ||
            String(c.store || "").toLowerCase().includes(search.toLowerCase()) ||
            String(c.code || "").toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch && !c.claimed;
    });


    const handleBuy = (coupon) => {
        // Lock the coupon
        const updated = coupons.map((c) =>
            c.id === coupon.id ? { ...c, locked: true } : c
        );
        setCoupons(updated);
        localStorage.setItem("coupons", JSON.stringify(updated));
        navigate("/payment", { state: { coupon } });
    };

    return (
        <div className="coupons-page">
            <div className="page-header">
                <h1>🏷️ Browse Coupons</h1>
                <p>Discover amazing deals and save big on every purchase</p>
            </div>

            <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search coupons, stores or codes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="categories">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        className={`cat-btn ${activeCategory === cat ? "active" : ""}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🎟️</div>
                    <h3>No coupons found</h3>
                    <p>Try a different search or category</p>
                </div>
            ) : (
                <div className="coupons-grid">
                    {filtered.map((coupon) => (
                        <div
                            key={coupon.id}
                            className={`coupon-card ${coupon.expired ? "expired" : ""}`}
                            style={{ "--color": coupon.color }}
                            onClick={() => setSelectedCoupon(coupon)}
                        >
                            {coupon.expired && <div className="expired-badge">❌ Expired</div>}

                            <div className="card-left">
                                <div className="brand-logo-area">
                                    <div className="logo-circle">
                                        <img
                                            className="brand-logo"
                                            src={getLogoUrl(coupon)}
                                            alt={coupon.store}
                                            loading="lazy"
                                            onError={(e) => {
                                                // Secondary source if Google fails
                                                const domain = STORE_DOMAINS[coupon.store];
                                                if (domain && !e.target.src.includes('clearbit')) {
                                                    e.target.src = `https://logo.clearbit.com/${domain}?size=128`;
                                                } else {
                                                    // Ultimate fallback
                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(coupon.store)}&background=${coupon.color.replace('#', '')}&color=fff&bold=true&size=128`;
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="card-divider">
                                <div className="notch top" />
                                <div className="dashed-line" />
                                <div className="notch bottom" />
                            </div>

                            <div className="card-right">
                                <div className="card-header-row">
                                    <span className="cat-tag">{coupon.category}</span>
                                    <span className="discount-tag">{coupon.discount} OFF</span>
                                </div>
                                <h3>{coupon.title}</h3>
                                <p className="card-desc">{coupon.description}</p>
                                <div className="card-meta">
                                    <span>🏪 {coupon.store}</span>
                                    <span className={coupon.expired ? "expired-date" : ""}>
                                        📅 {coupon.expired ? "Expired: " : "Valid till: "}{coupon.expiry}
                                    </span>
                                    <span>💰 Price: ₹{coupon.price}</span>
                                </div>
                                <div className="card-actions">
                                    {!coupon.expired && (
                                        <button className="buy-btn" onClick={(e) => { e.stopPropagation(); handleBuy(coupon); }}>
                                            Buy Now →
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedCoupon && (
                <div className="coupon-modal-overlay" onClick={() => setSelectedCoupon(null)}>
                    <div className="coupon-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setSelectedCoupon(null)}>✖</button>
                        <div className="modal-header" style={{ backgroundColor: selectedCoupon.color }}>
                            <div className="modal-logo-wrapper">
                                <img
                                    src={getLogoUrl(selectedCoupon)}
                                    alt={selectedCoupon.store}
                                    className="modal-brand-logo"
                                    onError={(e) => {
                                        const domain = STORE_DOMAINS[selectedCoupon.store];
                                        if (domain && !e.target.src.includes('clearbit')) {
                                            e.target.src = `https://logo.clearbit.com/${domain}?size=128`;
                                        } else {
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCoupon.store)}&background=${selectedCoupon.color.replace('#', '')}&color=fff&bold=true&size=128`;
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="modal-content">
                            <span className="modal-category">{selectedCoupon.category}</span>
                            <h2>{selectedCoupon.title}</h2>
                            <p className="modal-description">{selectedCoupon.description}</p>

                            <div className="modal-details-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Store</span>
                                    <span className="detail-value">{selectedCoupon.store}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Discount</span>
                                    <span className="detail-value highlight">{selectedCoupon.discount} OFF</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Price</span>
                                    <span className="detail-value">₹{selectedCoupon.price}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Valid Till</span>
                                    <span className={`detail-value ${selectedCoupon.expired ? 'expired-text' : ''}`}>
                                        {selectedCoupon.expiry}
                                    </span>
                                </div>
                            </div>

                            <div className="modal-actions">
                                {selectedCoupon.expired ? (
                                    <div className="expired-notice">This coupon has expired</div>
                                ) : (
                                    <button className="modal-buy-btn" onClick={() => {
                                        handleBuy(selectedCoupon);
                                        setSelectedCoupon(null);
                                    }}>
                                        Purchase for ₹{selectedCoupon.price}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CouponsPage;
