import React from "react";
import { Spinner } from "react-bootstrap";
import WordLogo from "../assets/Suuqlogo.png";
const LogoLoader = () => {
  return (
    <div className="loader-overlay">
      <div className="spinner-container">
        <Spinner
          animation="border"
          role="status"
          style={{
            display: "block",
            width: " 60px",
            height: "60px",
            margin: "auto",
            color: "crimson",
            marginTop : "1em",
          }}
        />
        <div className="spinner-text">
          <img src={WordLogo} alt="" height={55} />
        </div>
      </div>
    </div>
  );
};

export default LogoLoader;
