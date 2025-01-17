import React, { useState, useEffect } from "react";
import axios from "../../utils/api";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { FaTrash } from "react-icons/fa";

const UsersDetailsList = () => {
  const { email } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({});
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const decodeEmail = (encodedEmail) => {
    return atob(decodeURIComponent(encodedEmail));
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const decodedEmail = decodeEmail(email);
        const token = localStorage.getItem("token");
        const response = await axios.get(`/user-details/${decodedEmail}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setUpdatedUser({
          ...response.data,
          primaryContact: response.data.primaryContact || {
            name: "",
            email: "",
            phoneNumber: "",
          },
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to fetch user");
        setLoading(false);
      }
    };

    fetchUser();
  }, [email]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrimaryContactChange = (event) => {
    const { name, value } = event.target;
    setUpdatedUser((prev) => ({
      ...prev,
      primaryContact: {
        ...prev.primaryContact,
        [name]: value,
      },
    }));
  };

  const handleLocationChange = (index, event) => {
    const { name, value } = event.target;
    const newLocations = [...updatedUser.locations];
    newLocations[index] = {
      ...newLocations[index],
      [name]: value,
    };
    setUpdatedUser((prev) => ({
      ...prev,
      locations: newLocations,
    }));
  };
  const handleAddressChange = (locationIndex, addressKey, event) => {
    const { value } = event.target;
    const newLocations = [...updatedUser.locations];
    newLocations[locationIndex].address[addressKey] = value;
    setUpdatedUser((prev) => ({
      ...prev,
      locations: newLocations,
    }));
  };
  const handleSubLocationChange = (locationIndex, subLocationIndex, event) => {
    const { value } = event.target;
    const newLocations = [...updatedUser.locations];
    newLocations[locationIndex].subLocations[subLocationIndex] = {
      ...newLocations[locationIndex].subLocations[subLocationIndex],
      name: value,
    };
    setUpdatedUser((prev) => ({
      ...prev,
      locations: newLocations,
    }));
  };

  const handleAddLocation = () => {
    setUpdatedUser((prev) => ({
      ...prev,
      locations: [
        ...prev.locations,
        { 
          name: "", 
          address: { street: "", town: "", city: "", state: "", pinCode: "" }, 
          subLocations: [{ name: "" }]  
        },
      ],
    }));
  };
  

  const handleAddSubLocation = (locationIndex) => {
    const newLocations = [...updatedUser.locations];
    newLocations[locationIndex].subLocations.push({ name: "" });
    setUpdatedUser((prev) => ({
      ...prev,
      locations: newLocations,
    }));
  };

  const handleRemoveSubLocation = (locationIndex, subLocationIndex) => {
  if (subLocationIndex === 0) {
    return;
  }
    const newLocations = [...updatedUser.locations];
    newLocations[locationIndex].subLocations.splice(subLocationIndex, 1);
    setUpdatedUser((prev) => ({
      ...prev,
      locations: newLocations,
    }));
  };

  const handleSubmit = async () => {
    // Basic Validation
    if (!updatedUser.name || !updatedUser.email || !updatedUser.phoneNumber) {
      setSnackbarMessage("Please fill all required fields.");
      setSnackbarOpen(true);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updatedUser.email)) {
      setSnackbarMessage("Please enter a valid email address.");
      setSnackbarOpen(true);
      return;
    }

    // Phone number validation (basic example: check if it's 10 digits)
    const phoneNumberRegex = /^\d{10}$/;
    if (
      updatedUser.phoneNumber &&
      !phoneNumberRegex.test(updatedUser.phoneNumber)
    ) {
      setSnackbarMessage("Please enter a valid phone number.");
      setSnackbarOpen(true);
      return;
    }
    // Validation for Primary Contact
    if (!updatedUser.primaryContact.name) {
      setSnackbarMessage("Please enter a primary contact name.");
      setSnackbarOpen(true);
      return;
    }

    if (!updatedUser.primaryContact.email) {
      setSnackbarMessage("Please enter a primary contact email.");
      setSnackbarOpen(true);
      return;
    }
    if (!emailRegex.test(updatedUser.primaryContact.email)) {
      setSnackbarMessage(
        "Please enter a valid email address for primary contact."
      );
      setSnackbarOpen(true);
      return;
    }

    if (
      updatedUser.primaryContact.phoneNumber &&
      !phoneNumberRegex.test(updatedUser.primaryContact.phoneNumber)
    ) {
      setSnackbarMessage(
        "Please enter a valid phone number for primary contact."
      );
      setSnackbarOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/user/${user._id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOpen(false);
      setSnackbarMessage("User details updated successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating user:", error);
      setSnackbarMessage("Failed to update user details");
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
  if (error) return <p>{error}</p>;

  const styles = {
    container: {
      padding: "20px",
      maxWidth: "990px",
      margin: "0 auto",
    },
    card: {
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      minHeight: "500px",
      width: "100%",
      maxWidth: "900px",
    },
    cardContent: {
      padding: "20px",
    },
    header: {
      marginBottom: "20px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
    },
    sectionHeader: {
      marginTop: "20px",
      textAlign: "left",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end",
      padding: "16px",
    },
  };

  return (
    <Container maxWidth="lg" style={styles.container}>
      <Card style={styles.card}>
        <CardContent style={styles.cardContent}>
          <Typography variant="h4" component="h1" style={styles.header}>
            User Name: {user.name}
          </Typography>
          <div style={styles.grid}>
            <div>
              <Typography
                variant="h6"
                component="h2"
                style={styles.sectionHeader}
              >
                Basic Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {user.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Name: {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phone Number: {user.phoneNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                IPAddress: {user.IPAddress}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Organization Name: {user.organizationName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Is First Time: {user.isFirstTime ? "Yes" : "No"}
              </Typography>
            </div>

            <div>
              <Typography
                variant="h6"
                component="h2"
                style={styles.sectionHeader}
              >
                App Permissions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manual Mapping: {user.manualMapping}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Object Disinfection: {user.objectDisinfection}
              </Typography>
            </div>

            <div>
              <Typography
                variant="h6"
                component="h2"
                style={styles.sectionHeader}
              >
                Locations
              </Typography>
              {user.locations.map((location, index) => (
                <div key={index} style={{ marginBottom: "16px" }}>
                  <Typography variant="body2" color="text.secondary">
                    Location Name: {location.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Street: {location.address.street}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Town: {location.address.town}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    City: {location.address.city}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    State: {location.address.state}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pin Code: {location.address.pinCode}
                  </Typography>
                  <div style={{ marginLeft: "20px" }}>
                    {location.subLocations.map((subLocation, subIndex) => (
                      <Typography
                        key={subIndex}
                        variant="body2"
                        color="text.secondary"
                      >
                        Sub-Location Name: {subLocation.name}
                      </Typography>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Typography
                variant="h6"
                component="h2"
                style={styles.sectionHeader}
              >
                Primary Contact
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Name: {user.primaryContact?.name || "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {user.primaryContact?.email || "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phone Number: {user.primaryContact?.phoneNumber || "N/A"}
              </Typography>
            </div>
          </div>
        </CardContent>
        <div style={styles.buttonContainer}>
          <Button
            onClick={handleOpen}
            variant="contained"
            color="primary"
            size="small"
          >
            Update Details
          </Button>
        </div>
      </Card>

      {/* Update User Details Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ color: '#1976d2' }}>Update User Details</DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: "16px" }}>
            <label>User Name</label>
            <input
              className="input-field"
              type="text"
              placeholder="User Name"
              name="name"
              value={updatedUser.name}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Email</label>
            <input
              className="input-field"
              type="text"
              placeholder="Email"
              name="email"
              value={updatedUser.email}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Phone Number</label>
            <input
              className="input-field"
              type="text"
              placeholder="Phone Number"
              name="phoneNumber"
              value={updatedUser.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>IPAddress</label>
            <input
              className="input-field"
              type="text"
              placeholder="IPAddress"
              name="IPAddress"
              value={updatedUser.IPAddress}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Organization Name</label>
            <input
              className="input-field"
              type="text"
              placeholder="Organization Name"
              name="organizationName"
              value={updatedUser.organizationName}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Primary Contact Name</label>
            <input
              className="input-field"
              type="text"
              placeholder="Primary Contact Name"
              name="name"
              value={updatedUser.primaryContact.name}
              onChange={handlePrimaryContactChange}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Primary Contact Email</label>
            <input
              className="input-field"
              type="email"
              placeholder="Primary Contact Email"
              name="email"
              value={updatedUser.primaryContact.email}
              onChange={handlePrimaryContactChange}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Primary Contact Phone Number</label>
            <input
              className="input-field"
              type="text"
              placeholder="Primary Contact Phone Number"
              name="phoneNumber"
              value={updatedUser.primaryContact.phoneNumber}
              onChange={handlePrimaryContactChange}
            />
          </div>

          {updatedUser.locations &&
            updatedUser.locations.map((location, locationIndex) => (
              <div key={locationIndex} style={{ marginBottom: "16px" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  marginBottom="10px"
                >
                  Location Details
                </Typography>
                <div style={{ marginBottom: "16px" }}>
                  <label>Location Name</label>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="Location Name"
                    name="name"
                    value={location.name}
                    onChange={(e) => handleLocationChange(locationIndex, e)}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label>Street</label>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="Street"
                    name="street"
                    value={location.address.street}
                    onChange={(e) =>
                      handleAddressChange(locationIndex, "street", e)
                    }
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label>Town</label>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="Town"
                    name="town"
                    value={location.address.town}
                    onChange={(e) =>
                      handleAddressChange(locationIndex, "town", e)
                    }
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label>City</label>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="City"
                    name="city"
                    value={location.address.city}
                    onChange={(e) =>
                      handleAddressChange(locationIndex, "city", e)
                    }
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label>State</label>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="State"
                    name="state"
                    value={location.address.state}
                    onChange={(e) =>
                      handleAddressChange(locationIndex, "state", e)
                    }
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label>PinCode</label>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="PinCode"
                    name="pinCode"
                    value={location.address.pinCode}
                    onChange={(e) =>
                      handleAddressChange(locationIndex, "pinCode", e)
                    }
                  />
                </div>

                <div>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    marginBottom="10px"
                  >
                    Sub-Locations:
                  </Typography>
                  <div className="sub-location-text">Sub-Locations:</div>
                  {location.subLocations.map(
                    (subLocation, subLocationIndex) => (
                      <div
                        key={subLocationIndex}
                        style={{
                          position: "relative",
                          width: "100%",
                          marginBottom: "12px",
                        }}
                      >
                        <input
                          style={{
                            width: "100%",
                            padding: "10px",
                            paddingRight: "40px" /* Space for the icon */,
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            fontSize: "16px",
                          }}
                          type="text"
                          placeholder="Sub-location Name"
                          value={subLocation.name}
                          onChange={(e) =>
                            handleSubLocationChange(
                              locationIndex,
                              subLocationIndex,
                              e
                            )
                          }
                        />
                        <button
                          onClick={() =>
                            handleRemoveSubLocation(
                              locationIndex,
                              subLocationIndex
                            )
                          }
                          style={{
                            position: "absolute",
                            top: "50%",
                            right: "10px",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "red",
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )
                  )}

                  <Button
                    onClick={() => handleAddSubLocation(locationIndex)}
                    startIcon={<AddIcon />}
                  >
                    Add Sub-location
                  </Button>
                </div>
              </div>
            ))}
          <Button onClick={handleAddLocation}>Add Location</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={
            snackbarMessage.includes("successfully") ? "success" : "error"
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UsersDetailsList;
