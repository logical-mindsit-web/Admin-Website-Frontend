import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { keyframes } from '@emotion/react';

export default function CardGridDashboard() {
  const navigate = useNavigate();

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  const getUserRole = () => {
    const role = localStorage.getItem('role');
    console.log('Role:', role);
    return role;
  };

  const handleButtonClick = (path) => {
    if (isAuthenticated()) {
      navigate(path);
    } else {
      alert('You must be logged in to access this page.');
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
    const filteredCards = cardData.filter((card) => card.roles.includes(userRole));
    console.log('Filtered Cards:', filteredCards);
  
    const fadeInAnimation = keyframes`
      from {
        opacity: 0;
        transform: translateY(10%);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    `;
  
    return (
      <div style={styles.mainContent}>
        <Grid
          container
          spacing={3}
          style={styles.cardContainer}
          sx={{
            animation: `${fadeInAnimation} 1s ease-in-out`,
          }}
        >
          {filteredCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Link to={isAuthenticated() ? card.path : '#'} style={{ textDecoration: 'none' }}>
                <Card
                  style={styles.card}
                  onClick={() => handleButtonClick(card.path)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                      background: 'linear-gradient(to right, #0048e6, #9C15F7, rgba(255, 75, 248, 0.3))',
                      color: 'white',
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
  }
  
  const styles = {
    mainContent: {
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: '#f4f4f9',
    },
    cardContainer: {
      padding: '2rem',
      justifyContent: 'center',
    },
    card: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
  };
  