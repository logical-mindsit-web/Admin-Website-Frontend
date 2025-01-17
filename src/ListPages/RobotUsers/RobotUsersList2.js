import React, { useState, useEffect } from "react";
import axios from "../../utils/api";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CardMedia,
  Box,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";
import "./loadingStyles.css";

const RobotList = () => {
  const { email } = useParams();
  const [robots, setRobots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [robotToDelete, setRobotToDelete] = useState(null);
  const [enteredRobotId, setEnteredRobotId] = useState(""); // Store the entered RobotId

  // Decode the email
  const decodeEmail = (encodedEmail) => {
    return atob(decodeURIComponent(encodedEmail));
  };

  useEffect(() => {
    const fetchRobots = async () => {
      try {
        const decodedEmail = decodeEmail(email);
        const response = await axios.get(`/robots/${decodedEmail}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setRobots(response.data);
      } catch (error) {
        console.error("Error fetching robots:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRobots();
  }, [email]);

  // Function to delete a robot
  const handleDelete = async () => {
    if (enteredRobotId !== robotToDelete) {
      setSnackbarMessage("Robot ID does not match.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      await axios.delete(`/robots/${robotToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Update the robots state to remove the deleted robot
      setRobots(robots.filter((robot) => robot.robotId !== robotToDelete));
      // Set snackbar message and open it
      setSnackbarMessage("Robot deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting robot:", error);
      setSnackbarMessage("Failed to delete robot.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setDialogOpen(false); // Close dialog after deletion attempt
      setEnteredRobotId(""); // Reset entered robot ID
    }
  };

  // Function to open the delete confirmation dialog
  const openDialog = (robotId) => {
    setRobotToDelete(robotId);
    setDialogOpen(true);
  };

  // Function to handle Snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Function to handle dialog close
  const handleDialogClose = () => {
    setDialogOpen(false);
    setEnteredRobotId(""); // Reset entered robot ID on close
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

  return (
    <div>
      <h1
        style={{
          fontSize: "1.3rem",
          fontWeight: "bold",
        }}
      >
        {decodeEmail(email)}
      </h1>
      {/* If no robots, display the "No robots assigned" message */}
      {robots.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="300px"
        >
          <Typography variant="h6" color="textSecondary">
            No robots assigned for this user.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {robots.map((robot, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Box flex={1} padding="16px">
                    <CardContent>
                      <Typography
                        variant="h6"
                        style={{ fontSize: "1rem", marginBottom: "8px" }}
                      >
                        {robot.username}
                      </Typography>
                      <Typography
                        style={{ fontSize: "0.9rem", marginBottom: "4px" }}
                      >
                        <strong>RobotID:</strong> {robot.robotId}
                      </Typography>
                      <Typography
                        style={{ fontSize: "0.9rem", marginBottom: "4px" }}
                      >
                        <strong>Model:</strong> {robot.model}
                      </Typography>
                      <Typography
                        style={{ fontSize: "0.9rem", marginBottom: "4px" }}
                      >
                        <strong>Serial Number:</strong> {robot.serialNumber}
                      </Typography>
                      <Typography
                        style={{ fontSize: "0.9rem", marginBottom: "4px" }}
                      >
                        <strong>IPAddress:</strong> {robot.IPAddress}
                      </Typography>
                      <Typography
                        style={{ fontSize: "0.9rem", marginBottom: "4px" }}
                      >
                        <strong>Status:</strong> {robot.status}
                      </Typography>
                      <Typography
                        style={{ fontSize: "0.9rem", marginBottom: "4px" }}
                      >
                        <strong>Location:</strong> {robot.location}
                      </Typography>
                      <Typography
                        style={{ fontSize: "0.9rem", marginBottom: "4px" }}
                      >
                        <strong>subLocation:</strong> {robot.subLocation}
                      </Typography>
                      <Typography style={{ fontSize: "0.9rem" }}>
                        <strong>Robot Initialize Date:</strong>{" "}
                        {new Date(
                          robot.robotInitializeDate
                        ).toLocaleDateString()}
                      </Typography>
                      <Typography style={{ fontSize: "0.9rem" }}>
                        <strong>Last Maintenance:</strong>{" "}
                        {new Date(
                          robot.lastMaintenanceDate
                        ).toLocaleDateString()}
                      </Typography>
                      {/* Delete button */}
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => openDialog(robot.robotId)}
                        style={{ marginTop: "8px" }} // Optional styling
                      >
                        Delete
                      </Button>
                    </CardContent>
                  </Box>
                  <CardMedia
                    component="img"
                    image={robot.image}
                    alt={robot.name}
                    style={{
                      width: "100px",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Snackbar for alerts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Snackbar position
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <div
        style={{
          display: dialogOpen ? "block" : "none",
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: "9999",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            minWidth: "300px",
          }}
        >
          <h3 style={{color:"black"}}>Delete Robot</h3>
          <p>
            Are you sure you want to delete this robot? Please enter the RobotID
            to confirm.
          </p>
          <p>To conform, <strong>{robotToDelete}</strong></p>
          <input
            type="text"
            placeholder="Enter Robot ID"
            value={enteredRobotId}
            onChange={(e) => setEnteredRobotId(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button
              onClick={handleDialogClose}
              style={{
                padding: "8px 16px",
                backgroundColor: "#f0f0f0",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              style={{
                padding: "8px 16px",
                backgroundColor: "#d32f2f",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobotList;
