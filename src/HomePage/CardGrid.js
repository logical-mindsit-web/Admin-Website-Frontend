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
      title: 'Create User',
      description: 'New user with essential details.',
      path: '/create-user',
      roles: ['Hr', 'ProjectManager', 'AdminController'],
    },
    {
      title: 'Create Admin',
      description: 'Set up new administrative accounts.',
      path: '/create-admin',
      roles: ['Hr', 'ProjectManager'],
    },
    {
      title: 'Create Robot For User',
      description: 'create user Robot Details.',
      path: '/robot-form',
      roles: ['Hr', 'ProjectManager', 'AdminController'],
    },
    {
      title: "User's List",
      description: 'View and manage user details.',
      path: '/users-list',
      roles: ['Hr', 'ProjectManager', 'AdminController'],
    },
    {
      title: "Admin User's",
      description: 'View and manage admin details.',
      path: '/admin-user',
      roles: ['Hr', 'ProjectManager'],
    },
    {
      title: "User's Robot",
      description: 'View user Robot Details.',
      path: '/user-robot',
      roles: ['Hr', 'ProjectManager', 'AdminController'],
    },
    {
      title: 'Robot Messages',
      description: 'View  Robot Messages.',
      path: '/RobotMsgList',
      roles: ['Hr', 'ProjectManager', 'AdminController'],
    },
    {
      title: 'Robot Demo Booking',
      description: 'Open for Booking.',
      path: '/Robot-Booking',
      roles: ['Hr', 'ProjectManager', 'AdminController'],
    },
    {
      title: 'Demo Booking Details',
      description: 'Booking Details.',
      path: '/Booking-details',
      roles: ['Hr', 'ProjectManager', 'AdminController'],
    },
    {
      title: 'Robot Analytics',
      description: 'Robot Analytics Details.',
      path: '/robot-analytics',
      roles: ['Hr', 'ProjectManager', 'AdminController'],
    },
    {
      title: 'Update Metadata',
      description: 'Robot Metadata Update.',
      path: '/update-apppermession',
      roles: ['Hr', 'ProjectManager', 'AdminController'],
    },  {
      title: 'Robot Model Image',
      description: 'Robot Model Image.',
      path: '/RobotImage',
      roles: ['Hr', 'ProjectManager', 'AdminController'],
    }
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
