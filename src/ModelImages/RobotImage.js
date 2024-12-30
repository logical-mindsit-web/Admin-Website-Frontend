import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', width: '300px' }}>
        <h3>Upload Image</h3>
        <Link to="/Uplodeimage">
          <button style={{ padding: '10px', cursor: 'pointer' }}>Go to Upload</button>
        </Link>
      </div>
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', width: '300px' }}>
        <h3>View Image</h3>
        <Link to="/Viewimage">
          <button style={{ padding: '10px', cursor: 'pointer' }}>Go to View</button>
        </Link>
      </div>
    </div>
  );
};

export default MainPage;
