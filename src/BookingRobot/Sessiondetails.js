import React, { useEffect, useState } from "react";
import axios from "../utils/api";
import { Button, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./loadingStyles.css";

const AllSessions = () => {
  const [sessions, setSessions] = useState([]);
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

  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing. Please log in.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get("/sessions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handleConform = async (session) => {
    try {
      const token = localStorage.getItem("token"); // Ensure token for authentication
      const response = await axios.post(
        `/sessions/${session._id}/conform`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update session status in state immediately after success
      setSessions((prevSessions) =>
        prevSessions.map((s) =>
          s._id === session._id ? { ...s, status: "conformed" } : s
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

  const handleReject = async (session) => {
    try {
      const token = localStorage.getItem("token"); // Ensure token for authentication
      const response = await axios.post(
        `/sessions/${session._id}/reject`,
        { reason: "Session date unavailable" }, // Include rejection reason
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update session status in state immediately after success
      setSessions((prevSessions) =>
        prevSessions.map((s) =>
          s._id === session._id ? { ...s, status: "rejected" } : s
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

  const handleViewDetails = (session) => {
    const decodeEmail = encodeURIComponent(btoa(session.email));
    navigate(`/session-details/${decodeEmail}`);
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
  if (sessions.length === 0) return <div>No sessions available</div>;

  return (
    <div className="sessions-container">
      <h1>All Booked Sessions</h1>
      <table className="sessions-table">
        <thead>
          <tr>
            <th>Received Date</th>
            <th>Name</th>
            <th>Company Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Address</th>
            <th>Booking Date</th>
            <th>Reply Mail</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr
              key={session._id}
              onClick={() => handleViewDetails(session)} // Click row to navigate to details page
              style={{ cursor: "pointer" }} // Make the row look clickable
            >
              <td>{new Date(session.bookedAt).toLocaleDateString('en-GB')}</td>
              <td>{session.name}</td>
              <td>{session.companyName}</td>
              <td>{session.email}</td>
              <td>{session.mobile}</td>
              <td>{session.address}</td>
              <td>{new Date(session.date).toLocaleDateString('en-GB')}</td>
              <td>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                  }}
                >
                  {session.status === "conformed" ? (
                    <span style={{ fontSize: "20px", color: "green" }}>✔</span>
                  ) : session.status === "rejected" ? (
                    <span style={{ fontSize: "20px", color: "red" }}>❌</span>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        className="green-btn"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click event
                          handleConform(session);
                        }}
                      >
                        Conform
                      </Button>
                      <Button
                        variant="contained"
                        className="red-btn"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click event
                          handleReject(session);
                        }}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
        .green-btn,
        .red-btn {
          padding: 6px 12px;
          font-size: 10px;
        }
        .sessions-container {
          padding: 20px;
          overflow-x: auto;
        }
        .sessions-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          table-layout: fixed;
        }
        .sessions-table th,
        .sessions-table td {
          padding: 10px;
          text-align: center;
          border: 1px solid #ddd;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .sessions-table th {
          background-color: #f4f4f4;
        }
        .sessions-table td {
          background-color: #fff;
        }
        .sessions-table tr:hover {
          background-color: #f1f1f1;
        }
        .sessions-table td {
          word-wrap: break-word;
        }
        .sessions-table .green-btn {
          background-color: green;
          color: white;
        }
        .sessions-table .red-btn {
          background-color: red;
          color: white;
        }

        @media (max-width: 768px) {
          .sessions-table {
            width: 100%;
            display: block;
          }
          .sessions-table th,
          .sessions-table td {
            display: block;
            width: 100%;
            text-align: left;
            padding: 10px 5px;
            border: none;
          }
          .sessions-table td {
            word-wrap: break-word;
          }
        }
      `}</style>
    </div>
  );
};

export default AllSessions;
