import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Container,
  CircularProgress
} from "@mui/material";
import axios from "../../utils/api"; 

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
      const response = await axios.put("/update-versions", { version }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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
    <Container>
      <Typography variant="h5" gutterBottom>
        Update App Version
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        Enter the new version number:
      </Typography>
      <TextField
        autoFocus
        margin="dense"
        label="Version"
        type="text"
        placeholder="0.0.0"
        fullWidth
        variant="outlined"
        value={version}
        onChange={handleVersionChange}
      />
      {loading && <CircularProgress />}
      {successMessage && <Typography color="success.main">{successMessage}</Typography>}
      {errorMessage && <Typography color="error.main">{errorMessage}</Typography>}
      <Box sx={{ marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateVersion}
          disabled={loading} // Disable button while loading
        >
          Update
        </Button>
      </Box>
    </Container>
  );
};

export default UpdateVersionButton;
