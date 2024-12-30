import React, { useEffect, useState } from 'react';
import axios from "../utils/api";

const ModelImageDisplay = () => {
  const [modelImages, setModelImages] = useState([]); // State to hold model images

  // Fetch the model data from the API
  useEffect(() => {
    const fetchModelImages = async () => {
      try {
        // Retrieve the token from local storage (or context)
        const token = localStorage.getItem('token'); // Adjust as needed

        const response = await axios.get('/getModelImages', {
          headers: {
            Authorization: `Bearer ${token}`, // Add the Authorization header
          },
        });

        // Directly update the state with the response data to immediately display the images
        setModelImages(response.data); // This triggers a re-render with the new images
      } catch (error) {
        console.error('Error fetching the model images:', error);
      }
    };

    fetchModelImages();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div style={styles.container}>
      <h1>Model Images</h1>
      <div style={styles.imageContainer}>
        {modelImages.length > 0 ? (
          modelImages.map((model) => (
            <div key={model._id} style={styles.card}>
              <h3>{model.model}</h3>
              <img
                src={model.image} // The base64 image string is used directly here
                alt={model.model}
                style={styles.image}
              />
            </div>
          ))
        ) : (
          <p>No models found.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'column', 
    height: '65vh', 
    textAlign: 'center', 
  },
  imageContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center', // Center the cards
  },
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
    width: '200px',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
  },
};

export default ModelImageDisplay;
