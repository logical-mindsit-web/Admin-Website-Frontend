import React, { useState } from "react";
import axios from "../utils/api";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [IPAddress, setIPAddress] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [primaryContactName, setPrimaryContactName] = useState("");
  const [primaryContactEmail, setPrimaryContactEmail] = useState("");
  const [primaryContactPhoneNumber, setPrimaryContactPhoneNumber] =
    useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [locations, setLocations] = useState([
    {
      name: "",
      address: { street: "", town: "", city: "", state: "", pinCode: "" },
      subLocations: [{ name: "" }],
    },
  ]);
  const navigate = useNavigate();

  const handleLocationChange = (index, event) => {
    const newLocations = [...locations];
    newLocations[index][event.target.name] = event.target.value;
    setLocations(newLocations);
  };

  const handleAddressChange = (index, event) => {
    const newLocations = [...locations];
    newLocations[index].address[event.target.name] = event.target.value;
    setLocations(newLocations);
  };

  const handleSubLocationChange = (locationIndex, subLocationIndex, event) => {
    const newLocations = [...locations];
    newLocations[locationIndex].subLocations[subLocationIndex][
      event.target.name
    ] = event.target.value;
    setLocations(newLocations);
  };

  const addLocation = () => {
    setLocations([
      ...locations,
      {
        name: "",
        address: { street: "", town: "", city: "", state: "", pinCode: "" },
        subLocations: [{ name: "" }],
      },
    ]);
  };

  const addSubLocation = (locationIndex) => {
    const newLocations = [...locations];
    newLocations[locationIndex].subLocations.push({ name: "" });
    setLocations(newLocations);
  };

  // Function to remove a specific location
  const removeLocation = (index) => {
    const newLocations = locations.filter((_, locIndex) => locIndex !== index);
    setLocations(newLocations);
  };

  // Function to remove a specific sub-location
  const removeSubLocation = (locationIndex, subLocationIndex) => {
    const newLocations = [...locations];
    newLocations[locationIndex].subLocations = newLocations[
      locationIndex
    ].subLocations.filter((_, subIndex) => subIndex !== subLocationIndex);
    setLocations(newLocations);
  };

  const validateFields = () => {
    const newErrors = {};
    // Existing validations
    if (!name) newErrors.name = "Name is required";

    // Email validations
    if (!email || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Valid email is required";

    // Phone number validations
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber))
      newErrors.phoneNumber = "Valid phone number is required (10 digits)";

    // Location validations
    if (!IPAddress) newErrors.IPAddress = "IP Address is required";

    // OrganizationName validations
    if (!organizationName)
      newErrors.organizationName = "Organization name is required";

    // password
    if (!password || password.length < 8)
      newErrors.password = "Password must be at least 8 characters long";

    // primaryContactName
    if (!primaryContactName)
      newErrors.primaryContactName = "Primary contact name is required";

    // primaryContactEmail
    if (!primaryContactEmail || !/\S+@\S+\.\S+/.test(primaryContactEmail)) {
      newErrors.primaryContactEmail = "Valid primary contact email is required";
    } else if (email === primaryContactEmail) {
      newErrors.primaryContactEmail =
        "Primary contact email must be different from the email";
    }

    // primaryContactPhoneNumber
    if (
      !primaryContactPhoneNumber ||
      !/^\d{10}$/.test(primaryContactPhoneNumber)
    ) {
      newErrors.primaryContactPhoneNumber =
        "Valid primary contact phone number is required (10 digits)";
    } else if (phoneNumber === primaryContactPhoneNumber) {
      newErrors.primaryContactPhoneNumber =
        "Primary contact Number must be different from the PhoneNumber";
    }

    // Validate locations and sub-locations
    locations.forEach((location, index) => {
      if (!location.name)
        newErrors[`locationName${index}`] = `Location ${
          index + 1
        } name is required`;
      if (!location.address.street)
        newErrors[`locationAddressStreet${index}`] = `Location ${
          index + 1
        } street address is required`;
      if (!location.address.town)
        newErrors[`locationAddressTown${index}`] = `Location ${
          index + 1
        } town address is required`;
      if (!location.address.city)
        newErrors[`locationAddressCity${index}`] = `Location ${
          index + 1
        } city address is required`;
      if (!location.address.state)
        newErrors[`locationAddressState${index}`] = `Location ${
          index + 1
        } state address is required`;
      if (!location.address.pinCode)
        newErrors[`locationAddressPinCode${index}`] = `Location ${
          index + 1
        } pin code is required`;

      location.subLocations.forEach((subLocation, subIndex) => {
        if (!subLocation.name)
          newErrors[`subLocationName${index}-${subIndex}`] = `Sub-Location ${
            subIndex + 1
          } name is required`;
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateFields()) return;

    try {
      const response = await axios.post("/register-user", {
        name,
        email,
        phoneNumber,
        IPAddress,
        organizationName,
        password,
        primaryContact: {
          name: primaryContactName,
          email: primaryContactEmail,
          phoneNumber: primaryContactPhoneNumber,
        },
        locations,
      });
      setMessage(response.data.message);
      setSnackbarOpen(true);
      // Reset fields
      setEmail("");
      setPassword("");
      setName("");
      setPhoneNumber("");
      setIPAddress("");
      setOrganizationName("");
      setPrimaryContactName("");
      setPrimaryContactEmail("");
      setPrimaryContactPhoneNumber("");
      setLocations([
        {
          name: "",
          address: { street: "", town: "", city: "", state: "", pinCode: "" },
          subLocations: [{ name: "" }],
        },
      ]);
      // Navigate to home page after successful registration
      setTimeout(() => {
        navigate("/card");
      }, 3000);
    } catch (error) {
      console.error(error);
      setMessage("An error occurred during registration");
      setSnackbarOpen(true);
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <Typography variant="h4" component="h1">
        Create User
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone Number"
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber}
          fullWidth
          margin="normal"
        />
        <TextField
          label="IP Address"
          type="text"
          value={IPAddress}
          onChange={(e) => setIPAddress(e.target.value)}
          error={!!errors.IPAddress}
          helperText={errors.IPAddress}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Organization Name"
          type="text"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          error={!!errors.organizationName}
          helperText={errors.organizationName}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Typography variant="h6" component="h2">
          Primary Contact
        </Typography>
        <TextField
          label="Contact Name"
          type="text"
          value={primaryContactName}
          onChange={(e) => setPrimaryContactName(e.target.value)}
          error={!!errors.primaryContactName}
          helperText={errors.primaryContactName}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Contact Email"
          type="email"
          value={primaryContactEmail}
          onChange={(e) => setPrimaryContactEmail(e.target.value)}
          error={!!errors.primaryContactEmail}
          helperText={errors.primaryContactEmail}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Contact Phone Number"
          type="text"
          value={primaryContactPhoneNumber}
          onChange={(e) => setPrimaryContactPhoneNumber(e.target.value)}
          error={!!errors.primaryContactPhoneNumber}
          helperText={errors.primaryContactPhoneNumber}
          fullWidth
          margin="normal"
        />

        <Typography variant="h6" component="h2">
          Locations
        </Typography>
        {locations.map((location, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <TextField
              label="Location Name"
              type="text"
              name="name"
              value={location.name}
              onChange={(e) => handleLocationChange(index, e)}
              error={!!errors[`locationName${index}`]}
              helperText={errors[`locationName${index}`]}
              fullWidth
              margin="normal"
            />
            <Typography variant="subtitle1">Address</Typography>
            <TextField
              label="Street"
              type="text"
              name="street"
              value={location.address.street}
              onChange={(e) => handleAddressChange(index, e)}
              error={!!errors[`locationAddressStreet${index}`]}
              helperText={errors[`locationAddressStreet${index}`]}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Town"
              type="text"
              name="town"
              value={location.address.town}
              onChange={(e) => handleAddressChange(index, e)}
              error={!!errors[`locationAddressTown${index}`]}
              helperText={errors[`locationAddressTown${index}`]}
              fullWidth
              margin="normal"
            />
            <TextField
              label="City"
              type="text"
              name="city"
              value={location.address.city}
              onChange={(e) => handleAddressChange(index, e)}
              error={!!errors[`locationAddressCity${index}`]}
              helperText={errors[`locationAddressCity${index}`]}
              fullWidth
              margin="normal"
            />
            <TextField
              label="State"
              type="text"
              name="state"
              value={location.address.state}
              onChange={(e) => handleAddressChange(index, e)}
              error={!!errors[`locationAddressState${index}`]}
              helperText={errors[`locationAddressState${index}`]}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Pin Code"
              type="text"
              name="pinCode"
              value={location.address.pinCode}
              onChange={(e) => handleAddressChange(index, e)}
              error={!!errors[`locationAddressPinCode${index}`]}
              helperText={errors[`locationAddressPinCode${index}`]}
              fullWidth
              margin="normal"
            />

            <Typography variant="subtitle1">Sub-Locations</Typography>
            {location.subLocations.map((subLocation, subIndex) => (
              <div key={subIndex} style={{ marginBottom: "10px" }}>
                <TextField
                  label={`Sub-Location Name ${subIndex + 1}`}
                  type="text"
                  name="name"
                  value={subLocation.name}
                  onChange={(e) => handleSubLocationChange(index, subIndex, e)}
                  error={!!errors[`subLocationName${index}-${subIndex}`]}
                  helperText={errors[`subLocationName${index}-${subIndex}`]}
                  fullWidth
                  margin="normal"
                />
                {subIndex > 0 && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => removeSubLocation(index, subIndex)}
                    style={{ marginTop: "16px" }}
                  >
                    Remove Sub-Location
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="contained"
              onClick={() => addSubLocation(index)}
              style={{ marginTop: "8px" }}
            >
              Add Sub-Location
            </Button>
            <div>
              {locations.length > 1 && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => removeLocation(index)}
                  style={{ marginTop: "16px" }}
                >
                  Remove Location
                </Button>
              )}
            </div>
          </div>
        ))}
        <Button variant="contained" onClick={addLocation}>
          Add Location
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "16px" }}
        >
          Register
        </Button>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CreateUser;
