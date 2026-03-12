import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import "./ThemeToggle.css";

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="theme-toggle-container" onClick={toggleTheme}>
      <span className="theme-toggle-label">
        {isDarkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </span>
      <div className={`theme-switch ${isDarkMode ? "dark" : "light"}`}>
        <div className="theme-switch-thumb" />
      </div>
    </div>
  );
};

export default ThemeToggle;
