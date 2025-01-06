import React, { useState, useEffect } from "react";
import axios from "../utils/api";

const SaveRobotDetails = () => {
  const [robotDetails, setRobotDetails] = useState({
    robotId: "",
    emailId: "",
    username: "",
    model: "",
    serialNumber: "",
    IPAddress: "",
    image: "",
    status: "active",
    location: "",
    subLocation: "",
    robotInitializeDate: "",
    lastMaintenanceDate: "",
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [userEmails, setUserEmails] = useState([]);
  const [locationNames, setLocationNames] = useState([]);
  const [subLocations, setSubLocations] = useState([]);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get("/user-emails", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserEmails(response.data);
      } catch (error) {
        console.error("Error fetching user emails:", error);
      }
    };

    fetchEmails();
  }, []);

  const fetchLocationNames = async (email) => {
    try {
      const response = await axios.get(`/user/location-names/${email}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLocationNames(response.data.locationNames || []);
    } catch (error) {
      console.error("Error fetching location names:", error);
      setLocationNames([]);
    }
  };

  const fetchSubLocations = async (email, locationName) => {
    try {
      const response = await axios.get(
        `/user/${email}/location/${locationName}/sublocations`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSubLocations(response.data.subLocations || []);
    } catch (error) {
      console.error("Error fetching sub-locations:", error);
      setSubLocations([]);
    }
  };

  const fetchUserName = async (email) => {
    try {
      const response = await axios.get(`/user-name/${email}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRobotDetails((prevState) => ({ ...prevState, username: response.data.name }));
    } catch (error) {
      console.error("Error fetching user name:", error);
    }
  };

  const fetchModelImage = async (modelName) => {
    try {
      const response = await axios.get(`/ModelImage/${modelName}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRobotDetails((prevState) => ({ ...prevState, image: response.data.image }));
    } catch (error) {
      console.error("Error fetching model image:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "emailId") {
      fetchUserName(value);
      fetchLocationNames(value);
      setRobotDetails((prevState) => ({ ...prevState, emailId: value, location: "", subLocation: "" }));
    } else if (name === "location") {
      fetchSubLocations(robotDetails.emailId, value);
    } else if (name === "model") {
      fetchModelImage(value);
    }
    setRobotDetails((prevState) => ({ ...prevState, [name]: value }));
  };

  const validate = () => {
    let tempErrors = {};
    if (!robotDetails.robotId) tempErrors.robotId = "Robot ID is required";
    if (!robotDetails.emailId) tempErrors.emailId = "Email ID is required";
    if (!robotDetails.username) tempErrors.username = "Username is required";
    if (!robotDetails.model) tempErrors.model = "Model is required";
    if (!robotDetails.serialNumber) tempErrors.serialNumber = "Serial Number is required";
    if (!robotDetails.IPAddress) tempErrors.IPAddress = "IP Address is required";
    if (!robotDetails.location) tempErrors.location = "Location is required";
    if (!robotDetails.subLocation) tempErrors.subLocation = "Sub-location is required";
    if (!robotDetails.robotInitializeDate) tempErrors.robotInitializeDate = "Robot Initialize Date is required";
    if (!robotDetails.lastMaintenanceDate) tempErrors.lastMaintenanceDate = "Last Maintenance Date is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post("/robot", robotDetails, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSnackbar({ open: true, message: response.data.message, severity: "success" });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error: ${error.response ? error.response.data.error : error.message}`,
        severity: "error",
      });
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center" ,color:"black"}}>Save Robot Details</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <select
          name="emailId"
          value={robotDetails.emailId}
          onChange={handleChange}
          style={{ padding: "10px", fontSize: "16px" }}
        >
          <option value="">Select Email</option>
          {userEmails.map((email) => (
            <option key={email} value={email}>{email}</option>
          ))}
        </select>
        <input
          type="text"
          name="robotId"
          placeholder="Robot ID"
          value={robotDetails.robotId}
          onChange={handleChange}
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={robotDetails.username}
          readOnly
          style={{ padding: "10px", fontSize: "16px", backgroundColor: "#f5f5f5" }}
        />
        <select
          name="model"
          value={robotDetails.model}
          onChange={handleChange}
          style={{ padding: "10px", fontSize: "16px" }}
        >
          <option value="">Select Model</option>
          <option value="Spotbot-Lite">Spotbot-Lite</option>
          <option value="Spotbot-Xtreme">Spotbot-Xtreme</option>
        </select>
        <input
          type="text"
          name="serialNumber"
          placeholder="Serial Number"
          value={robotDetails.serialNumber}
          onChange={handleChange}
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <input
          type="text"
          name="IPAddress"
          placeholder="IP Address"
          value={robotDetails.IPAddress}
          onChange={handleChange}
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <select
          name="status"
          value={robotDetails.status}
          onChange={handleChange}
          style={{ padding: "10px", fontSize: "16px" }}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          name="location"
          value={robotDetails.location}
          onChange={handleChange}
          style={{ padding: "10px", fontSize: "16px" }}
        >
          <option value="">Select Location</option>
          {locationNames.map((location) => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
        <select
          name="subLocation"
          value={robotDetails.subLocation}
          onChange={handleChange}
          style={{ padding: "10px", fontSize: "16px" }}
        >
          <option value="">Select Sub-location</option>
          {subLocations.map((subLocation) => (
            <option key={subLocation} value={subLocation}>{subLocation}</option>
          ))}
        </select>
        <input
          type="date"
          name="robotInitializeDate"
          value={robotDetails.robotInitializeDate}
          onChange={handleChange}
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <input
          type="date"
          name="lastMaintenanceDate"
          value={robotDetails.lastMaintenanceDate}
          onChange={handleChange}
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <button
          type="submit"
          style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", borderRadius: "5px", border: "none" ,cursor: "pointer"}}
        >
          Save Robot
        </button>
      </form>
    </div>
  );
};

export default SaveRobotDetails;
