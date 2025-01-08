import React, { useState, useEffect } from "react";
import axios from "../../utils/apiticket";

const TicketForm = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [entries, setEntries] = useState([
    { ticketNo: "", noOfHours: "", description: "" },
  ]);
  const [employeeIds, setEmployeeIds] = useState([]);
  const [ticketNumbers, setTicketNumbers] = useState(new Set()); // To track unique ticket numbers

  // Fetch employee IDs from API
  useEffect(() => {
    const fetchEmployeeIds = async () => {
      try {
        const response = await axios.get("/employee-ids");
        console.log("API response:", response); // Log the entire response object
        console.log("API response data:", response.data); // Log the data specifically

        // Access employee IDs from response.data.data
        if (Array.isArray(response.data.data)) {
          const ids = response.data.data.map((item) => item.employeeId);
          setEmployeeIds(ids); // Store the employeeId values in the state
        } else {
          console.error(
            "Response data.data is not an array:",
            response.data.data
          );
        }
      } catch (error) {
        console.error("Error fetching employee IDs:", error);
      }
    };

    fetchEmployeeIds();
  }, []);

  const handleInputChange = (index, e) => {
    const values = [...entries];
    values[index][e.target.name] = e.target.value;
  
    if (e.target.name === 'ticketNo') {
      const ticketNos = values.map(entry => entry.ticketNo);
      const duplicates = ticketNos.filter((item, idx) => ticketNos.indexOf(item) !== idx);
  
      if (duplicates.length > 0) {
        alert('Ticket numbers should not be the same!');
        values[index][e.target.name] = ''; // Clear the conflicting input
      }
    }
  
    setEntries(values);
  };

  const handleAddEntry = () => {
    setEntries([...entries, { ticketNo: "", noOfHours: "", description: "" }]);
  };

  const handleDeleteEntry = (index) => {
    const values = [...entries];
    const deletedTicketNo = values[index].ticketNo;
    values.splice(index, 1);

    // Remove the deleted ticket number from the set
    const newTicketNumbers = new Set(ticketNumbers);
    newTicketNumbers.delete(deletedTicketNo);
    setTicketNumbers(newTicketNumbers);

    setEntries(values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all ticket numbers are unique before submission
    const ticketNos = entries.map((entry) => entry.ticketNo);
    const uniqueTicketNos = new Set(ticketNos);
    if (ticketNos.length !== uniqueTicketNos.size) {
      alert("Ticket numbers must be unique!");
      return;
    }

    const data = {
      employeeId,
      date,
      entries,
    };

    try {
      await axios.post("/ticketsdata", data);
      alert("Data submitted successfully!");

      // Reset form fields after successful submission
      setEmployeeId("");
      setDate("");
      setEntries([{ ticketNo: "", noOfHours: "", description: "" }]);
      setTicketNumbers(new Set());
    } catch (error) {
      alert("Error submitting data!");
    }
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    padding: "20px",
  };

  const formContainerStyle = {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#f9f9f9",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

    const h2Style = {
      color:"black",
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
  };

  const inputGroupStyle = {
    marginBottom: "20px",
    width:"90%"
  };

  const inputLabelStyle = {
    fontSize: "16px",
    marginBottom: "8px",
    display: "block",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  };

  const textareaStyle = {
    ...inputStyle,
    resize: "vertical",
    minHeight: "100px",
  };

  const entryContainerStyle = {
    backgroundColor: "#fff",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "4px",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
  };

  const entryHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  };

  const deleteBtnStyle = {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "4px",
  };

  const addBtnStyle = {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "none",
    backgroundColor: "#28a745",
    color: "white",
    cursor: "pointer",
    borderRadius: "4px",
  };

  const submitBtnStyle = {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    borderRadius: "4px",
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h2 style={h2Style}>Submit Tickets Data</h2>
        <form onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label htmlFor="employeeId" style={inputLabelStyle}>
              Employee ID
            </label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "20px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              <option value="" disabled>
                Select ID
              </option>
              {employeeIds.length > 0 ? (
                employeeIds.map((id, index) => (
                  <option key={index} value={id}>
                    {id}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No Employee IDs Available
                </option>
              )}
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="date"
              style={{
                fontSize: "16px",
                marginBottom: "5px",
                display: "block",
              }}
            >
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{
                width: "87%",
                padding: "10px",
                marginBottom: "20px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          {entries.map((entry, index) => (
            <div key={index} style={entryContainerStyle}>
              <div style={entryHeaderStyle}>
                <h3>Entry {index + 1}</h3>
                {index > 0 && (
                  <button
                    type="button"
                    style={deleteBtnStyle}
                    onClick={() => handleDeleteEntry(index)}
                  >
                    Delete
                  </button>
                )}
              </div>
              <div style={inputGroupStyle}>
                <label htmlFor={`ticketNo-${index}`} style={inputLabelStyle}>
                  Ticket Number
                </label>
                <input
                  type="text"
                  id={`ticketNo-${index}`}
                  name="ticketNo"
                  value={entry.ticketNo}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={inputGroupStyle}>
                <label htmlFor={`noOfHours-${index}`} style={inputLabelStyle}>
                  Number of Hours
                </label>
                <input
                  type="number"
                  id={`noOfHours-${index}`}
                  name="noOfHours"
                  value={entry.noOfHours}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={inputGroupStyle}>
                <label htmlFor={`description-${index}`} style={inputLabelStyle}>
                  Description
                </label>
                <textarea
                  id={`description-${index}`}
                  name="description"
                  value={entry.description}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                  style={textareaStyle}
                ></textarea>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddEntry}
            style={{ ...addBtnStyle, marginBottom: "10px" }}
          >
            Add Another Entry
          </button>

          <button type="submit" style={submitBtnStyle}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;
