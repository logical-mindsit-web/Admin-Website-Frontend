import React, { useState, useRef } from 'react';
import axios from "../utils/api";

const ModelImageForm = () => {
  const [model, setModel] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null); // Create a ref for the file input

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if an image file is selected
    if (!imageFile) {
      setMessage('Please upload an image file.');
      return;
    }

    // Convert image to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result; // Base64 encoded image string
      try {
        const token = localStorage.getItem('token'); // Retrieve token from local storage

        const response = await axios.post(
          '/ModelImage', // Adjust the URL as needed
          {
            model: model,
            image: base64Image,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the Authorization header
            },
          }
        );

        console.log('Response from server:', response.data);
        setMessage('Model and image saved successfully!');

        // Reset form fields after a delay
        setTimeout(() => {
          setModel('');
          setImageFile(null);
          setMessage('');
          fileInputRef.current.value = ''; // Clear the file input field
        }, 2000); // 2 seconds delay to show the success message
      } catch (error) {
        console.error('Error saving model image:', error);
        setMessage('Error saving model image. Please try again.');
      }
    };

    reader.readAsDataURL(imageFile); // Convert the image file to base64
  };

  // Inline styles
  const styles = {
    container: {
      maxWidth: '600px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
      color: '#333',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '20px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '16px',
    },
    button: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px 15px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      width: '100%',
    },
    message: {
      textAlign: 'center',
      marginTop: '20px',
      color: '#d9534f',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Upload Model Image</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label style={styles.label}>
            Model Name:
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
              style={styles.input}
            />
          </label>
        </div>
        <div>
          <label style={styles.label}>
            Image:
            <input
              type="file"
              accept="image/png, image/jpeg" // Accept only PNG and JPEG images
              onChange={(e) => {
                setImageFile(e.target.files[0]);
              }}
              required
              style={styles.input}
              ref={fileInputRef} // Attach the ref to the file input
            />
          </label>
        </div>
        <button type="submit" style={styles.button}>
          Upload
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>} {/* Display success/error messages */}
    </div>
  );
};

export default ModelImageForm;