import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../../utils/api';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CardMedia,
  Box,
  Button,
} from "@mui/material";
import "./loadingStyles.css";

const RobotList = () => {
  const [robots, setRobots] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch resolved counts by robotId
  const fetchResolvedCounts = async (robotId) => {
    try {
      const response = await axios.get(`/robotmsg/resolved-count/${robotId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.data || { true: 0, false: 0 }; // Ensure default values
    } catch (error) {
      console.error(`Error fetching resolved counts for robotId ${robotId}:`, error);
      return { true: 0, false: 0 }; // Ensure default values
    }
  };

  // Fetch robots and their resolved counts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const robotsResponse = await axios.get("/robots", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Fetch counts for each robot and merge with robot data
        const robotsWithCounts = await Promise.all(robotsResponse.data.map(async (robot) => {
          const counts = await fetchResolvedCounts(robot.robotId);
          return { ...robot, counts };
        }));

        setRobots(robotsWithCounts);
      } catch (error) {
        console.error("Error fetching robots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check for updated unresolved counts periodically
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const updatedRobots = await Promise.all(robots.map(async (robot) => {
          const counts = await fetchResolvedCounts(robot.robotId);

          return { ...robot, counts };
        }));

        setRobots(updatedRobots);
      } catch (error) {
        console.error("Error updating robots:", error);
      }
    }, 5000); // Check for updates every 5 seconds

    return () => clearInterval(intervalId);
  }, [robots]);

  // Navigate to the robot message page with the robotId as a parameter
  const handleViewMessage = (robotId) => {
    navigate(`/robot/${robotId}`);
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
    <div>
    <Typography variant="h4" component="h1" align="center"style={{ marginBottom: '20px', marginTop:'20px' }}>
        Robot's Message List
      </Typography>
      <Grid container spacing={3}>
        {robots.map((robot, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card
              style={{
                border: robot.counts.false > 0 ? "3px solid red" : "1px solid #ccc",
                transition: "border-color 0.3s ease",
              }}
            >
              <Box position="relative" display="flex" flexDirection="row" alignItems="center">
                <CardMedia
                  component="img"
                  image={robot.image}
                  alt={robot.name}
                  style={{
                    width: "100px",
                    height: "200px",
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    right: 0,
                  }}
                />
                <Box flex={1} padding="16px" marginRight="110px">
                  <CardContent>
                    <Typography
                      variant="h6"
                      style={{ fontSize: "1rem", marginBottom: "8px" }}
                    >
                      {robot.username}
                    </Typography>
                    <Typography
                      style={{ fontSize: "0.9rem", marginBottom: "4px" }}
                    >
                      <strong>RobotID:</strong> {robot.robotId}
                    </Typography>
                    <Typography
                      style={{ fontSize: "0.9rem", marginBottom: "4px" }}
                    >
                      <strong>IPAddress:</strong> {robot.IPAddress}
                    </Typography>
                    <Typography
                      style={{ fontSize: "0.9rem", marginBottom: "4px" }}
                    >
                      <strong>Model:</strong> {robot.model}
                    </Typography>
                    <Typography
                      style={{ fontSize: "0.9rem", marginBottom: "4px" }}
                    >
                      <strong>Serial Number:</strong> {robot.serialNumber}
                    </Typography>
                    <Typography
                      style={{ fontSize: "0.9rem", marginBottom: "4px" }}
                    >
                      <strong>Status:</strong> {robot.status}
                    </Typography>
                    <Typography
                      style={{ fontSize: "0.9rem", marginBottom: "4px" }}
                    >
                      <strong>Location:</strong> {robot.location}
                    </Typography>
                    <Typography
                      style={{ fontSize: "0.9rem", marginBottom: "4px" }}
                    >
                      <strong>LastMaintenanceDate:</strong> {robot.lastMaintenanceDate}
                    </Typography>

                    {/* Button */}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewMessage(robot.robotId)}
                      style={{ marginTop: "16px" }}
                    >
                      Message
                    </Button>

                    {/* Horizontal layout for the counts below the button */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      marginTop="16px" // Add some space above
                      gap="20px" // Add gap between resolved and unresolved
                    >
                      {/* Resolved count */}
                      <Box display="flex" alignItems="center">
                        <Typography
                          style={{
                            fontSize: "0.9rem",
                            marginRight: "8px",
                          }}
                        >
                          <strong>Resolved:</strong>
                        </Typography>
                        <Box
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "green",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1rem",
                          }}
                        >
                          {robot.counts.true || 0}
                        </Box>
                      </Box>

                      {/* Unresolved count: Only show if count is greater than 0 */}
                      {robot.counts.false > 0 && (
                        <Box display="flex" alignItems="center">
                          <Typography
                            style={{
                              fontSize: "0.9rem",
                              marginRight: "8px",
                            }}
                          >
                            <strong>Unresolved:</strong>
                          </Typography>
                          <Box
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              backgroundColor: "red",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1rem",
                            }}
                          >
                            {robot.counts.false}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Box>
                <Typography
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    backgroundColor: "rgba(0,0,0,0.3)",
                    color: "#fff",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                  }}
                >
                  {index + 1}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default RobotList;
