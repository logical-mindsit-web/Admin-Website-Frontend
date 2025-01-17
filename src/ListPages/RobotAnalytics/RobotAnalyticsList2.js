import React, { useState, useEffect } from "react";
import axios from "../../utils/api";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
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
        setError("No robot analytics data.");
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

  return (
    <Box sx={{ flexGrow: 1, mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Robot Analytics for {decodedEmail}
      </Typography>
      {error && (
        <Typography variant="h6" align="center" color="error">
          {error}
        </Typography>
      )}
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
                    Mode: {analytics.mode}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Status: {analytics.status}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Disinfection Time Taken: {analytics.disinfectionTimeTakenSeconds} seconds
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Battery Usage: {analytics.batteryUsageInPercentage}%
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    UV Light Usage: {analytics.uvLightUsageInSeconds} seconds
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Motor Runtime: {analytics.motorRuntimeInSeconds} seconds
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Distance Travelled: {analytics.distanceTravelledInMeters} meters
                  </Typography>

                  {/* UV Light Times */}
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>UV Light Times:</strong>
                  </Typography>
                  {analytics.uvLightTimes.map((time, index) => (
                    <Typography key={index} variant="body2">
                      Start: {new Date(time.startTime).toLocaleString()}, End: {new Date(time.endTime).toLocaleString()}
                    </Typography>
                  ))}

                  {/* Motion Detection Times */}
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Motion Detection Times:</strong>
                  </Typography>
                  {analytics.motionDetectionTimes.map((motion, index) => (
                    <Box key={index} sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        Detected: {new Date(motion.detectedTime).toLocaleString()}
                      </Typography>
                      {motion.resumeTime && (
                        <Typography variant="body2">
                          Resume: {new Date(motion.resumeTime).toLocaleString()}
                        </Typography>
                      )}
                      {motion.abortedTime && (
                        <Typography variant="body2">
                          Aborted: {new Date(motion.abortedTime).toLocaleString()}
                        </Typography>
                      )}
                    </Box>
                  ))}

                  {/* Object Detection */}
                  {analytics.objectDetection && (
                    <>
                      <Typography variant="subtitle1" gutterBottom>
                        <strong>Object Detection:</strong>
                      </Typography>
                      {analytics.objectDetection.map((object, index) => (
                        <Box key={index} sx={{ mt: 1, borderTop: "1px solid #ccc", pt: 1 }}>
                          <Typography variant="body2">
                            <strong>Object Name:</strong> {object.objectName}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Coordinates:</strong> x: {object.objectCoordinate.x}, y: {object.objectCoordinate.y}, angle: {object.objectCoordinate.angle}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Distance:</strong> {object.distance} meters
                          </Typography>
                          <Typography variant="body2">
                            <strong>Accuracy:</strong> {object.accuracyPercentage}%
                          </Typography>
                        </Box>
                      ))}
                    </>
                  )}
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
