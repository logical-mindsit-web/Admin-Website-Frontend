import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const CardGrid = () => {
  const navigate = useNavigate();

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };
  const getUserRole = () => {
    const role = localStorage.getItem("role");
    console.log("Role:", role);
    return role;
  };
  const handleButtonClick = (path) => {
    if (isAuthenticated()) {
      navigate(path);
    } else {
      alert("You must be logged in to access this page.");
    }
  };

  const cardData = [
    {
      title: "Update EmployeeIds",
      description: "Update your daily work.",
      path: "/EmployeeIdForm",
      roles: ["Hr"],
    },
    {
      title: "Update Ticket",
      description: "Update your daily work.",
      path: "/TicketForm",
      roles: ["Hr", "ProjectManager", "AdminController"],
    },
    {
      title: "Employee List",
      description: "View the Employee List.",
      path: "/EmployeeTable",
      roles: ["Hr", "ProjectManager", "AdminController"],
    },
    {
      title: "View Ticket ",
      description: "View Employee Ticket Data.",
      path: "/EmployeeList",
      roles: ["Hr", "ProjectManager", "AdminController"],
    },
  ];
  const userRole = getUserRole();
  const filteredCards = cardData.filter((card) =>
    card.roles.includes(userRole)
  );
  console.log("Filtered Cards:", filteredCards);
  return (
    <div style={styles.mainContent}>
      <Grid container spacing={3} style={styles.cardContainer}>
        {filteredCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Link
              to={isAuthenticated() ? card.path : "#"}
              style={{ textDecoration: "none" }}
            >
              <Card
                style={styles.card}
                onClick={() => handleButtonClick(card.path)}
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" component="div">
                    {card.title}
                  </Typography>
                  <br />
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

const styles = {
  mainContent: {
    padding: "2rem",
    textAlign: "center",
  },
  cardContainer: {
    padding: "2rem",
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
};

export default CardGrid;
