
import React, { useState, useEffect } from "react";
import axios from "../../utils/api";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Alert,
} from "@mui/material";

const RobotAnalytics = () => {
  const { encodedEmail } = useParams();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const decodedEmail = atob(decodeURIComponent(encodedEmail));

  useEffect(() => {
    // Fetch the robot analytics data by emailId
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get(`/analytics/${decodedEmail}`);
        setAnalyticsData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching robot analytics data.");
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [decodedEmail]);

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

  if (error)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

    return (
      <Box sx={{ flexGrow: 1, mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Robot Analytics for {decodedEmail}
        </Typography>
        {analyticsData.length === 0 ? (
          <Typography variant="h6" align="center" color="textSecondary">
            No analytics data found for this email.
          </Typography>
        ) : (
          <Grid container spacing={2} justifyContent="center">
            {analyticsData.map((analytics) => (
              <Grid item xs={12} sm={6} md={4} key={analytics._id}>
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <strong>Robot ID:</strong> {analytics.robotId}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Model: {analytics.model}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Battery Percentage: {analytics.batteryPercentage}%
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                    Motordistance Covered: {analytics.motordistanceCovered}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Date: {new Date(analytics.date).toLocaleDateString()}
                    </Typography>
  
                    {/* Display Battery Running Time */}
                    <Typography variant="subtitle1"><strong>Battery Running Time</strong></Typography>
                    <Typography variant="body2">
                      Start: {analytics.analytics.batteryRunningTime.startingTime}
                    </Typography>
                    <Typography variant="body2">
                      End: {analytics.analytics.batteryRunningTime.endingTime}
                    </Typography>
  
                    {/* Display Motor Running Time */}
                    <Typography variant="subtitle1"><strong>Motor Running Time</strong></Typography>
                    <Typography variant="body2">
                      Start: {analytics.analytics.motorRunningTime.startingTime}
                    </Typography>
                    <Typography variant="body2">
                      End: {analytics.analytics.motorRunningTime.endingTime}
                    </Typography>
  
                    {/* Display UV Light Running Time */}
                    <Typography variant="subtitle1"><strong>UV Light Running Time</strong></Typography>
                    <Typography variant="body2">
                      Start: {analytics.analytics.uvLightRunningTime.startingTime}
                    </Typography>
                    <Typography variant="body2">
                      End: {analytics.analytics.uvLightRunningTime.endingTime}
                    </Typography>
  
                    {/* Display Detection Details */}
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                     <h2> Detection Details:</h2>
                    </Typography>
                    {analytics.detectionDetails.map((detail, index) => (
                      <Box key={index} sx={{ mt: 1, borderTop: "1px solid #ccc", pt: 1 }}>
                        <Typography variant="body2">
                          <strong>Object Name:</strong> {detail.Object_Name}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Object Count:</strong> {detail.Object_Count}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Status:</strong> {detail.status}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Distance and Time:</strong>
                        </Typography>
                        {Object.entries(detail.DistanceAndTime).map(([key, value], idx) => (
                          <Typography key={idx} variant="body2" sx={{ pl: 2 }}>
                            <strong>{key}:</strong> Distance - {value.Distance}m, Time -{" "}
                            {value.Time}s
                          </Typography>
                        ))}
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    );
  };

export default RobotAnalytics;
