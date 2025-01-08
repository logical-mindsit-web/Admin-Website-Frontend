import React, { useEffect, useState, useCallback } from "react";
import axios from "../../utils/apiticket";

const UserTicketsList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [noDataMessage, setNoDataMessage] = useState("");
  const [notUpdatedCount, setNotUpdatedCount] = useState(0);
  const [notUpdatedEmployeeIds, setNotUpdatedEmployeeIds] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

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

  const fetchNotUpdatedCount = useCallback(
    async (updatedCount) => {
      try {
        const response = await axios.get("/employee-ids");
        const totalEmployeeCount = response.data.data.length;
        setNotUpdatedCount(totalEmployeeCount - updatedCount);

        const updatedEmployeeIds = new Set(
          tickets.map((ticket) => ticket.employeeId)
        );
        const allEmployeeIds = response.data.data.map(
          (employee) => employee.employeeId
        );
        const notUpdatedEmployeeIds = allEmployeeIds.filter(
          (employeeId) => !updatedEmployeeIds.has(employeeId)
        );
        setNotUpdatedEmployeeIds(notUpdatedEmployeeIds);
      } catch (error) {
        console.error("Error fetching total employee count:", error);
      }
    },
    [tickets]
  );

  useEffect(() => {
    fetchTickets(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (tickets.length === 0) {
      setEmployeeCount(0);
      setNotUpdatedCount(0);
    } else {
      const uniqueEmployeeIds = new Set(
        tickets.map((ticket) => ticket.employeeId)
      );
      setEmployeeCount(uniqueEmployeeIds.size);
      fetchNotUpdatedCount(uniqueEmployeeIds.size);
    }
  }, [tickets, fetchNotUpdatedCount]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };
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
          color: "black",
          alignItems: "center",
        }}
      >
        Employee daily Updates
      </h2>

      {/* Display Employee Count only when a date is selected */}
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
            <strong> Updated Employees: {employeeCount}</strong>
          </div>
          <div
            onClick={notUpdatedCount > 0 ? handlePopupOpen : null}
            style={{
              background: "#f0f0f0",
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              cursor: notUpdatedCount > 0 ? "pointer" : "not-allowed",
            }}
          >
            <strong>Not Updated Employees: {notUpdatedCount}</strong>
          </div>
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
          <strong variant="h6">Not Updated Employees</strong>
          <ul>
            {notUpdatedEmployeeIds.map((id, index) => (
              <li key={index}>{id}</li>
            ))}
          </ul>
          <button
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
          </button>
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