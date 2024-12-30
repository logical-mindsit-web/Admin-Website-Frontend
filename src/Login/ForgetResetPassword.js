import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../utils/api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ForgetResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/forget-reset-password', { email, password, confirmPassword });
      console.log(response.data);
      localStorage.setItem('token', response.data.token);
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

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.headingContainer}>
        <h2 style={styles.heading}>Reset Password</h2>
      </div>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.inputContainer}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <span onClick={toggleShowPassword} style={styles.eyeIcon}>
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        <div style={styles.inputContainer}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={styles.input}
          />
          <span onClick={toggleShowConfirmPassword} style={styles.eyeIcon}>
            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        <button type="submit" style={styles.button}>
          Reset Password
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
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
    padding: '20px',
    boxSizing: 'border-box',
  },
  headingContainer: {
    marginBottom: '0rem',
  },
  heading: {
    fontSize: '2rem',
    color: '#007bff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    borderRadius: '8px',
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    paddingRight: '40px', // Add space for the eye icon
    boxSizing: 'border-box',
  },
  eyeIcon: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#333',
  },
  button: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '20px',
    fontSize: '16px',
    color: '#e74c3c',
  },
};

export default ForgetResetPassword;
