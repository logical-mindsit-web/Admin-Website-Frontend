import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from '../../utils/api';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Grid,
  Box,
} from "@mui/material";
import "./loadingStyles.css";

const styles = {
  container: {
    padding: "20px",
    maxWidth: "990px",
    margin: "0 auto",
  },
  card: {
    marginBottom: "20px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    height: "250px", // Set a fixed height for consistency
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardContent: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 10px", 
    marginTop: "0", 
    marginBottom: "auto", 
  },
  button: {
    padding: "6px 12px",
    fontSize: "0.6rem",
    marginRight: "8px",
  },
  viewButton: {
    backgroundColor: "#007bff",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#0056b3",
    },
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#c0392b",
    },
  },
};


const RobotMessages = () => {
  const { robotId } = useParams();
  const [messagesData, setMessagesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `/robotmsgs/${robotId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessagesData(response.data.data);
      } catch (error) {
        console.error("Error fetching robot messages:", error);
        setError("Failed to load the robot messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [robotId]);

  const handleViewImages = (messageId) => {
    navigate(`/camera-images/${messageId}`);
  };

  const handleDelete = (messageId) => {
    const confirmDelete = window.confirm(
      "If the Problem Solved Means the image has been deleted ❌"
    );
    if (confirmDelete) {
      handleDeleteImages(messageId);
    }
  };

  const handleDeleteImages = async (messageId) => {
    try {
      // Call the API to delete images
      await axios.delete(
        `/robotmsgs/message/${messageId}/images`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the state to remove images from the message
      setMessagesData((prevData) =>
        prevData.map((msg) =>
          msg._id === messageId
            ? { ...msg, camera_images: [], resolved: true }
            : msg
        )
      );
    } catch (error) {
      console.error("Error deleting images:", error);
      setError("Failed to delete images.");
    }
  };

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
    return (
      <Container style={styles.container}>
        <Typography variant="h4" gutterBottom>
          Error Loading Messages
        </Typography>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container style={styles.container}>
      <Typography variant="h4" gutterBottom>
        Messages for Robot ID: {robotId}
      </Typography>
      <Grid container spacing={2}>
        {messagesData.map((messageData) => (
          <Grid item xs={12} sm={6} md={4} key={messageData._id}>
            <Card style={styles.card}>
              <CardContent>
                <Typography variant="h6" style={{ textAlign: "center" }}>Message Details</Typography>
                <Typography>
                  <strong>Email ID:</strong> {messageData.emailId}
                </Typography>
                <Typography>
                  <strong>Message:</strong> {messageData.message}
                </Typography>
                <Typography>
                  <strong>Created At:</strong>{" "}
                  {new Date(messageData.createdAt).toLocaleString()}
                </Typography>
                <Typography>
                  <strong>Resolved:</strong>{" "}
                  {messageData.resolved ? "Yes" : "No"}
                </Typography>

                <Box style={styles.buttonContainer}>
                  {messageData.resolved ? (
                    <Typography variant="body2" 
                    style={{ color: "#28a745",
                      marginTop: "-15px",
                      textAlign: "center",
                    }}>
                      <h4>Problem Solved...!✅</h4>
                    </Typography>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        onClick={() => handleViewImages(messageData._id)}
                        style={{ ...styles.button, ...styles.viewButton }}
                      >
                        View Images
                      </Button>

                      <Button
                        variant="contained"
                        onClick={() => handleDelete(messageData._id)}
                        style={{ ...styles.button, ...styles.deleteButton }}
                      >
                        Problem Resolve
                      </Button>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RobotMessages;
