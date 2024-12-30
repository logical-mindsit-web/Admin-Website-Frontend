import React, { useEffect, useState } from "react";
import axios from "../utils/api";
import { useParams } from "react-router-dom"; // To extract email from URL params
import { Card, CardContent, Typography, IconButton, Button ,Snackbar,Alert} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./loadingStyles.css";

const SessionDetails = () => {
  const { email } = useParams(); // Extract the email from the URL
  const [sessionDetails, setSessionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const navigate = useNavigate();

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "" });
  };

  const decodeEmail = (encodedEmail) => {
    return atob(decodeURIComponent(encodedEmail));
  };

  useEffect(() => {
    const fetchSessionDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing. Please log in.");
        setLoading(false);
        return;
      }
      try {
        const decodedEmail = decodeEmail(email);
        const response = await axios.get(`https://spotlessai-backend.onrender.com/sessions/${decodedEmail}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessionDetails(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchSessionDetails();
  }, [email]);

  const handleConform = async () => {
    try {
      const token = localStorage.getItem("token"); // Ensure token for authentication
      const response = await axios.post(
        `/sessions/${sessionDetails[0]._id}/conform`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update session status in state immediately after success
      setSessionDetails((prevSessionDetails) =>
        prevSessionDetails.map((s) =>
          s._id === sessionDetails[0]._id ? { ...s, status: "conformed" } : s
        )
      );
      showSnackbar(response.data.message, "success");
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Error conforming the session",
        "error"
      );
    }
  };

  const handleReject = async () => {
    try {
      const token = localStorage.getItem("token"); // Ensure token for authentication
      const response = await axios.post(
        `https://spotlessai-backend.onrender.com/sessions/${sessionDetails[0]._id}/reject`,
        { reason: "Session date unavailable" }, // Include rejection reason
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update session status in state immediately after success
      setSessionDetails((prevSessionDetails) =>
        prevSessionDetails.map((s) =>
          s._id === sessionDetails[0]._id ? { ...s, status: "rejected" } : s
        )
      );
      showSnackbar(response.data.message, "success");
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Error rejecting the session",
        "error"
      );
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

  if (error) return <div>Error: {error}</div>;
  if (!sessionDetails) return <div>No session details available</div>;

  return (
    <div className="session-details-container">
      <h1 className="centered-heading">Booking Details for {sessionDetails[0]?.name}</h1>
      <Card className="session-card">
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => navigate("/Booking-details")}
          aria-label="back"
          className="back-arrow-button"
        >
          <ArrowBackIcon />
        </IconButton>
        <CardContent>
          {sessionDetails.map((session) => (
            <div key={session._id}>
              <Typography variant="body1">Name: {session.name}</Typography>
              <Typography variant="body1">
                Company: {session.companyName}
              </Typography>
              <Typography variant="body1">Email: {session.email}</Typography>
              <Typography variant="body1">Mobile: {session.mobile}</Typography>
              <Typography variant="body1">
                Address: {session.address}
              </Typography>
              <Typography variant="body1">
                Booking Date: {new Date(session.date).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">
                Received Date: {new Date(session.bookedAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">
                Booked Until:{" "}
                {new Date(session.bookedUntil).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">
                Availability:{" "}
                {session.isAvailable ? "Available" : "Not Available"}
              </Typography>
              <Typography variant="body1">
                Blocked Dates:{" "}
                {session.blockedDates
                  .map((date) => new Date(date).toLocaleDateString())
                  .join(", ")}
              </Typography>
            </div>
          ))}
        </CardContent>

        {/* Conform and Reject buttons */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          {sessionDetails[0]?.status === "conformed" ? (
            <span style={{ fontSize: "20px", color: "green" }}>✔</span>
          ) : sessionDetails[0]?.status === "rejected" ? (
            <span style={{ fontSize: "20px", color: "red" }}>❌</span>
          ) : (
            <>
              <Button
                variant="contained"
                style={{ backgroundColor: "green", color: "white" }}
                onClick={handleConform}
              >
                Conform
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: "red", color: "white" }}
                onClick={handleReject}
              >
                Reject
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Snackbar for success or error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <style jsx>{`
        .session-details-container {
          padding: 20px;
        }
        .centered-heading {
          text-align: center; /* Center the heading */
          margin-bottom: 20px; /* Optional, for spacing */
        }
        .session-card {
          max-width: 600px;
          margin: auto;
          margin-bottom: 20px;
          padding: 20px;
          position: relative;
        }
        .back-arrow-button {
          position: absolute;
          top: 10px;
          left: 10px;
        }
      `}</style>
    </div>
  );
};

export default SessionDetails;
