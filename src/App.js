import React, { useEffect } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import Header from './HomePage/Header';
import AfterLoginRoutes from "./Routes/AfterLoginRoutes "
import Footer from "./HomePage/Fooder";
import { useLocation } from 'react-router-dom';

const App = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  const AppWrapper = () => {

    const navigate = useNavigate();
    const location = useLocation();
  
    useEffect(() => {
      const path = location.pathname;
  
      if (isAuthenticated()) {
        if (path === '/') {
          navigate('/card'); 
        }
      } else {
        if (path !== '/') {
          navigate('/'); 
        }
      }
    }, [location.pathname, navigate]);

    return (
      <div style={styles.app}>
        {isAuthenticated() && <Header />}
        <div style={styles.content}>
          <AfterLoginRoutes />
        </div>
        {isAuthenticated() && <Footer />}
      </div>
    );
  };

  return (
    <Router>
      <AppWrapper />
    </Router>
  );
};

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  content: {
    flex: 1,
    position: 'relative',
  },
};

export default App;