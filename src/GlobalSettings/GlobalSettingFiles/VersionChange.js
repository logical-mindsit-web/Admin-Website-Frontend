import React, { useState } from "react";
import axios from "../../utils/api"; // Assuming this is your custom axios instance

const UpdateVersionButton = () => {
  const [version, setVersion] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleVersionChange = (e) => {
    setVersion(e.target.value);
  };

  const handleUpdateVersion = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        "/update-versions",
        { version },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Version updated successfully:", response.data);
      setSuccessMessage("Version updated successfully!");
      setVersion(""); // Clear the input after successful update
      setErrorMessage(""); // Clear any previous error messages
    } catch (error) {
      console.error("Error updating version:", error);
      setErrorMessage("Error updating version. Please try again."); // Set error message
      setSuccessMessage(""); // Clear any previous success messages
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Update App Version</h2>
      <p style={styles.text}>Enter the new version number:</p>
      <input
        style={styles.input}
        type="text"
        placeholder="0.0.0"
        value={version}
        onChange={handleVersionChange}
      />
      {loading && <div style={styles.circularProgress}></div>}
      {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
      {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
      <button
        style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
        onClick={handleUpdateVersion}
        disabled={loading}
      >
        Update
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "0 auto",
    marginTop: "10px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
    fontFamily: "Roboto, Arial, sans-serif",
  },
  heading: {
    fontSize: "1.5rem",
    marginBottom: "10px",
    textAlign: "center",
    color: "#333",
  },
  text: {
    marginBottom: "10px",
    fontSize: "1rem",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "1rem",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
    transition: "border-color 0.3s",
  },
  inputFocus: {
    borderColor: "#3f51b5",
  },
  circularProgress: {
    margin: "10px auto",
    width: "20px",
    height: "20px",
    border: "3px solid #3f51b5",
    borderTop: "3px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  successMessage: {
    color: "green",
    fontSize: "0.9rem",
    marginBottom: "10px",
  },
  errorMessage: {
    color: "red",
    fontSize: "0.9rem",
    marginBottom: "10px",
  },
  button: {
    width: "100%",
    padding: "10px",
    fontSize: "1rem",
    backgroundColor: "#3f51b5",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonDisabled: {
    backgroundColor: "#a9a9a9",
    cursor: "not-allowed",
  },
};

export default UpdateVersionButton;
