import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import axios from "../../utils/apiticket";

const EmployeeIdForm = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/employee-id', {
        employeeId: employeeId, // Send the employeeId as part of the request body
      }, {
        headers: {
          'Content-Type': 'application/json', // Set the appropriate header
        }
      });
  
      console.log(response); // Log the full response
  
      if (response.status === 200 || response.status === 201) { // Check for 200 or 201 status
        setMessage('Employee ID submitted successfully!');
        navigate('/EmployeeTable');
      } else {
        setMessage(`Failed to submit Employee ID. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred.');
    }
  };
  

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9', marginTop: '100px' }}>
      <h2>Uplode Employee ID</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="employeeId" style={{ marginBottom: '8px' }}>Employee ID:</label>
        <input
          type="text"
          id="employeeId"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
          placeholder="EmplyeeName-ID(Name-001)"
          style={{ padding: '8px', marginBottom: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Submit
        </button>
      </form>
      {message && <p style={{ marginTop: '16px', color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
}

export default EmployeeIdForm;
