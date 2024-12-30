import React, { useState, useEffect } from "react";
import axios from '../../utils/api';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./loadingStyles.css";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/user-details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (email) => {
    const confirmed = window.confirm(
      "You need to delete the user. Are you sure?"
    );
    if (confirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/user-details/delete`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { email },
        });
        setUsers(users.filter((user) => user.email !== email));
        setSnackbarMessage("User deleted successfully!"); // Set success message
        setSnackbarOpen(true); // Open Snackbar
      } catch (err) {
        console.error("Error deleting user:", err);
        setError("Failed to delete user");
      }
    }
  };

  const handleUpdateEmail = async () => {
    if (!selectedUser || !newEmail) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation regex
    if (!emailRegex.test(newEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/user-details/update`,
        {
          oldEmail: selectedUser.email,
          newEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(
        users.map((user) =>
          user.email === selectedUser.email
            ? { ...user, email: newEmail }
            : user
        )
      );
      setOpenDialog(false);
      setSelectedUser(null);
      setNewEmail("");
      setEmailError("");
    } catch (err) {
      console.error("Error updating user email:", err);
      setError("Failed to update user email");
    }
  };

  const openUpdateDialog = (user) => {
    setSelectedUser(user);
    setNewEmail(user.email);
    setOpenDialog(true);
  };

  const closeUpdateDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setNewEmail("");
    setEmailError(""); 
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

  const encodeEmail = (email) => {
    return encodeURIComponent(btoa(email)); // Base64 encode the email
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" component="h1" align="center">
        User's List
      </Typography>
      <Grid container spacing={3} style={{ marginTop: "20px" }}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={user._id}>
            <Card onDoubleClick={() => navigate(`/user-details/${encodeEmail(user.email)}`)} style={{ cursor: 'pointer' }}>
              <CardContent>
                <Typography style={{ fontSize: "0.9rem", marginBottom: "4px" }}>
                  <strong>UserName:</strong>{user.name || "N/A"}
                </Typography>
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
                  {user.email}
                </Typography>
                <Typography variant="body2" color="black">
                  IP Address:{user.IPAddress || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Is First Time: {user.isFirstTime ? "Yes" : "No"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Created At: {new Date(user.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Updated At: {new Date(user.updatedAt).toLocaleString()}
                </Typography>
              </CardContent>
              <Button
                variant="contained"
                color="primary"
                size="small"
                style={{ margin: "8px" }}
                onClick={() => openUpdateDialog(user)}
              >
                Email Update
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                style={{ margin: "8px" }}
                onClick={() => deleteUser(user.email)}
              >
                Delete
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={closeUpdateDialog}>
        <DialogTitle>Update User Email</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Email"
            type="email"
            fullWidth
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
              setEmailError(""); // Clear error message on input change
            }}
            error={!!emailError} // Display red border if there's an error
            helperText={emailError} // Display error message below the text field
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUpdateDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateEmail} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Positioning the Snackbar
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UsersList;
