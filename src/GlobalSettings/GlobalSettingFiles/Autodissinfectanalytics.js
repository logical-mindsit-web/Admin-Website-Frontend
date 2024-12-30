import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import axios from "../../utils/api";

const ModeDetails = () => {
  const [modes, setModes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch data from API
  useEffect(() => {
    const fetchModes = async () => {
      try {
        const response = await axios.get("/modes/AutoDisinfection-Analytics");
        const sortedData = response.data.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        ); // Sort by date (newest first)
        setModes(sortedData);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
        setLoading(false);
      }
    };
    fetchModes();
  }, []);

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

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  // Calculate the count of "Started" status for Mode: AutoDisinfection
  const autoDisinfectionStartedCount = modes.filter(
    (mode) => mode.status === "Completed" && mode.mode === "AutoDisinfection"
  ).length;

  return (
    <Box sx={{ padding: 4 }}>
      {/* Heading with the count */}
      <Typography variant="h3" gutterBottom textAlign="center">
        AutoDisinfection - Total Started Count: {autoDisinfectionStartedCount}
      </Typography>
      <Grid container spacing={3}>
        {modes.map((mode, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Mode: {mode.mode}
                </Typography>
                <Typography>Email ID: {mode.emailId}</Typography>
                <Typography>Robot ID: {mode.robotId}</Typography>
                {mode.map_name && (
                  <Typography>Map Name: {mode.map_name}</Typography>
                )}
                <Typography>Status: {mode.status}</Typography>
                <Typography>
                  Date: {new Date(mode.date).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ModeDetails;
