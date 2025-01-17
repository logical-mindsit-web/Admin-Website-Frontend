import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
  const isExtraSmallScreen = window.matchMedia("(max-width: 480px)").matches;

  const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap", // Allow columns to stack on small screens
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
    flexDirection: isSmallScreen ? "column" : "row", // Stack columns on small screens
    alignItems: isSmallScreen ? "center" : "flex-start", // Center align on small screens
  };

  const columnStyle = {
    flex: "1",
    minWidth: "200px",
    margin: "1rem 0",
    width: isSmallScreen ? "100%" : "auto", // Full width on small screens
    textAlign: isSmallScreen ? "center" : "left", // Center text on small screens
    padding: isSmallScreen ? "0" : "1rem", // Remove padding on small screens to avoid overlap
  };

  const headingStyle = {
    color: "#333",
    marginBottom: "1rem",
    fontSize: isExtraSmallScreen ? "1rem" : "inherit", // Smaller heading on extra small screens
  };

  const linkStyle = {
    color: "#555",
    textDecoration: "none",
    display: "block",
    margin: "0.5rem 0",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    textAlign: "left",
    fontSize: isExtraSmallScreen ? "0.9rem" : "inherit", // Smaller text on extra small screens
    transition: "color 0.3s ease", // Smooth transition for color change
  };

  const iconStyle = {
    color: "#555",
    fontSize: isExtraSmallScreen ? "1.2rem" : "1.5rem", // Smaller icons on extra small screens
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  };

  const handleMouseEnter = (e) => {
    e.target.style.color = '#9C15F7'; // Change text color on hover
  };

  const handleMouseLeave = (e) => {
    e.target.style.color = '#555'; // Reset text color
  };

  return (
    <footer style={{ backgroundColor: "#f8f9fa", padding: "2rem 0", position: "relative" }}>
      <div style={containerStyle}>
        <div style={columnStyle}>
          <div style={{ height: "50px", marginBottom: "1rem", marginTop: "2rem" }}>
            <Link to="/content">
              <img
                src="/logo.png"
                alt="SpotlessAI Logo"
                style={{ height: "50px", maxWidth: "100%" }} // Ensure logo is responsive
              />
            </Link>
          </div>
        </div>
        <div style={columnStyle}>
          <h4 style={headingStyle}>Menu</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <button 
                style={linkStyle} 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}>
                Home
              </button>
            </li>
            <li>
              <button 
                style={linkStyle} 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}>
                About Us
              </button>
            </li>
            <li>
              <button 
                style={linkStyle} 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}>
                Segments
              </button>
            </li>
            <li>
              <button 
                style={linkStyle} 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}>
                Investor Relations
              </button>
            </li>
          </ul>
        </div>
        <div style={columnStyle}>
          <h4 style={headingStyle}>Segments</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <button 
                style={linkStyle} 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}>
                Healthcare
              </button>
            </li>
            <li>
              <button 
                style={linkStyle} 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}>
                Laboratories
              </button>
            </li>
            <li>
              <button 
                style={linkStyle} 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}>
                Warehouse/Factories
              </button>
            </li>
            <li>
              <button 
                style={linkStyle} 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}>
                Educational Institutions
              </button>
            </li>
            <li>
              <button 
                style={linkStyle} 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}>
                Public Transport
              </button>
            </li>
          </ul>
        </div>
        <div style={columnStyle}>
          <h4 style={headingStyle}>Contact us</h4>
          <p style={{ color: "#555", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FaEnvelope /> support@spotless.ai
          </p>
          <div style={{ marginTop: "1rem", display: "flex", gap: "1.5rem", justifyContent: "center" }}>
            <a href="https://bit.ly/spotless-ai-x" target="_blank" rel="noopener noreferrer">
              <button style={{ ...iconStyle, color: "#1da1f2" }} aria-label="Twitter">
                <FaTwitter />
              </button>
            </a>
            <a href="https://bit.ly/spotless-ai-ln" target="_blank" rel="noopener noreferrer">
              <button style={{ ...iconStyle, color: "#0e76a8" }} aria-label="LinkedIn">
                <FaLinkedin />
              </button>
            </a>
            <a href="https://bit.ly/spotless-ai-fb" target="_blank" rel="noopener noreferrer">
              <button style={{ ...iconStyle, color: "#1877f2" }} aria-label="Facebook">
                <FaFacebook />
              </button>
            </a>
            <a href="https://bit.ly/spotless-ai-i" target="_blank" rel="noopener noreferrer">
              <button style={{ ...iconStyle, color: "#e4405f" }} aria-label="Instagram">
                <FaInstagram />
              </button>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
