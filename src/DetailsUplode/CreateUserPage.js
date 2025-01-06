import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/api";

export default function CreateUser(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [IPAddress, setIPAddress] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [primaryContactName, setPrimaryContactName] = useState("");
  const [primaryContactEmail, setPrimaryContactEmail] = useState("");
  const [primaryContactPhoneNumber, setPrimaryContactPhoneNumber] = useState("");
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
    newLocations[locationIndex].subLocations[subLocationIndex][event.target.name] = event.target.value;
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

  const removeLocation = (index) => {
    const newLocations = locations.filter((_, locIndex) => locIndex !== index);
    setLocations(newLocations);
  };

  const removeSubLocation = (locationIndex, subLocationIndex) => {
    const newLocations = [...locations];
    newLocations[locationIndex].subLocations = newLocations[locationIndex].subLocations.filter((_, subIndex) => subIndex !== subLocationIndex);
    setLocations(newLocations);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Valid email is required";
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) newErrors.phoneNumber = "Valid phone number is required (10 digits)";
    if (!IPAddress) newErrors.IPAddress = "IP Address is required";
    if (!organizationName) newErrors.organizationName = "Organization name is required";
    if (!password || password.length < 8) newErrors.password = "Password must be at least 8 characters long";
    if (!primaryContactName) newErrors.primaryContactName = "Primary contact name is required";
    if (!primaryContactEmail || !/\S+@\S+\.\S+/.test(primaryContactEmail)) newErrors.primaryContactEmail = "Valid primary contact email is required";
    else if (email === primaryContactEmail) newErrors.primaryContactEmail = "Primary contact email must be different from the email";
    if (!primaryContactPhoneNumber || !/^\d{10}$/.test(primaryContactPhoneNumber)) newErrors.primaryContactPhoneNumber = "Valid primary contact phone number is required (10 digits)";
    else if (phoneNumber === primaryContactPhoneNumber) newErrors.primaryContactPhoneNumber = "Primary contact Number must be different from the PhoneNumber";
    locations.forEach((location, index) => {
      if (!location.name) newErrors[`locationName${index}`] = `Location ${index + 1} name is required`;
      if (!location.address.street) newErrors[`locationAddressStreet${index}`] = `Location ${index + 1} street address is required`;
      if (!location.address.town) newErrors[`locationAddressTown${index}`] = `Location ${index + 1} town address is required`;
      if (!location.address.city) newErrors[`locationAddressCity${index}`] = `Location ${index + 1} city address is required`;
      if (!location.address.state) newErrors[`locationAddressState${index}`] = `Location ${index + 1} state address is required`;
      if (!location.address.pinCode) newErrors[`locationAddressPinCode${index}`] = `Location ${index + 1} pin code is required`;
      location.subLocations.forEach((subLocation, subIndex) => {
        if (!subLocation.name) newErrors[`subLocationName${index}-${subIndex}`] = `Sub-Location ${subIndex + 1} name is required`;
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
      setEmail("");
      setPassword("");
      setName("");
      setPhoneNumber("");
      setIPAddress("");
      setOrganizationName("");
      setPrimaryContactName("");
      setPrimaryContactEmail("");
      setPrimaryContactPhoneNumber("");
      setLocations([{
        name: "",
        address: { street: "", town: "", city: "", state: "", pinCode: "" },
        subLocations: [{ name: "" }],
      }]);
      setTimeout(() => {
        navigate("/card");
      }, 3000);
    } catch (error) {
      console.error(error);
      setMessage("An error occurred during registration");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{color:"black"}}>Create User</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "10px", margin: "5px 0", borderRadius: "5px" }}
          />
          {errors.name && <span style={{ color: "red", fontSize: "12px" }}>{errors.name}</span>}
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "10px", margin: "5px 0", borderRadius: "5px" }}
          />
          {errors.email && <span style={{ color: "red", fontSize: "12px" }}>{errors.email}</span>}
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{ width: "100%", padding: "10px", margin: "5px 0", borderRadius: "5px" }}
          />
          {errors.phoneNumber && <span style={{ color: "red", fontSize: "12px" }}>{errors.phoneNumber}</span>}
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>IP Address</label>
          <input
            type="text"
            value={IPAddress}
            onChange={(e) => setIPAddress(e.target.value)}
            style={{ width: "100%", padding: "10px", margin: "5px 0", borderRadius: "5px" }}
          />
          {errors.IPAddress && <span style={{ color: "red", fontSize: "12px" }}>{errors.IPAddress}</span>}
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Organization Name</label>
          <input
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            style={{ width: "100%", padding: "10px", margin: "5px 0", borderRadius: "5px" }}
          />
          {errors.organizationName && <span style={{ color: "red", fontSize: "12px" }}>{errors.organizationName}</span>}
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", margin: "5px 0", borderRadius: "5px" }}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ marginTop: "5px" }}>
            {showPassword ? "Hide" : "Show"} Password
          </button>
          {errors.password && <span style={{ color: "red", fontSize: "12px" }}>{errors.password}</span>}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h3>Primary Contact</h3>
          <div style={{ marginBottom: "10px" }}>
            <label>Contact Name</label>
            <input
              type="text"
              value={primaryContactName}
              onChange={(e) => setPrimaryContactName(e.target.value)}
              style={{ width: "100%", padding: "10px", margin: "5px 0", borderRadius: "5px" }}
            />
            {errors.primaryContactName && <span style={{ color: "red", fontSize: "12px" }}>{errors.primaryContactName}</span>}
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Contact Email</label>
            <input
              type="email"
              value={primaryContactEmail}
              onChange={(e) => setPrimaryContactEmail(e.target.value)}
              style={{ width: "100%", padding: "10px", margin: "5px 0", borderRadius: "5px" }}
            />
            {errors.primaryContactEmail && <span style={{ color: "red", fontSize: "12px" }}>{errors.primaryContactEmail}</span>}
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Contact Phone Number</label>
            <input
              type="text"
              value={primaryContactPhoneNumber}
              onChange={(e) => setPrimaryContactPhoneNumber(e.target.value)}
              style={{ width: "100%", padding: "10px", margin: "5px 0", borderRadius: "5px" }}
            />
            {errors.primaryContactPhoneNumber && <span style={{ color: "red", fontSize: "12px" }}>{errors.primaryContactPhoneNumber}</span>}
          </div>
        </div>

        <h3>Locations</h3>
        {locations.map((location, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <div style={{ marginBottom: "10px" }}>
              <label>Location Name</label>
              <input
                type="text"
                name="name"
                value={location.name}
                onChange={(e) => handleLocationChange(index, e)}
                style={{ width: "100%", padding: "10px", margin: "5px 0", borderRadius: "5px" }}
              />
              {errors[`locationName${index}`] && <span style={{ color: "red", fontSize: "12px" }}>{errors[`locationName${index}`]}</span>}
            </div>

            <h4>Address</h4>
            {["street", "town", "city", "state", "pinCode"].map((field) => (
              <div style={{ marginBottom: "10px" }} key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type="text"
                  name={field}
                  value={location.address[field]}
                  onChange={(e) => handleAddressChange(index, e)}
                  style={{ width: "100%", padding: "10px", margin: "5px 0", borderRadius: "5px" }}
                />
                {errors[`locationAddress${field}${index}`] && <span style={{ color: "red", fontSize: "12px" }}>{errors[`locationAddress${field}${index}`]}</span>}
              </div>
            ))}

            <h4>Sub-Locations</h4>
            {location.subLocations.map((subLocation, subIndex) => (
              <div key={subIndex} style={{ marginBottom: "10px" }}>
                <label>Sub-Location Name {subIndex + 1}</label>
                <input
                  type="text"
                  name="name"
                  value={subLocation.name}
                  onChange={(e) => handleSubLocationChange(index, subIndex, e)}
                  style={{ width: "100%", padding: "10px", margin: "5px 0", borderRadius: "5px" }}
                />
                {subIndex > 0 && (
                  <button type="button" onClick={() => removeSubLocation(index, subIndex)} style={{ padding: "10px 20px", backgroundColor: "#F8F8FF", color: "red", borderRadius: "5px", border: "black" }}>
                    Remove Sub-Location
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addSubLocation(index)}  style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", borderRadius: "5px", border: "none" }}>
              Add Sub-Location
            </button>

            {locations.length > 1 && (
              <button type="button" onClick={() => removeLocation(index)} style={{ padding: "10px 20px", backgroundColor: "#F8F8FF", color: "red", borderRadius: "5px", border: "black",marginLeft: "8px" }}>
                Remove Location
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addLocation} style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", borderRadius: "5px", border: "none" }}>
          Add Location
        </button>

        <div style={{ marginTop: "20px" }}>
          <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", borderRadius: "5px", border: "none" }}>
            Register
          </button>
        </div>
      </form>

      {snackbarOpen && (
        <div style={{ position: "fixed", bottom: "20px", right: "20px", backgroundColor: "green", color: "white", padding: "10px", borderRadius: "5px" }}  onClick={handleCloseSnackbar}>
          {message}
        </div>
      )}
    </div>
  );
};