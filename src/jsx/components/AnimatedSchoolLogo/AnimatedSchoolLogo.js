import React from "react";
import "./AnimatedSchoolLogo.css";

const AnimatedSchoolLogo = ({ size = 120, color = "#539bff" }) => (
  <div className="logo-container">
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="school-logo"
    >
      <circle cx="32" cy="32" r="32" fill={color} />
      <path d="M16 28L32 16L48 28V44H16V28Z" fill="white" />
      <path d="M24 44V36H40V44H24Z" fill="#417acc" />
      <circle cx="32" cy="40" r="2" fill="white" />
    </svg>
    <div className="logo-text">
      School App
    </div>
  </div>
);

export default AnimatedSchoolLogo;
