import React, { useEffect, useState } from "react";
import axios from "../utils/api";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Typography,
  Alert,
  Button,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Download as DownloadIcon } from "@mui/icons-material"; // MUI icon for download

const SessionsTable = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get("/sessions");
        if (response.data.success) {
          setSessions(response.data.data);
        } else {
          setError("Failed to fetch sessions.");
        }
      } catch (err) {
        setError("An error occurred while fetching sessions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleConfirm = async (sessionId) => {
    try {
      const response = await axios.patch("/sessions/status", {
        sessionId,
        status: "conformed", // Set status to 'conformed'
      });

      if (response.data.success) {
        // Update the session state to reflect the change
        setSessions((prevSessions) =>
          prevSessions.map((session) =>
            session._id === sessionId
              ? {
                  ...session,
                  customer: { ...session.customer, status: "conformed" },
                }
              : session
          )
        );
      }
    } catch (error) {
      console.error("Error confirming session:", error.message);
    }
  };

  const handleReject = async (sessionId) => {
    try {
      const response = await axios.patch("/sessions/status", {
        sessionId,
        status: "rejected", // Set status to 'rejected'
      });

      if (response.data.success) {
        // Update the session state to reflect the change
        setSessions((prevSessions) =>
          prevSessions.map((session) =>
            session._id === sessionId
              ? {
                  ...session,
                  customer: { ...session.customer, status: "rejected" },
                }
              : session
          )
        );
      }
    } catch (error) {
      console.error("Error rejecting session:", error.message);
    }
  };

  const handleRowClick = (sessionId) => {
    // Navigate to the customer details page
    navigate(`/sessions/${sessionId}`);
  };

  const downloadCSV = () => {
    const headers = [
      "Received Date",
      "Name",
      "Company Name",
      "Email",
      "Mobile",
      "Address",
      "Booking Date",
      "Status",
    ];
    const rows = sessions.map((session) => [
      new Date(session.createdAt).toLocaleDateString("en-GB"),
      session.customer.name,
      session.customer.companyName,
      session.customer.email,
      session.customer.mobileNumber,
      session.customer.address,
      new Date(session.customer.bookedDate).toLocaleDateString("en-GB"),
      session.customer.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sessions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  if (error)
    return (
      <Alert severity="error" style={{ marginTop: "20px" }}>
        {error}
      </Alert>
    );

  if (sessions.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" color="textSecondary">
          No data available.
        </Typography>
      </div>
    );
  }

  const cellStyle = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "150px",
    border: "1px solid #ccc",
    padding: "8px",
    fontSize: "14px",
    textAlign: "center",
  };

  const headerStyle = {
    ...cellStyle,
    fontWeight: "bold",
    backgroundColor: "#f5f5f5",
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Sessions List
        </Typography>
        <IconButton onClick={downloadCSV} color="primary" disabled={sessions.length === 0}>
          <DownloadIcon />
        </IconButton>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={headerStyle}>Received Date</TableCell>
              <TableCell style={headerStyle}>Name</TableCell>
              <TableCell style={headerStyle}>Company Name</TableCell>
              <TableCell style={headerStyle}>Email</TableCell>
              <TableCell style={headerStyle}>Mobile</TableCell>
              <TableCell style={headerStyle}>Address</TableCell>
              <TableCell style={headerStyle}>Booking Date</TableCell>
              <TableCell style={headerStyle}>Reply Mail</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((session) => (
              <TableRow
                key={session._id}
                hover
                onClick={() => handleRowClick(session._id)}
                style={{ cursor: "pointer" }}
              >
                <TableCell style={cellStyle}>
                  {new Date(session.createdAt).toLocaleDateString("en-GB")}
                </TableCell>
                <TableCell style={cellStyle}>{session.customer.name}</TableCell>
                <TableCell style={cellStyle}>
                  {session.customer.companyName}
                </TableCell>
                <TableCell style={cellStyle}>
                  {session.customer.email}
                </TableCell>
                <TableCell style={cellStyle}>
                  {session.customer.mobileNumber}
                </TableCell>
                <TableCell style={cellStyle}>
                  {session.customer.address}
                </TableCell>
                <TableCell style={cellStyle}>
                  {new Date(session.customer.bookedDate).toLocaleDateString(
                    "en-GB"
                  )}
                </TableCell>
                <TableCell style={cellStyle}>
                  {session.customer.status === "pending" && (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginRight: "8px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirm(session._id);
                        }}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(session._id);
                        }}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {session.customer.status === "conformed" && (
                    <Typography variant="body2" color="success.main">
                      Confirmed
                    </Typography>
                  )}
                  {session.customer.status === "rejected" && (
                    <Typography variant="body2" color="error.main">
                      Rejected
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SessionsTable;
