import React, { useState, useEffect } from "react";
import "./WalletBar.css";
import { getScopedNumber } from "../utils/userScopedStorage";

function WalletBar() {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const updateBalance = () => {
      setBalance(getScopedNumber("walletBalance"));
    };

    updateBalance();

    window.addEventListener("storage", updateBalance);
    window.addEventListener("focus", updateBalance);
    window.addEventListener("walletUpdated", updateBalance);
    window.addEventListener("authChanged", updateBalance);

    return () => {
      window.removeEventListener("storage", updateBalance);
      window.removeEventListener("focus", updateBalance);
      window.removeEventListener("walletUpdated", updateBalance);
      window.removeEventListener("authChanged", updateBalance);
    };
  }, []);

  return (
    <div className="wallet-bar">
      <span className="wallet-icon">💼</span>
      <div className="wallet-info">
        <span className="wallet-amount">{balance === null ? "₹ --" : `₹ ${balance}`}</span>
      </div>
    </div>
  );
}

export default WalletBar;
