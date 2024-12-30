import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../utils/api';

const ForgetVerifyOTP = () => {
  const [otp, setOTP] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      setMessage('No email provided');
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage('No email provided');
      return;
    }
    try {
      const response = await axios.post('/password-otp-verify', { email, otp });
      console.log(response.data);
      setMessage(response.data.message);

      if (response.data.message === "OTP verified, proceed to reset password") {
        navigate('/forget-reset-password', { state: { email } });   
      }
    } catch (error) {
      console.error('Error:', error.response?.data.message || error.message);
      setMessage(error.response?.data.message || error.message);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.headingContainer}>
        <h2 style={styles.heading}>Verify OTP</h2>
      </div>
      <div style={styles.container}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <label style={styles.formLabel}>
            OTP:
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              required
              style={styles.formInput}
            />
          </label>
          <button type="submit" style={styles.submitButton}>
            Submit
          </button>
        </form>
        {message && <p>{message}</p>}
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
    position: 'relative', // Ensure the headingContainer is positioned correctly
  },
  headingContainer: {
    marginBottom: '2rem',
    position: 'absolute',
    top: '1rem',
  },
  heading: {
    fontSize: '2rem',
    color: '#007bff',
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
    marginTop: '-13rem', // Adjust this if necessary to position container
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
};

export default ForgetVerifyOTP;
