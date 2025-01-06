import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate without BrowserRouter
import Header from './HomePage/Header';
import AfterLoginRoutes from "./Routes/AfterLoginRoutes "
import Footer from "./HomePage/Fooder";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // If user is authenticated, automatically navigate to /card page
      navigate("/card");
    } else {
      navigate("/");
    }
  }, [navigate]);

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  return (
    <div style={styles.app}>
      {isAuthenticated() && <Header />}
      <div style={styles.content}>
        <AfterLoginRoutes />
        {isAuthenticated() && <Footer />}
      </div>
    </div>
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