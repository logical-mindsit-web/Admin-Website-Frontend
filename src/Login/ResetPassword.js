import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../utils/api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/reset-password', { email, password, confirmPassword });
      console.log(response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/card');
    } catch (error) {
      console.error('Error:', error.response.data);
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
        <h2 style={styles.heading}>Set Password</h2>
      </div>
      <div style={styles.container}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputContainer}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.formInput}
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
              style={styles.formInput}
            />
            <span onClick={toggleShowConfirmPassword} style={styles.eyeIcon}>
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          <button type="submit" style={styles.submitButton}>
            Reset Password
          </button>
        </form>
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
    maxWidth: '500px',
    marginTop: '-13rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: '20px',
  },
  formInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    paddingRight: '40px', // Space for the eye icon
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
  submitButton: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default ResetPassword;
