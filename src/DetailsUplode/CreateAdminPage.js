import React, { useState } from "react";
import axios from "../utils/api";
import { useNavigate } from "react-router-dom";

const CreateAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateFields = () => {
    const errors = {};

    if (!name.match(/^[a-zA-Z\s]+$/)) {
      errors.name = "Name can only contain letters and spaces";
    }

    if (!employeeId.match(/^[a-zA-Z0-9]+$/)) {
      errors.employeeId =
        "Employee ID can only contain alphanumeric characters";
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = "Invalid email format";
    }

    if (!phoneNumber.match(/^\d{10}$/)) {
      errors.phoneNumber = "Valid phone number is required (10 digits)";
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateFields();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "/register-admin",
        {
          email,
          password,
          name,
          employeeId,
          phoneNumber,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSnackbarMessage(response.data.message);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setEmail("");
      setPassword("");
      setName("");
      setEmployeeId("");
      setPhoneNumber("");
      setRole("");
      setErrors({});
      setTimeout(() => {
        navigate("/admin-user");
      }, 3000);
    } catch (error) {
      setSnackbarMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Create Admin</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "8px", boxSizing: "border-box" }}
          />
          <div style={{ color: "red", fontSize: "12px" }}>{errors.name}</div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>Employee ID</label>
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "8px", boxSizing: "border-box" }}
          />
          <div style={{ color: "red", fontSize: "12px" }}>{errors.employeeId}</div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "8px", boxSizing: "border-box" }}
          />
          <div style={{ color: "red", fontSize: "12px" }}>{errors.email}</div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "8px", boxSizing: "border-box" }}
          />
          <div style={{ color: "red", fontSize: "12px" }}>{errors.phoneNumber}</div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "8px", boxSizing: "border-box",borderRadius: "5px", }}
          >
            <option value="">Select Role</option>
            <option value="Hr">HR</option>
            <option value="ProjectManager">Project Manager</option>
            <option value="AdminController">Admin Controller</option>
          </select>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <label>Password</label>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "5px",
                width: "350px",
              }}
            />
            <button
              type="button"
              onClick={handleClickShowPassword}
              style={{
                padding: "10px",
                backgroundColor: "#4CAF50",
                color: "white",
                borderRadius: "5px",
                border: "none",
              }}
            >
              {showPassword ? "Hide" : "Show"} Password
            </button>
            <div style={{ color: "red", fontSize: "12px" }}>
            {password.length > 0 && password.length < 8 && "Password must be at least 8 characters"}
          </div>
          </div>
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            marginTop: "20px",
            borderRadius: "5px",
          }}
        >
          Register
        </button>
      </form>

      {snackbarOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "16px",
            right: "16px",
            backgroundColor: snackbarSeverity === "success" ? "green" : "red",
            color: "white",
            padding: "10px",
            borderRadius: "4px",
          }}
        >
          {snackbarMessage}
        </div>
      )}
    </div>
  );
};

export default CreateAdmin;