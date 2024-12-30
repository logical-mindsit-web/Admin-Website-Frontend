import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Paper,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "../../utils/api";
import { useParams } from "react-router-dom";

const RobotVersionList2 = () => {
  const { emailId } = useParams();
  const [appDetails, setAppDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [manualMapping, setManualMapping] = useState("");
  const [objectDisinfection, setObjectDisinfection] = useState("");

  const decodeEmail = (encodedEmail) => {
    return atob(decodeURIComponent(encodedEmail));
  };

  useEffect(() => {
    const fetchAppDetails = async () => {
      try {
        const decodedEmail = decodeEmail(emailId);
        const response = await axios.get(`/appdetails/${decodedEmail}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAppDetails(response.data);
        // Initialize state with current values
        setManualMapping(response.data.user.manualMapping);
        setObjectDisinfection(response.data.user.objectDisinfection);
      } catch (error) {
        console.error("Error fetching robot details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppDetails();
  }, [emailId]);

  const handleUpdate = async () => {
    try {
      const decodedEmail = decodeEmail(emailId);
      await axios.put(`/update-appdetails/${decodedEmail}`, {
        manualMapping,
        objectDisinfection,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Optionally, fetch updated app details
      const response = await axios.get(`/appdetails/${decodedEmail}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAppDetails(response.data);
      handleCloseDialog(); // Close the dialog after successful update
    } catch (error) {
      console.error("Error updating user settings:", error);
    }
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
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

  if (!appDetails) {
    return <div>No robot details found</div>;
  }

  return (
    <Box sx={{ padding: 3, marginTop: 3 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{ marginBottom: 3, fontWeight: "bold", color: "#333" }}
        >
          Robot Metadata Details
        </Typography>
        <Card sx={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)", backgroundColor: "#e0f7fa" }}>
          <CardContent>
            <Typography variant="body1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
              Email ID: {appDetails.user.email}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
              Version: {appDetails.version}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
              Manual Mapping: {appDetails.user.manualMapping}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
              Object Disinfection: {appDetails.user.objectDisinfection}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
              Update
            </Button>
          </CardContent>
        </Card>
      </Paper>

      {/* Dialog for updating settings */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Update Robot Settings</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel id="manual-mapping-label">Manual Mapping</InputLabel>
            <Select
              labelId="manual-mapping-label"
              value={manualMapping}
              onChange={(e) => setManualMapping(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="enabled">Enabled</MenuItem>
              <MenuItem value="disabled">Disabled</MenuItem>
              {/* Add more options as needed */}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel id="object-disinfection-label">Object Disinfection</InputLabel>
            <Select
              labelId="object-disinfection-label"
              value={objectDisinfection}
              onChange={(e) => setObjectDisinfection(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="enabled">Enabled</MenuItem>
              <MenuItem value="disabled">Disabled</MenuItem>
              {/* Add more options as needed */}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RobotVersionList2;
