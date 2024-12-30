import React, { useEffect, useState } from "react";
import axios from "../../utils/api";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography, Grid, Paper, Box } from "@mui/material";
import "./loadingStyles.css";

const RobotAnalyticsDetails = () => {
  const { encodedEmail } = useParams();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const decodedEmail = atob(decodeURIComponent(encodedEmail));

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get(`/analytics/${decodedEmail}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAnalyticsData(response.data.data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
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

  // Function to convert time string to seconds
  const convertTimeToSeconds = (timeStr) => {
    const parts = timeStr.split(':').map(Number);
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  };

  // Function to convert seconds back to time string (hh:mm:ss)
  const convertSecondsToTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Function to group analytics data by date and robot ID
  const groupedData = analyticsData.reduce((acc, curr) => {
    const key = curr.date.split("T")[0] + curr.robotId; // Group by date and robotId
    if (!acc[key]) {
      acc[key] = {
        ...curr,
        totalRunningTime: {
          batteryRunningTime: convertTimeToSeconds(curr.analytics.batteryRunningTime),
          motorRunningTime: convertTimeToSeconds(curr.analytics.motorRunningTime),
          uvLightRunningTime: convertTimeToSeconds(curr.analytics.uvLightRunningTime),
        },
        lastBatteryPercentage: curr.batteryPercentage, // Track the last battery percentage
        taskTimes: [
          { startingTime: curr.startingTime, endingTime: curr.endingTime },
        ],
      };
    } else {
      acc[key].totalRunningTime.batteryRunningTime += convertTimeToSeconds(curr.analytics.batteryRunningTime);
      acc[key].totalRunningTime.motorRunningTime += convertTimeToSeconds(curr.analytics.motorRunningTime);
      acc[key].totalRunningTime.uvLightRunningTime += convertTimeToSeconds(curr.analytics.uvLightRunningTime);
      acc[key].lastBatteryPercentage = curr.batteryPercentage; // Update with the latest battery percentage
      acc[key].taskTimes.push({
        startingTime: curr.startingTime,
        endingTime: curr.endingTime,
      });
    }
    return acc;
  }, {});

  // Convert total running times back to hh:mm:ss format
  for (const key in groupedData) {
    groupedData[key].runningTimes = {
      batteryRunningTime: convertSecondsToTime(groupedData[key].totalRunningTime.batteryRunningTime),
      motorRunningTime: convertSecondsToTime(groupedData[key].totalRunningTime.motorRunningTime),
      uvLightRunningTime: convertSecondsToTime(groupedData[key].totalRunningTime.uvLightRunningTime),
    };
  }

  // Convert groupedData back to array for mapping
  const groupedArray = Object.values(groupedData);

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 2,
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h4"
          component="h4"
          sx={{
            marginBottom: 3,
            fontWeight: "bold",
            color: "#333",
            textAlign: "center",
          }}
        >
          Robot Analytics for {decodedEmail}
        </Typography>
        <Grid container spacing={3}>
          {groupedArray.map((analytics, index) => (
            <Grid item key={index} xs={12} md={6}>
              <Card
                sx={{
                  height: "100%",
                  marginBottom: 2,
                  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#444" }}
                  >
                    Robot ID: {analytics.robotId}
                  </Typography>
                  <Typography sx={{ marginBottom: 1 }}>
                    Model: {analytics.model}
                  </Typography>
                  <Typography>
                    Battery Percentage (Last): {analytics.lastBatteryPercentage}%
                  </Typography>
                  <Typography>
                    Date: {new Date(analytics.date).toLocaleDateString()}
                  </Typography>
                  <Box
                    sx={{
                      marginTop: 2,
                      paddingTop: 2,
                      borderTop: "1px solid #eee",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", color: "#555" }}
                    >
                      Total Running Times:
                    </Typography>
                    <Typography>
                      Battery Running Time: {analytics.runningTimes.batteryRunningTime}
                    </Typography>
                    <Typography>
                      Motor Running Time: {analytics.runningTimes.motorRunningTime}
                    </Typography>
                    <Typography>
                      UV Light Running Time: {analytics.runningTimes.uvLightRunningTime}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      marginTop: 2,
                      paddingTop: 2,
                      borderTop: "1px solid #eee",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", color: "#555" }}
                    >
                      Task Times
                    </Typography>
                    {analytics.taskTimes.map((taskTime, i) => (
                      <Box key={i} sx={{ marginBottom: 1 }}>
                        <Typography>
                          Starting Time: {new Date(taskTime.startingTime).toLocaleString()}
                        </Typography>
                        <Typography>
                          Ending Time: {new Date(taskTime.endingTime).toLocaleString()}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default RobotAnalyticsDetails;



// import React, { useEffect, useState } from "react";
// import axios from '../../utils/api';
// import { useParams } from "react-router-dom";
// import { Card, CardContent, Typography, Grid, Paper, Box } from "@mui/material";
// import "./loadingStyles.css";

// const RobotAnalyticsDetails = () => {
//   const { encodedEmail } = useParams(); 
//   const [analyticsData, setAnalyticsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const decodedEmail = atob(decodeURIComponent(encodedEmail)); 

//   useEffect(() => {
//     const fetchAnalyticsData = async () => {
//       try {
//         const response = await axios.get(`/analytics/${decodedEmail}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         setAnalyticsData(response.data.data); 
//       } catch (error) {
//         console.error("Error fetching analytics data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnalyticsData();
//   }, [decodedEmail]);

//   if (loading) {
//     return (
//       <div className="wrapper">
//         <div className="circle"></div>
//         <div className="circle"></div>
//         <div className="circle"></div>
//         <div className="shadow"></div>
//         <div className="shadow"></div>
//         <div className="shadow"></div>
//         <span>Loading</span>
//       </div>
//     );
//   }


//   return (
//     <Box sx={{ padding: 3, backgroundColor: "#f5f5f5", minHeight: '100vh' }}>
//       <Paper
//         elevation={3}
//         sx={{
//           padding: 4,
//           borderRadius: 2,
//           backgroundColor: "#fff",
//           boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
//         }}
//       >
//         <Typography
//           variant="h4"
//           component="h4"
//           sx={{
//             marginBottom: 3,
//             fontWeight: "bold",
//             color: "#333",
//             textAlign: 'center',
//           }}
//         >
//           Robot Analytics for {decodedEmail}
//         </Typography>
//         <Grid container spacing={3}>
//           {analyticsData.map((analytics, index) => (
//             <Grid item key={index} xs={12} md={6}>
//               <Card
//                 sx={{
//                   height: '100%',
//                   marginBottom: 2,
//                   boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
//                   transition: 'transform 0.2s ease-in-out',
//                   '&:hover': {
//                     transform: 'scale(1.02)',
//                   },
//                 }}
//               >
//                 <CardContent>
//                   <Typography variant="h6" sx={{ fontWeight: 'bold', color: "#444" }}>
//                     Robot ID: {analytics.robotId}
//                   </Typography>
//                   <Typography sx={{ marginBottom: 1 }}>Model: {analytics.model}</Typography>
//                   <Typography>Battery Percentage: {analytics.batteryPercentage}%</Typography>
//                   <Typography>Date: {new Date(analytics.date).toLocaleDateString()}</Typography>
//                   <Box sx={{ marginTop: 2, paddingTop: 2, borderTop: '1px solid #eee' }}>
//                     <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: "#555" }}>
//                       Running Times
//                     </Typography>
//                     <Typography>Battery Running Time: {analytics.analytics.batteryRunningTime} hours</Typography>
//                     <Typography>Motor Running Time: {analytics.analytics.motorRunningTime} hours</Typography>
//                     <Typography>UV Light Running Time: {analytics.analytics.uvLightRunningTime} hours</Typography>
//                   </Box>
//                   <Box sx={{ marginTop: 2, paddingTop: 2, borderTop: '1px solid #eee' }}>
//                     <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: "#555" }}>
//                       Task Times
//                     </Typography>
//                     <Typography>Starting Time: {new Date(analytics.startingTime).toLocaleString()}</Typography>
//                     <Typography>Ending Time: {new Date(analytics.endingTime).toLocaleString()}</Typography>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Paper>
//     </Box>
//   );
// };

// export default RobotAnalyticsDetails;


// import React, { useEffect, useState } from "react";
// import axios from '../../utils/api';
// import { useParams } from "react-router-dom";
// import { Card, CardContent, Typography, Grid, Paper, Box } from "@mui/material";
// import "./loadingStyles.css";

// const RobotAnalyticsDetails = () => {
//   const { encodedEmail } = useParams();
//   const [analyticsData, setAnalyticsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const decodedEmail = atob(decodeURIComponent(encodedEmail));

//   useEffect(() => {
//     const fetchAnalyticsData = async () => {
//       try {
//         const response = await axios.get(`/analytics/${decodedEmail}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         setAnalyticsData(response.data.data);
//       } catch (error) {
//         console.error("Error fetching analytics data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnalyticsData();
//   }, [decodedEmail]);

//   const convertSecondsToHMS = (seconds) => {
//     const h = Math.floor(seconds / 3600); // 1 hour = 3600 seconds
//     const m = Math.floor((seconds % 3600) / 60); // 1 minute = 60 seconds
//     const s = seconds % 60;
//     const format = (unit) => (unit < 10 ? `0${unit}` : unit); // Pad with zeroes if less than 10
//     return `${format(h)}:${format(m)}:${format(s)}`;
//   };

//   if (loading) {
//     return (
//       <div className="wrapper">
//         <div className="circle"></div>
//         <div className="circle"></div>
//         <div className="circle"></div>
//         <div className="shadow"></div>
//         <div className="shadow"></div>
//         <div className="shadow"></div>
//         <span>Loading</span>
//       </div>
//     );
//   }

//   // Function to group analytics data by date and robot ID
//   const groupedData = analyticsData.reduce((acc, curr) => {
//     const key = curr.date.split('T')[0] + curr.robotId; // Group by date and robotId
//     if (!acc[key]) {
//       acc[key] = {
//         ...curr,
//         batteryRunningTime: curr.analytics.batteryRunningTime,
//         motorRunningTime: curr.analytics.motorRunningTime,
//         uvLightRunningTime: curr.analytics.uvLightRunningTime,
//         lastBatteryPercentage: curr.batteryPercentage, // Track the last battery percentage
//         taskTimes: [{ startingTime: curr.startingTime, endingTime: curr.endingTime }]
//       };
//     } else {
//       acc[key].batteryRunningTime += curr.analytics.batteryRunningTime;
//       acc[key].motorRunningTime += curr.analytics.motorRunningTime;
//       acc[key].uvLightRunningTime += curr.analytics.uvLightRunningTime;
//       acc[key].lastBatteryPercentage = curr.batteryPercentage; // Update with the latest battery percentage
//       acc[key].taskTimes.push({ startingTime: curr.startingTime, endingTime: curr.endingTime });
//     }
//     return acc;
//   }, {});

//   // Convert groupedData back to array for mapping
//   const groupedArray = Object.values(groupedData);

//   return (
//     <Box sx={{ padding: 3, backgroundColor: "#f5f5f5", minHeight: '100vh' }}>
//       <Paper
//         elevation={3}
//         sx={{
//           padding: 4,
//           borderRadius: 2,
//           backgroundColor: "#fff",
//           boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
//         }}
//       >
//         <Typography
//           variant="h4"
//           component="h4"
//           sx={{
//             marginBottom: 3,
//             fontWeight: "bold",
//             color: "#333",
//             textAlign: 'center',
//           }}
//         >
//           Robot Analytics for {decodedEmail}
//         </Typography>
//         <Grid container spacing={3}>
//           {groupedArray.map((analytics, index) => (
//             <Grid item key={index} xs={12} md={6}>
//               <Card
//                 sx={{
//                   height: '100%',
//                   marginBottom: 2,
//                   boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
//                   transition: 'transform 0.2s ease-in-out',
//                   '&:hover': {
//                     transform: 'scale(1.02)',
//                   },
//                 }}
//               >
//                 <CardContent>
//                   <Typography variant="h6" sx={{ fontWeight: 'bold', color: "#444" }}>
//                     Robot ID: {analytics.robotId}
//                   </Typography>
//                   <Typography sx={{ marginBottom: 1 }}>Model: {analytics.model}</Typography>
//                   <Typography>
//                     Battery Percentage (Last): {analytics.lastBatteryPercentage}%
//                   </Typography>
//                   <Typography>Date: {new Date(analytics.date).toLocaleDateString()}</Typography>
//                   <Box sx={{ marginTop: 2, paddingTop: 2, borderTop: '1px solid #eee' }}>
//                     <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: "#555" }}>
//                       Running Times : Format: hh:mm:ss
//                     </Typography>
//                      <Typography>Battery Running Time: {convertSecondsToHMS(analytics.analytics.batteryRunningTime)}</Typography>
//                     <Typography>Motor Running Time: {convertSecondsToHMS(analytics.analytics.motorRunningTime)}</Typography>
//                     <Typography>UV Light Running Time: {convertSecondsToHMS(analytics.analytics.uvLightRunningTime)}</Typography>
//                   </Box>
//                   <Box sx={{ marginTop: 2, paddingTop: 2, borderTop: '1px solid #eee' }}>
//                     <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: "#555" }}>
//                       Task Times
//                     </Typography>
//                     {analytics.taskTimes.map((taskTime, i) => (
//                       <Box key={i} sx={{ marginBottom: 1 }}>
//                         <Typography>Starting Time: {new Date(taskTime.startingTime).toLocaleString()}</Typography>
//                         <Typography>Ending Time: {new Date(taskTime.endingTime).toLocaleString()}</Typography>
//                       </Box>
//                     ))}
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Paper>
//     </Box>
//   );
// };

// export default RobotAnalyticsDetails;

// new correct

// RobotAnalytics.js
// import React, { useState, useEffect } from "react";
// import axios from "../../utils/api";
// import { useParams } from "react-router-dom";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   CircularProgress,
//   Box,
//   Alert,
// } from "@mui/material";

// const RobotAnalytics = ({ emailId }) => {
//   const { encodedEmail } = useParams();
//   const [analyticsData, setAnalyticsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const decodedEmail = atob(decodeURIComponent(encodedEmail));

//   useEffect(() => {
//     // Fetch the robot analytics data by emailId
//     const fetchAnalyticsData = async () => {
//       try {
//         const response = await axios.get(`/analytics/${decodedEmail}`);
//         setAnalyticsData(response.data.data);
//         setLoading(false);
//       } catch (err) {
//         setError("Error fetching robot analytics data.");
//         setLoading(false);
//       }
//     };

//     fetchAnalyticsData();
//   }, [decodedEmail]);

//   if (loading)
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//         <CircularProgress />
//       </Box>
//     );

//   if (error)
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//         <Alert severity="error">{error}</Alert>
//       </Box>
//     );

//   return (
//     <Box sx={{ flexGrow: 1, mt: 4 }}>
//       <Typography variant="h4" align="center" gutterBottom>
//         Robot Analytics for {decodedEmail}
//       </Typography>
//       {analyticsData.length === 0 ? (
//         <Typography variant="h6" align="center" color="textSecondary">
//           No analytics data found for this email.
//         </Typography>
//       ) : (
//         <Grid container spacing={2} justifyContent="center">
//           {analyticsData.map((analytics) => (
//             <Grid item xs={12} sm={6} md={4} key={analytics._id}>
//               <Card sx={{ minWidth: 275 }}>
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom>
//                     Robot ID: {analytics.robotId}
//                   </Typography>
//                   <Typography color="textSecondary" gutterBottom>
//                     Model: {analytics.model}
//                   </Typography>
//                   <Typography variant="body2" gutterBottom>
//                     Battery Percentage: {analytics.batteryPercentage}%
//                   </Typography>
//                   <Typography variant="body2" gutterBottom>
//                     Date: {new Date(analytics.date).toLocaleDateString()}
//                   </Typography>
//                   <Typography variant="subtitle1">Battery Running Time</Typography>
//                   <Typography variant="body2">
//                     Start: {analytics.analytics.batteryRunningTime.startingTime}
//                   </Typography>
//                   <Typography variant="body2">
//                     End: {analytics.analytics.batteryRunningTime.endingTime}
//                   </Typography>
//                   <Typography variant="subtitle1">Motor Running Time</Typography>
//                   <Typography variant="body2">
//                     Start: {analytics.analytics.motorRunningTime.startingTime}
//                   </Typography>
//                   <Typography variant="body2">
//                     End: {analytics.analytics.motorRunningTime.endingTime}
//                   </Typography>
//                   <Typography variant="subtitle1">UV Light Running Time</Typography>
//                   <Typography variant="body2">
//                     Start: {analytics.analytics.uvLightRunningTime.startingTime}
//                   </Typography>
//                   <Typography variant="body2">
//                     End: {analytics.analytics.uvLightRunningTime.endingTime}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}
//     </Box>
//   );
// };

// export default RobotAnalytics;
