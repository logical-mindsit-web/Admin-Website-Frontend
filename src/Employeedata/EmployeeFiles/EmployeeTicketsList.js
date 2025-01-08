import React, { useEffect, useState, useCallback } from "react";
import axios from "../../utils/apiticket";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  TextField,
  Box,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const UserTicketsList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [notUpdatedCount, setNotUpdatedCount] = useState(0);
  const [noDataMessage, setNoDataMessage] = useState("");
  const [notUpdatedEmployeeIds, setNotUpdatedEmployeeIds] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const fetchTickets = async (date) => {
    try {
      setLoading(true);
      setNoDataMessage("");
      const response = await axios.get("/user-tickets", {
        params: { date: date ? date.format("YYYY-MM-DD") : "" },
      });

      if (response.data.length === 0) {
        setNoDataMessage(
          date
            ? "No data available for the selected date."
            : "No data available in the database."
        );
      }

      setTickets(response.data);
    } catch (error) {
      setError("Error fetching tickets. Please try again later.");
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotUpdatedCount = useCallback(async (updatedCount) => {
    try {
      const response = await axios.get("/employee-ids");
      const totalEmployeeCount = response.data.data.length;
      setNotUpdatedCount(totalEmployeeCount - updatedCount);

      const updatedEmployeeIds = new Set(tickets.map((ticket) => ticket.employeeId));
      const allEmployeeIds = response.data.data.map((employee) => employee.employeeId);
      const notUpdatedEmployeeIds = allEmployeeIds.filter(
        (employeeId) => !updatedEmployeeIds.has(employeeId)
      );
      setNotUpdatedEmployeeIds(notUpdatedEmployeeIds);
    } catch (error) {
      console.error("Error fetching total employee count:", error);
    }
  }, [tickets]);

  useEffect(() => {
    fetchTickets(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (tickets.length === 0) {
      setEmployeeCount(0);
      setNotUpdatedCount(0);
    } else {
      const uniqueEmployeeIds = new Set(tickets.map((ticket) => ticket.employeeId));
      setEmployeeCount(uniqueEmployeeIds.size);
      fetchNotUpdatedCount(uniqueEmployeeIds.size);
    }
  }, [tickets, fetchNotUpdatedCount]);

  const handlePopupOpen = () => setShowPopup(true);
  const handlePopupClose = () => setShowPopup(false);

  if (loading) {
    return (
      <div className="wrapper">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="shadow"></div>
        <div className="shadow"></div>
        <div className="shadow"></div>
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom  style={{ marginBottom: "20px" }} >
        Employee daily Updates
      </Typography>

      {/* Updated and Not Updated Counts */}
      {selectedDate && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              background: "#f0f0f0",
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="body1" style={{ fontWeight: "bold" }}>
              Updated Employees: {employeeCount}
            </Typography>
          </div>
          <div
            onClick={handlePopupOpen}
            style={{
              background: "#f0f0f0",
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
            }}
          >
            <Typography variant="body1" style={{ fontWeight: "bold" }}>
              Not Updated Employees: {notUpdatedCount}
            </Typography>
          </div>
        </div>
      )}

      {/* DatePicker */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box style={{ marginTop: "30px", marginBottom: "20px" }} >
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            renderInput={(props) => <TextField {...props} />}
          />
        </Box>
      </LocalizationProvider>

      {/* No Data Message */}
      {noDataMessage && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <Alert severity="info">{noDataMessage}</Alert>
        </div>
      )}

      {/* Tickets */}
      <Grid container spacing={3} style={{ marginTop: "20px" }}>
        {tickets.map((ticket) => (
          <Grid item xs={12} sm={6} md={4} key={ticket._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3">
                  Employee ID: {ticket.employeeId}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Date:</strong>{" "}
                  {new Date(ticket.date).toLocaleDateString("en-GB")}
                </Typography>
                <div style={{ marginTop: "10px" }}>
                  {ticket.entries.map((entry, index) => (
                    <div key={index} style={{ marginBottom: "10px" }}>
                      <Typography variant="body1" component="strong">
                        <strong>Ticket No:</strong> {entry.ticketNo}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Hours:</strong> {entry.noOfHours} <br />
                        <strong>Description:</strong> {entry.description}
                      </Typography>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Custom Popup */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            zIndex: 1000,
          }}
        >
          <Typography variant="h6">Not Updated Employees</Typography>
          <ul>
            {notUpdatedEmployeeIds.map((id, index) => (
              <li key={index}>{id}</li>
            ))}
          </ul>
          <Button
            onClick={handlePopupClose}
            style={{
              marginTop: "10px",
              backgroundColor: "#1976d2",
              color: "#fff",
              padding: "5px 10px",
              borderRadius: "4px",
            }}
          >
            Close
          </Button>
        </div>
      )}

      {/* Overlay */}
      {showPopup && (
        <div
          onClick={handlePopupClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        />
      )}
    </div>
  );
};

export default UserTicketsList;
