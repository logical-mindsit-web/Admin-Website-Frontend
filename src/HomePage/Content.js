import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MainContent = () => {
  const [showCards, setShowCards] = useState(false);
  const navigate = useNavigate();

  const handleStartClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setShowCards(true);
      navigate('/card');
    } else {
      alert('Please login to start');
    }
  };

  return (
    <div style={styles.mainContent}>
      {!showCards ? (
        <>
          <h1 style={styles.mainHeading}>GET Your Customer </h1>
          <p style={styles.mainSubheading}>Revolutionize disinfection like never before</p>
          <p style={styles.mainText}>Spotless AI is the next revolution</p>
          <div style={styles.buttonGroup}>
            <Button style={styles.aboutButton} onClick={handleStartClick}>Start</Button>
          </div>
        </>
      ) : null}
    </div>
  );
};

const styles = {
  mainContent: {
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  mainHeading: {
    fontSize: '3rem',
    margin: '0.5rem 0',
    color: '#333',
  },
  mainSubheading: {
    fontSize: '1.5rem',
    margin: '0.5rem 0',
    color: '#555',
  },
  mainText: {
    fontSize: '1rem',
    margin: '1rem 0',
    color: '#777',
  },
  buttonGroup: {
    margin: '2rem 0',
  },
  aboutButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '1rem',
  },
};

export default MainContent;
