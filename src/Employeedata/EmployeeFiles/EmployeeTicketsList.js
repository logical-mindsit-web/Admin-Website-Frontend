import React, { useEffect, useState } from "react";
import axios from "../../utils/apiticket";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  TextField,
  Box,
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
  const [noDataMessage, setNoDataMessage] = useState("");

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

  useEffect(() => {
    fetchTickets(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (tickets.length === 0) {
      setEmployeeCount(0);
    } else {
      const uniqueEmployeeIds = new Set(
        tickets.map((ticket) => ticket.employeeId)
      );
      setEmployeeCount(uniqueEmployeeIds.size);
    }
  }, [tickets]);

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
      <Typography variant="h4" gutterBottom>
        Employee Tickets & Update's
      </Typography>

      {/* Display Employee Count only when a date is selected */}
      {selectedDate && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "#f0f0f0",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="body1" style={{ fontWeight: "bold" }}>
            Employees: {employeeCount}
          </Typography>
        </div>
      )}

      {/* DatePicker to select the date */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box mb={3}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            renderInput={(props) => <TextField {...props} />}
          />
        </Box>
      </LocalizationProvider>

      {/* Display No Data Message */}
      {noDataMessage && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <Alert severity="info">{noDataMessage}</Alert>
        </div>
      )}

      {/* Display tickets */}
      <Grid container spacing={3}>
        {tickets.map((ticket) => (
          <Grid item xs={12} sm={6} md={4} key={ticket._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3">
                  Employee ID: {ticket.employeeId}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                <strong> Date: {new Date(ticket.date).toLocaleDateString("en-GB")}</strong>
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
    </div>
  );
};

export default UserTicketsList;
