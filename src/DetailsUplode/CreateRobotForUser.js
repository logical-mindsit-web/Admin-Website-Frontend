import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate(); 

  // Fetch user emails from the API
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

  // Fetch location names by email
  const fetchLocationNames = async (email) => {
    try {
      const response = await axios.get(`/user/location-names/${email}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Location names data:", response.data.locationNames); // Log the nested locationNames
      setLocationNames(
        Array.isArray(response.data.locationNames)
          ? response.data.locationNames
          : []
      ); // Ensure it's an array
    } catch (error) {
      console.error("Error fetching location names:", error);
      setLocationNames([]); // Set as empty array on error
    }
  };

  // Fetch sub-locations based on location and email
  const fetchSubLocations = async (email, locationName) => {
    try {
      const response = await axios.get(
        `/user/${email}/location/${locationName}/sublocations`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Sub-locations data:", response.data.subLocations); // Log the fetched sub-locations
      setSubLocations(
        Array.isArray(response.data.subLocations)
          ? response.data.subLocations
          : []
      ); // Ensure it's an array
    } catch (error) {
      console.error("Error fetching sub-locations:", error);
      setSubLocations([]); // Set as empty array on error
    }
  };

  const fetchUserName = async (email) => {
    try {
      const response = await axios.get(`/user-name/${email}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRobotDetails((prevState) => ({
        ...prevState,
        username: response.data.name,
      }));
    } catch (error) {
      console.error("Error fetching user name:", error);
    }
  };

  const fetchModelImage = async (modelName) => {
    try {
      const response = await axios.get(`/ModelImage/${modelName}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRobotDetails((prevState) => ({
        ...prevState,
        image: response.data.image, // Ensure this is the correct property for the Base64 image
      }));
      console.log("Fetched Image:", response.data.image); // Debugging line
    } catch (error) {
      console.error("Error fetching model image:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "emailId") {
      fetchUserName(value);
      fetchLocationNames(value);
      setRobotDetails((prevState) => ({
        ...prevState,
        emailId: value,
        location: "",
        subLocation: "",
      }));
    } else if (name === "location") {
      fetchSubLocations(robotDetails.emailId, value);
    } else if (name === "model") {
      fetchModelImage(value);
    }

    setRobotDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const clearForm = () => {
    setRobotDetails({
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
  };

  const validate = () => {
    let tempErrors = {};
    if (!robotDetails.robotId) tempErrors.robotId = "Robot ID is required";
    if (!robotDetails.emailId) tempErrors.emailId = "Email ID is required";
    if (!robotDetails.username) tempErrors.username = "Username is required";
    if (!robotDetails.model) tempErrors.model = "Model is required";
    if (!robotDetails.serialNumber)
      tempErrors.serialNumber = "Serial Number is required";
    if (!robotDetails.IPAddress)
      tempErrors.IPAddress = "IP Address is required";
    if (!robotDetails.image) tempErrors.image = "Image URL is required";
    if (!robotDetails.location) tempErrors.location = "Location is required";
    if (!robotDetails.subLocation)
      tempErrors.subLocation = "subLocation is required";
    if (!robotDetails.robotInitializeDate)
      tempErrors.robotInitializeDate = "Robot Initialize Date is required";
    if (!robotDetails.lastMaintenanceDate)
      tempErrors.lastMaintenanceDate = "Last Maintenance Date is required";

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
      setSnackbar({
        open: true,
        message: response.data.message,
        severity: "success",
      });
      clearForm();
      setTimeout(() => {
        navigate("/user-robot"); 
      }, 3000); 
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error: ${
          error.response ? error.response.data.error : error.message
        }`,
        severity: "error",
      });
    }
  };

  // Close Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

    return (
      <div style={styles.container}>
        <h1 style={styles.header}>Create Robot For User {robotDetails.username}</h1>
        <div style={styles.content}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label>Email ID:</label>
              <select
                name="emailId"
                value={robotDetails.emailId}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Select Email</option>
                {userEmails.map((email) => (
                  <option key={email} value={email}>
                    {email}
                  </option>
                ))}
              </select>
              {errors.emailId && <p style={styles.error}>{errors.emailId}</p>}
            </div>
  
            <div style={styles.formGroup}>
              <label>Robot ID:</label>
              <input
                type="text"
                name="robotId"
                value={robotDetails.robotId}
                onChange={handleChange}
                style={styles.input}
              />
              {errors.robotId && <p style={styles.error}>{errors.robotId}</p>}
            </div>
  
            <div style={styles.formGroup}>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={robotDetails.username}
                onChange={handleChange}
                style={styles.input}
                readOnly
              />
            </div>
  
            <div style={styles.formGroup}>
              <label>Model:</label>
              <select
                name="model"
                value={robotDetails.model}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Select Model</option>
                <option value="Spotbot-Lite">Spotbot-Lite</option>
                <option value="Spotbot-Xtreme">Spotbot-Xtreme</option>
              </select>
              {errors.model && <p style={styles.error}>{errors.model}</p>}
            </div>
  
            <div style={styles.formGroup}>
              <label>Serial Number:</label>
              <input
                type="text"
                name="serialNumber"
                value={robotDetails.serialNumber}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
  
            <div style={styles.formGroup}>
              <label>IP Address:</label>
              <input
                type="text"
                name="IPAddress"
                value={robotDetails.IPAddress}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
  
            <div style={styles.formGroup}>
              <label>Location:</label>
              <select
                name="location"
                value={robotDetails.location}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Select Location</option>
                {locationNames.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
  
            <div style={styles.formGroup}>
              <label>Sub-Location:</label>
              <select
                name="subLocation"
                value={robotDetails.subLocation}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Select Sub-Location</option>
                {subLocations.map((subLocation) => (
                  <option key={subLocation} value={subLocation}>
                    {subLocation}
                  </option>
                ))}
              </select>
            </div>
  
            <div style={styles.formGroup}>
              <label>Robot Initialize Date:</label>
              <input
                type="date"
                name="robotInitializeDate"
                value={robotDetails.robotInitializeDate}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
  
            <div style={styles.formGroup}>
              <label>Last Maintenance Date:</label>
              <input
                type="date"
                name="lastMaintenanceDate"
                value={robotDetails.lastMaintenanceDate}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
  
            <button type="submit" style={styles.button}>
              Save Robot
            </button>
          </form>
  
          <div style={styles.imageContainer}>
            {robotDetails.image ? (
              <img src={robotDetails.image} alt="Model" style={styles.robotImage} />
            ) : (
              <p style={styles.placeholder}>No image selected</p>
            )}
          </div>
        </div>
  
        {snackbar.open && (
          <div
            style={
              snackbar.severity === "success"
                ? styles.snackbarSuccess
                : styles.snackbarError
            }
          >
            {snackbar.message}
            <button onClick={handleCloseSnackbar} style={styles.closeButton}>
              ✕
            </button>
          </div>
        )}
      </div>
    );
  };
  
  const styles = {
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    },
    header: {
      textAlign: "center",
      marginBottom: "20px",
    },
    content: {
      display: "flex",
      alignItems: "flex-start",
      gap: "20px",
    },
    form: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    formGroup: {
      marginBottom: "15px",
    },
    input: {
      width: "100%",
      padding: "10px",
      fontSize: "16px",
      marginTop: "5px",
    },
    button: {
      padding: "10px 20px",
      fontSize: "16px",
      backgroundColor: "#007BFF",
      color: "white",
      border: "none",
      cursor: "pointer",
      alignSelf: "center",
      borderRadius: "5px",
      width: "500px",
    },
    error: {
      color: "red",
      fontSize: "14px",
    },
    imageContainer: {
      marginTop:"100px",
      width: "300px",
      textAlign: "center",
    },
    robotImage: {
      width: "100%",
      height: "auto",
    },
    placeholder: {
      fontStyle: "italic",
      color: "#888",
    },
    snackbarSuccess: {
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "10px",
      borderRadius: "5px",
      position: "fixed",
      bottom: "10px",
      right: "10px",
      display: "flex",
      alignItems: "center",
    },
    snackbarError: {
      backgroundColor: "#F44336",
      color: "white",
      padding: "10px",
      borderRadius: "5px",
      position: "fixed",
      bottom: "10px",
      right: "10px",
      display: "flex",
      alignItems: "center",
    },
    closeButton: {
      background: "none",
      border: "none",
      color: "white",
      fontSize: "16px",
      marginLeft: "10px",
      cursor: "pointer",
    },
  };
  
  export default SaveRobotDetails;
  