import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "./loadingStyles.css";
import axios from "../../utils/apiticket";

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Define an async function for the API call
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get('/employee-ids');
        setEmployees(response.data.data); // Use the response data
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setLoading(false); // Set loading to false even if there is an error
      }
    };

    // Call the async function
    fetchEmployeeData();
  }, []); // Empty dependency array means it runs once after the first render

  if (loading) {
    return (
      <div className="wrapper">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="shadow"></div>
        <div className="shadow"></div>
        <div className="shadow"></div>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Employee List's</h2>

      {/* Button to navigate to /EmployeeIdForm */}
      <button
        onClick={() => navigate('/EmployeeIdForm')}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Go to Employee ID Form
      </button>

      <table style={{ width: '60%', borderCollapse: 'collapse', marginTop: '20px', margin: '0 auto' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>S.No.</th>
            <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Employee ID</th>
            <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Name</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => {
            const [name, id] = employee.employeeId.split('-'); // Split the employeeId into name and ID
            return (
              <tr key={employee._id}>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{index + 1}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{id}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
