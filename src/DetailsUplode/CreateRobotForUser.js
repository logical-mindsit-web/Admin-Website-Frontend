import React, { useState, useEffect } from "react";
import axios from "../utils/api";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert"; // For styled Snackbar

// Custom Alert component for Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
    <Container maxWidth="lg" style={styles.container}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" style={styles.header}>
            Save Robot Details
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
            <Grid item xs={12}>

                <FormControl fullWidth variant="outlined">
                  <InputLabel>Email ID</InputLabel>
                  <Select
                    label="Email ID"
                    name="emailId"
                    value={robotDetails.emailId}
                    onChange={handleChange}
                    error={!!errors.emailId}
                  >
                    {userEmails.map((email) => (
                      <MenuItem key={email} value={email}>
                        {email}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.emailId && (
                    <Typography color="error">{errors.emailId}</Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Robot ID"
                  name="robotId"
                  value={robotDetails.robotId}
                  onChange={handleChange}
                  error={!!errors.robotId}
                  helperText={errors.robotId}
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={robotDetails.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  variant="outlined"
                  required
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              {/* Updated Model Field to Select */}
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Model</InputLabel>
                  <Select
                    label="Model"
                    name="model"
                    value={robotDetails.model}
                    onChange={handleChange}
                    error={!!errors.model}
                  >
                    <MenuItem value="Spotbot-Lite">Spotbot-Lite</MenuItem>
                    <MenuItem value="Spotbot-Xtreme">Spotbot-Xtreme</MenuItem>
                  </Select>
                  {errors.model && (
                    <Typography color="error">{errors.model}</Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Serial Number"
                  name="serialNumber"
                  value={robotDetails.serialNumber}
                  onChange={handleChange}
                  error={!!errors.serialNumber}
                  helperText={errors.serialNumber}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="IP Address"
                  name="IPAddress"
                  value={robotDetails.IPAddress}
                  onChange={handleChange}
                  error={!!errors.IPAddress}
                  helperText={errors.IPAddress}
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12} style={{ display: "none" }}>
                <TextField
                  fullWidth
                  label="Image (Base64)"
                  name="image"
                  value={robotDetails.image}
                  onChange={handleChange}
                  error={!!errors.image}
                  helperText={errors.image}
                  variant="outlined"
                  required
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    name="status"
                    value={robotDetails.status}
                    onChange={handleChange}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Location</InputLabel>
                  <Select
                    label="Location"
                    name="location"
                    value={robotDetails.location}
                    onChange={handleChange}
                    error={!!errors.location}
                  >
                    {Array.isArray(locationNames) &&
                      locationNames.map((location) => (
                        <MenuItem key={location} value={location}>
                          {location}
                        </MenuItem>
                      ))}
                  </Select>
                  {errors.location && (
                    <Typography color="error">{errors.location}</Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Sub-Location</InputLabel>
                  <Select
                    label="Sub-Location"
                    name="subLocation"
                    value={robotDetails.subLocation}
                    onChange={handleChange}
                    error={!!errors.subLocation}
                  >
                    {subLocations.map((subLocation) => (
                      <MenuItem key={subLocation} value={subLocation}>
                        {subLocation}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.subLocation && (
                    <Typography color="error">{errors.subLocation}</Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Robot Initialize Date"
                  name="robotInitializeDate"
                  type="date"
                  value={robotDetails.robotInitializeDate}
                  onChange={handleChange}
                  error={!!errors.robotInitializeDate}
                  helperText={errors.robotInitializeDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Last Maintenance Date"
                  name="lastMaintenanceDate"
                  type="date"
                  value={robotDetails.lastMaintenanceDate}
                  onChange={handleChange}
                  error={!!errors.lastMaintenanceDate}
                  helperText={errors.lastMaintenanceDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Save Robot
                </Button>
              </Grid>
            </Grid>
          </form>

          {/* Snackbar for messages */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert onClose={handleCloseSnackbar} severity="success">
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Grid>

        {/* Right side for the image */}
        <Grid item xs={12} md={6} style={styles.imageContainer}>
          {robotDetails.image && (
            <img
              src={robotDetails.image}
              alt="Model"
              style={styles.robotImage}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

// Styles
const styles = {
  container: {
    padding: "20px",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  robotImage: {
    maxWidth: "100%",
    maxHeight: "400px",
    objectFit: "contain",
  },
};

export default SaveRobotDetails;
