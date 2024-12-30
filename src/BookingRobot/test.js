import React, { useEffect, useState } from "react";
import axios from "../utils/api";
import { useParams } from "react-router-dom"; // To extract email from URL params
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./loadingStyles.css";

const SessionDetails = () => {
  const { email } = useParams(); // Extract the email from the URL
  const [sessionDetails, setSessionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        const response = await axios.get(`/sessions/${decodedEmail}`, {
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
      <h1>Booking Details for {sessionDetails[0]?.name}</h1>
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
      </Card>

      <style jsx>{`
        .session-details-container {
          padding: 20px;
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
