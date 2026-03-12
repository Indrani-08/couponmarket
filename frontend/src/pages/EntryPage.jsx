import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiShield, FiZap, FiDollarSign } from "react-icons/fi";
import ThemeToggle from "../components/ThemeToggle";
import "./EntryPage.css";

function EntryPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FiShield />,
      title: "Secure Marketplace",
      description: "Every coupon is verified through our advanced security system to prevent duplicates or fake codes.",
    },
    {
      icon: <FiZap />,
      title: "Instant Delivery",
      description: "Get your digital coupon delivered instantly to your dashboard the moment payment is confirmed.",
    },
    {
      icon: <FiDollarSign />,
      title: "Best Value",
      description: "Sell your unused coupons at your own price and unlock exclusive deals up to 90% off.",
    },
  ];

  return (
    <div className="entry-root">
      {/* ── NAV ── */}
      <nav className="entry-nav">
        <div className="entry-nav-inner">
          <div className="entry-logo">
            <span className="entry-logo-icon">🎟️</span>
            <span className="entry-brand">CouponMarket</span>
          </div>
          <div className="entry-nav-actions">
            <ThemeToggle />
            <div style={{ width: 12 }}></div>
            <button className="entry-btn-ghost" onClick={() => navigate("/login")}>Sign In</button>
            <button className="entry-btn-primary" onClick={() => navigate("/register")}>Get Started →</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="entry-hero">
        <div className="entry-hero-inner solo">
          {/* Left - Now centered and full width */}
          <div className="entry-hero-text">
            <h1 className="entry-headline">
              Unlock the Best<br />
              Deals with<br />
              <span className="entry-gradient">CouponMarket</span>
            </h1>
            <p className="entry-subheadline">
              A professional marketplace to buy and sell authentic digital coupons effortlessly and securely.
            </p>
            <div className="entry-cta-row">
              <button className="entry-btn-primary entry-btn-large" onClick={() => navigate("/register")}>
                Get Started <FiArrowRight />
              </button>
              <button className="entry-btn-outline entry-btn-large" onClick={() => navigate("/login")}>
                Sign In to Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="entry-features">
        <div className="entry-section-inner">
          <div className="entry-section-head">
            <h2 className="entry-section-title">Everything you need to save big</h2>
            <p className="entry-section-sub">Professional tools for smart coupon buyers and sellers.</p>
          </div>
          <div className="entry-features-grid">
            {features.map((f, i) => (
              <div key={i} className="entry-feature-card">
                <div className="entry-feature-icon">{f.icon}</div>
                <h3 className="entry-feature-title">{f.title}</h3>
                <p className="entry-feature-desc">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="entry-cta-banner">
        <div className="entry-section-inner entry-cta-inner">
          <h2 className="entry-cta-title">Ready to start saving?</h2>
          <p className="entry-cta-sub">Join thousands of users already saving with CouponMarket.</p>
          <button className="entry-btn-primary entry-btn-large" onClick={() => navigate("/register")}>
            Create Free Account →
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="entry-footer">
        <div className="entry-nav-inner">
          <span>© 2026 CouponMarket. All rights reserved.</span>
          <span className="entry-footer-links">
            <button className="entry-btn-ghost-sm" onClick={() => navigate("/login")}>Login</button>
            <button className="entry-btn-ghost-sm" onClick={() => navigate("/register")}>Register</button>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default EntryPage;
