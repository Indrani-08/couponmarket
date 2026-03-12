import React, { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { FiHome, FiSearch, FiPlusCircle, FiPieChart, FiUser, FiLogOut, FiMenu, FiX, FiGift, FiChevronDown } from "react-icons/fi";
import AppLogo from "./AppLogo";
import WalletBar from "./WalletBar";
import ThemeToggle from "./ThemeToggle";
import { logout } from "./logout";

const MainLayout = ({ user, username, userEmail }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuLinks = [
    { to: "/browse", icon: <FiSearch />, label: "Browser" },
    { to: "/upload", icon: <FiPlusCircle />, label: "Sale Coupon" },
    { to: "/claimed", icon: <FiPieChart />, label: "Dashboard" },
    { to: "/rewards", icon: <FiGift />, label: "Daily Rewards" },
  ];

  const mainLinks = [
    { to: "/profile", icon: <FiUser />, label: "Profile" },
    ...(user?.role?.toUpperCase() === "ADMIN" ? [{ to: "/admin", icon: <FiPieChart />, label: "Admin" }] : []),
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="glass sticky top-0 z-50 w-full">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <AppLogo size={32} />
              <span className="gradient-text text-xl font-bold">CouponMarket</span>
            </div>
            <ThemeToggle />
            <WalletBar />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {/* Menu Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-2 text-sm font-medium text-text-primary bg-surface hover:bg-surface-hover border border-border rounded-xl px-4 py-2 transition-all cursor-pointer shadow-sm"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <FiMenu className="text-primary" /> Menu <FiChevronDown className="text-text-secondary" />
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute top-full right-0 mt-3 w-56 glass bg-surface rounded-2xl p-2 flex flex-col gap-1 animate-fade-in z-50 shadow-xl border border-border"
                >
                  {menuLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors hover:bg-primary/10 ${isActive ? "text-primary bg-primary/10" : "text-text-secondary"}`
                      }
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span className="text-lg opacity-80">{link.icon}</span> {link.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {mainLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-text-secondary"}`
                }
              >
                {link.icon} {link.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Nav Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button className="text-2xl" onClick={toggleMenu}>
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

          {/* Mobile Nav Menu */}
          {isMenuOpen && (
            <div ref={menuRef} className="absolute top-full left-0 w-full glass p-6 flex flex-col gap-4 md:hidden animate-fade-in shadow-xl z-50 border-b border-border">
              {[...menuLinks, ...mainLinks].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 text-lg font-medium"
                >
                  {link.icon} {link.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="section glass-card mt-auto border-t border-border rounded-none">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <AppLogo size={24} />
              <span className="gradient-text text-lg font-bold">CouponMarket</span>
            </div>
            <p className="text-text-secondary text-sm">
              The world's leading marketplace for trading unused coupons and gift cards. Save more, sell fast.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <div className="flex flex-col gap-3 text-sm text-text-secondary">
              <NavLink to="/browse">Browse Coupons</NavLink>
              <NavLink to="/upload">Sell Coupon</NavLink>
              <NavLink to="/help">Help Center</NavLink>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6">Stay Connected</h4>
            <p className="text-sm text-text-secondary mb-4">Join our community for the latest deals.</p>
            <div className="flex gap-4">
              {/* Social icons placeholder */}
            </div>
          </div>
        </div>
        <div className="container mt-12 pt-8 border-t border-border text-center text-xs text-text-secondary">
          © 2026 CouponMarket. All rights reserved.
        </div>
      </footer>
    </div >
  );
};

export default MainLayout;

