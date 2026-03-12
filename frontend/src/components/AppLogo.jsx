import React from "react";
import logo from "../assets/logo.png";

function AppLogo({ size = 36 }) {

  return (

    <img
      src={logo}
      alt="CouponMarket Logo"
      style={{
        width: size,
        height: size,
        objectFit: "contain"
      }}
    />

  );

}

export default AppLogo;