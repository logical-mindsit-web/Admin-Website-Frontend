import React, { useState, useEffect } from "react";
import axios from "../utils/api";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";
import "./loadingStyles.css";

const AdminDetails = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmployeeId, setNewEmployeeId] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newRole, setNewRole] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/admin-details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdmins(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching admin details");
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const deleteAdmin = async (email) => {
    const confirmed = window.confirm(
      "You need to delete the admin. Are you sure?"
    );
    if (confirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete("/admin-details/delete", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { email },
        });
        setAdmins(admins.filter((admin) => admin.email !== email));
        setSnackbarMessage("Admin user deleted successfully");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error deleting admin:", error);
        setError("Error deleting admin");
      }
    }
  };

  const validateFields = () => {
    const errors = {};

    if (!newEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = "Invalid email format";
    }

    if (!newName.match(/^[a-zA-Z\s]+$/)) {
      errors.name = "Name can only contain letters and spaces";
    }

    if (!newEmployeeId.match(/^[a-zA-Z0-9]+$/)) {
      errors.employeeId =
        "Employee ID can only contain alphanumeric characters";
    }

    if (!newPhoneNumber.match(/^\d{10}$/)) {
      errors.phoneNumber = "Invalid phone number format";
    }

    return errors;
  };

  const handleUpdateDetails = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    if (
      !selectedAdmin ||
      !newEmail ||
      !newName ||
      !newEmployeeId ||
      !newRole ||
      !newPhoneNumber
    )
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/admin-details/update`,
        {
          oldEmail: selectedAdmin.email,
          newEmail,
          newName,
          newEmployeeId,
          newPhoneNumber,
          newRole, // Include newRole in the update request
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAdmins(
        admins.map((admin) =>
          admin.email === selectedAdmin.email
            ? {
                ...admin,
                email: newEmail,
                name: newName,
                employeeId: newEmployeeId,
                phoneNumber: newPhoneNumber,
                role: newRole,
              }
            : admin
        )
      );
      setOpenDialog(false);
      setSelectedAdmin(null);
      setNewEmail("");
      setNewName("");
      setNewEmployeeId("");
      setNewPhoneNumber("");
      setNewRole(""); // Reset role
      setFormErrors({});
    } catch (err) {
      console.error("Error updating admin details:", err);
      setError("Failed to update admin details");
    }
  };

  const openUpdateDialog = (admin) => {
    setSelectedAdmin(admin);
    setNewEmail(admin.email);
    setNewName(admin.name);
    setNewEmployeeId(admin.employeeId);
    setNewPhoneNumber(admin.phoneNumber);
    setNewRole(admin.role);
    setOpenDialog(true);
  };

  const closeUpdateDialog = () => {
    setOpenDialog(false);
    setSelectedAdmin(null);
    setNewEmail("");
    setNewName("");
    setNewEmployeeId("");
    setNewPhoneNumber("");
    setNewRole("");
    setFormErrors({});
  };

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

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" component="h2">
        Admin User's
      </Typography>
      <Grid container spacing={3} style={{ marginTop: "20px" }}>
        {admins.map((admin) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={admin.id}>
            <Card>
              <CardContent>
                <Typography
                  variant="subtitle2"
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {admin.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Name: {admin.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Employee ID: {admin.employeeId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Role: {admin.role}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  PhoneNumber: {admin.phoneNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ManualMapping: {admin.manualMapping}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ObjectDisinfection: {admin.objectDisinfection}
                </Typography>
              </CardContent>

              <Button
                variant="contained"
                color="primary"
                size="small"
                style={{ margin: "8px" }}
                onClick={() => openUpdateDialog(admin)}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                style={{ margin: "8px" }}
                onClick={() => deleteAdmin(admin.email)}
              >
                Delete
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={closeUpdateDialog}>
        <DialogTitle>Update Admin Details</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Email"
            type="email"
            fullWidth
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
          <TextField
            margin="dense"
            label="New Name"
            type="text"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            error={!!formErrors.name}
            helperText={formErrors.name}
          />
          <TextField
            margin="dense"
            label="New Employee ID"
            type="text"
            fullWidth
            value={newEmployeeId}
            onChange={(e) => setNewEmployeeId(e.target.value)}
            error={!!formErrors.employeeId}
            helperText={formErrors.employeeId}
          />
          <TextField
            margin="dense"
            label="New Phone Number"
            type="text"
            fullWidth
            value={newPhoneNumber}
            onChange={(e) => setNewPhoneNumber(e.target.value)}
            error={!!formErrors.phoneNumber}
            helperText={formErrors.phoneNumber}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>New Role</InputLabel>
            <Select
              label="New Role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              required
              error={!!formErrors.role}
            >
              <MenuItem value="Hr">HR</MenuItem>
              <MenuItem value="ProjectManager">Project Manager</MenuItem>
              <MenuItem value="AdminController">Admin Controller</MenuItem>
            </Select>
            {formErrors.role && (
              <Typography color="error">{formErrors.role}</Typography>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUpdateDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateDetails} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminDetails;
