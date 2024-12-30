import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from '../../utils/api';
import {
  Container,
  Typography,
  CardMedia,
  Grid,
} from "@mui/material";
import "./loadingStyles.css";

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  image: {
    width: "200px",
    height: "auto",
    margin: "5px",
  },
};

const CameraImages = () => {
  const { messageId } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `/robotmsgs/message/${messageId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setImages(response.data.data.camera_images || []);
      } catch (error) {
        console.error("Error fetching camera images:", error);
        setError("Failed to load the camera images.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [messageId]);

  if (loading) {
    return (
      <div className="wrapper">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="shadow"></div>
        <div className="shadow"></div>
        <div className="shadow"></div>
        <span>Loading</span>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!images.length) {
    return <div>No camera images available for this message.</div>;
  }

  return (
    <Container style={styles.container}>
      <Typography variant="h4" gutterBottom>
        Camera Images
      </Typography>
      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <CardMedia
              component="img"
              src={`data:image/jpeg;base64,${image}`}
              alt={`Camera Image ${index + 1}`}
              style={styles.image}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CameraImages;
