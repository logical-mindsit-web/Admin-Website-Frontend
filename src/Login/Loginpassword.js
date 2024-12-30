import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../utils/api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPassword = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', { email, password });
      console.log(response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('email',email);
      setMessage(response.data.message);
      navigate('/card');
    } catch (error) {
      console.error('Error:', error.response.data);
      setMessage(error.response.data.message);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.headingContainer}>
        <h2 style={styles.heading}>Login</h2>
      </div>
      <div style={styles.container}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <label style={styles.formLabel}>
            Password:
            <div style={styles.inputContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.formInput}
              />
              <span onClick={toggleShowPassword} style={styles.eyeIcon}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </label>
          <button type="submit" style={styles.submitButton}>
            Login
          </button>
          <a href="/forgetPassword" style={styles.link}>Forget password?</a>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '2rem',
  },
  headingContainer: {
    marginBottom: '2rem',
    position: 'absolute',
    top: '5rem',
  },
  heading: {
    fontSize: '2rem',
    color: '#007bff',
    marginBottom: '-4rem',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.6)',
    width: '50%',
    maxWidth: '900px',
    marginTop: '-13rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  formLabel: {
    marginBottom: '1rem',
    width: '100%',
    textAlign: 'left',
    fontSize: '1rem',
    color: '#555',
  },
  formInput: {
    padding: '0.75rem',
    marginTop: '0.5rem',
    borderRadius: '5px',
    border: '1px solid #ddd',
    width: '100%',
    fontSize: '1rem',
    boxSizing: 'border-box',
    paddingRight: '40px', // Space for eye icon
  },
  submitButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '1rem',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
  },
  link: {
    marginTop: '1rem',
    color: '#007bff',
    textDecoration: 'none',
  },
  message: {
    marginTop: '1rem',
    fontSize: '1rem',
    color: '#e74c3c',
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '400px',
  },
  eyeIcon: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#333',
  },
};

export default LoginPassword;

