import React, { useEffect, useState } from "react";
import axios from "../../utils/apiticket";

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
        params: { date: date ? date : "" },
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

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
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
      <div style={{ textAlign: "center", padding: "20px" }}>
        <div
          style={{
            background: "#f8d7da",
            padding: "10px",
            borderRadius: "5px",
            color: "#721c24",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2
        style={{
          color: "black", // Green text color
          padding: "10px 20px", // Padding for the heading
          borderRadius: "5px", // Rounded corners
        }}
      >
        Employee Tickets & Updates
      </h2>

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
          <strong>Employees: {employeeCount}</strong>
        </div>
      )}

      {/* Date Picker to select the date */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="date"
          value={selectedDate || ""}
          onChange={handleDateChange}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "16px",
            width: "200px",
          }}
        />
      </div>

      {/* Display No Data Message */}
      {noDataMessage && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <div
            style={{
              background: "#cce5ff",
              padding: "10px",
              borderRadius: "5px",
              color: "#004085",
            }}
          >
            {noDataMessage}
          </div>
        </div>
      )}

      {/* Display tickets in 3 columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)", // 3 columns
          gap: "20px",
        }}
      >
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            style={{
              background: "#fff",
              padding: "15px",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3>Employee ID: {ticket.employeeId}</h3>
            <p style={{ color: "#6c757d" }}>
              <strong>
                Date: {new Date(ticket.date).toLocaleDateString("en-GB")}
              </strong>
            </p>
            <div style={{ marginTop: "10px" }}>
              {ticket.entries.map((entry, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                  <strong>Ticket No:</strong> {entry.ticketNo}
                  <p>
                    <strong>Hours:</strong> {entry.noOfHours} <br />
                    <strong>Description:</strong> {entry.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTicketsList;
