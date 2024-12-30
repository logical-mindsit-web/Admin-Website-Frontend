import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import axios from "../utils/api";

const CardComponent = ({ title, count }) => (
  <div style={styles.card}>
    <h3>{title}</h3>
    {count !== undefined && <Typography variant="h6">{count}</Typography>}
  </div>
);

const Dashboard = () => {
  const [modes, setModes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchModes = async () => {
      try {
        const response = await axios.get("/modes/AutoDisinfection-Analytics");
        const sortedData = response.data.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
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
    <div style={styles.container}>
      <h1 style={styles.heading}>Robot Analytics Details</h1>
      <div style={styles.cardContainer}>
        <CardComponent title="Disinfection Cycle 'Total Cycle'" count={autoDisinfectionStartedCount} />
        <CardComponent title="UV Light Running Time (Hours)" />
        <CardComponent title="Battery Running Time(Hours)" />
        <CardComponent title="Motor Running (Distance)" />
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center", // Centers the heading
    padding: "20px",
  },
  heading: {
    fontSize: "32px",
    marginBottom: "20px", // Adds space between the heading and the cards
  },
  cardContainer: {
    display: "flex",
    justifyContent: "space-around",
    padding: "20px",
  },
  card: {
    width: "200px",
    height: "120px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
};

export default Dashboard;
