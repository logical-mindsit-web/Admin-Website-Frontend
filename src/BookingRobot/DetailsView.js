import React, { useEffect, useState } from "react";
import axios from "../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Divider,
  Button,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CustomerDetails = () => {
  const { id } = useParams(); // Get session ID from the URL
  const navigate = useNavigate(); // Use navigate hook for back navigation
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(`/sessions/${id}`);
        if (response.data.success) {
          setCustomerData(response.data.data);
        } else {
          setError("Failed to fetch customer data.");
        }
      } catch (err) {
        setError("An error occurred while fetching customer data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [id]);

  const handleConfirm = async () => {
    try {
      const response = await axios.patch("/sessions/status", {
        sessionId: id,
        status: "conformed",
      });

      if (response.data.success) {
        setCustomerData((prevData) => ({
          ...prevData,
          customer: { ...prevData.customer, status: "conformed" },
        }));
      }
    } catch (error) {
      console.error("Error confirming session:", error.message);
    }
  };

  const handleReject = async () => {
    try {
      const response = await axios.patch("/sessions/status", {
        sessionId: id,
        status: "rejected",
      });

      if (response.data.success) {
        setCustomerData((prevData) => ({
          ...prevData,
          customer: { ...prevData.customer, status: "rejected" },
        }));
      }
    } catch (error) {
      console.error("Error rejecting session:", error.message);
    }
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

  if (error)
    return (
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </div>
    );

  return (
    <div
      style={{
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "80vh",
      }}
    >
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Card>
            <CardHeader
              title={
                <Box display="flex" alignItems="center">
                  <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography
                    variant="h6"
                    style={{ textAlign: "center", width: "100%" }}
                  >
                    Customer Details
                  </Typography>
                </Box>
              }
              subheader="Information about the customer and their Booking date"
              style={{ textAlign: "center", backgroundColor: "#f4f6f8" }}
            />
            <Divider />
            <CardContent>
              {customerData && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Name: {customerData.customer.name}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Email:</strong> {customerData.customer.email}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Mobile:</strong>{" "}
                    {customerData.customer.mobileNumber}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Company:</strong>{" "}
                    {customerData.customer.companyName}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Address:</strong> {customerData.customer.address}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Booking Date:</strong>{" "}
                    {new Date(
                      customerData.customer.bookedDate
                    ).toLocaleDateString("en-GB")}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Status:</strong> {customerData.customer.status}
                  </Typography>
                  {customerData.customer.status === "pending" && (
                    <Box mt={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginRight: "8px" }}
                        onClick={handleConfirm}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={handleReject}
                      >
                        Reject
                      </Button>
                    </Box>
                  )}
                  {customerData.customer.status === "conformed" && (
                    <Typography variant="body2" color="success.main">
                      Confirmed
                    </Typography>
                  )}
                  {customerData.customer.status === "rejected" && (
                    <Typography variant="body2" color="error.main">
                      Rejected
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default CustomerDetails;
