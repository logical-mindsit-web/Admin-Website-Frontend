import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/api";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: null,
    name: null,
    role: null,
  });
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      const fetchUserDetails = async () => {
        try {
          const email = localStorage.getItem("email");
          const response = await axios.get(`admin-details/${email}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUserDetails({
            email: response.data.email,
            name: response.data.name,
            role: response.data.role,
          });
        } catch (error) {
          console.error("Error fetching details:", error);
        }
      };

      fetchUserDetails();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const handleProfileClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setOpenDialog(true);
    } else {
      alert("Please login to show profile");
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <header style={styles.header}>
      <div style={styles.headerBottom}>
        <div style={styles.logo}>
          <Link to="/card">
            <img
              src="/logo.png"
              alt="SpotlessAI Logo"
              style={styles.logoImage}
            />
          </Link>
        </div>
        <nav style={styles.nav}>
          <ul style={styles.navList}>
            <li style={styles.navItem}>
              <Link to="/Employeecard" style={styles.navLink}>
                Employee Data
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/card-global" style={styles.navLink}>
                Global Settings
              </Link>
            </li>
            <li style={styles.navItem}>
              <span
                onClick={handleProfileClick}
                style={{
                  cursor: "pointer",
                  color: "#00448e",
                  textDecoration: "none",
                  fontSize: "1rem",
                }}
              >
                {userDetails.name
                  ? `${userDetails.name} (${userDetails.role})`
                  : "Profile"}
              </span>
            </li>
          </ul>
          {isLoggedIn && (
            <Button style={styles.getStartedButton} onClick={handleLogout}>
              Logout
            </Button>
          )}
        </nav>
      </div>

      <Dialog open={openDialog} onClose={handleDialogClose}>
      <DialogTitle sx={{ color: 'black' }}>Admin Profile</DialogTitle>
      <DialogContent>
          <DialogContentText>
            Name: {userDetails.name}
            <br />
            Email: {userDetails.email}
            <br />
            Role: {userDetails.role}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    background:
      "linear-gradient(to right, #00448e6, #9C15F7, rgba(255, 75, 248, 0.3))", // Gradient with 3 colors
  },
  headerBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    background:
      "linear-gradient(to right, #00448e6, #9C15F7, rgba(255, 75, 248, 0.3))", // Gradient with 3 colors
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    flexWrap: "wrap", // Allow items to wrap on smaller screens
  },
  logo: {
    display: "flex",
    alignItems: "center",
  },
  logoImage: {
    height: "50px",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap", // Allow navigation items to wrap on smaller screens
  },
  navList: {
    listStyle: "none",
    display: "flex",
    gap: "2rem",
    margin: 0,
    padding: 0,
  },
  navItem: {
    margin: 0,
  },
  navLink: {
    color: "#333",
    textDecoration: "none",
    fontSize: "1rem",
  },
  getStartedButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "1rem",
    textDecoration: "none",
  },

  // Media queries for responsiveness
  "@media screen and (max-width: 768px)": {
    header: {
      padding: "0.5rem 1rem",
    },
    headerBottom: {
      flexDirection: "column", // Stack items vertically on small screens
      padding: "1rem",
    },
    navList: {
      flexDirection: "column", // Stack navigation items vertically
      gap: "1rem",
      textAlign: "center", // Center align text on small screens
    },
    getStartedButton: {
      marginLeft: 0,
      marginTop: "1rem", // Add space between logout button and navigation items
    },
  },
};

export default Header;
