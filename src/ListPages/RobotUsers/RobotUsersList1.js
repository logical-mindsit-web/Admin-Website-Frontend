import React, { useEffect, useState } from "react";
import axios from '../../utils/api';
import { Card, CardContent, Typography, Grid, Paper, Box,IconButton} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import "./loadingStyles.css";

const UserList = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get("/user-emails", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEmails(response.data);
      } catch (error) {
        console.error("Error fetching emails:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  const encodeEmail = (email) => {
    return encodeURIComponent(btoa(email)); // Base64 encode the email
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

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f5f5f5", minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, backgroundColor: "#fff", boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <Box
        display="flex"
        alignItems="center"
        gap={1}
        style={{ marginBottom: "16px" }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "#333" }}>
        Select a User to View Their Robots
        </Typography>
      </Box>
        <Grid container spacing={3}>
          {emails.map((email, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card
                onClick={() => navigate(`/robots/${encodeEmail(email)}`)}
                sx={{ cursor: "pointer", transition: 'transform 0.3s ease', "&:hover": { transform: 'scale(1.03)', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' } }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      color: "#555",
                    }}
                  >
                    {email}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserList;
