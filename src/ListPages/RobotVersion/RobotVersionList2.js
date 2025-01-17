import React, { useEffect, useState } from "react";
import axios from "../../utils/api";
import { useParams } from "react-router-dom";

const RobotVersionList2 = () => {
  const { emailId } = useParams();
  const [appDetails, setAppDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [manualMapping, setManualMapping] = useState("");
  const [objectDisinfection, setObjectDisinfection] = useState("");

  const decodeEmail = (encodedEmail) => {
    return atob(decodeURIComponent(encodedEmail));
  };

  useEffect(() => {
    const fetchAppDetails = async () => {
      try {
        const decodedEmail = decodeEmail(emailId);
        const response = await axios.get(`/appdetails/${decodedEmail}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAppDetails(response.data);
        setManualMapping(response.data.user.manualMapping);
        setObjectDisinfection(response.data.user.objectDisinfection);
      } catch (error) {
        console.error("Error fetching robot details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppDetails();
  }, [emailId]);

  const handleUpdate = async () => {
    try {
      const decodedEmail = decodeEmail(emailId);
      await axios.put(`/update-appdetails/${decodedEmail}`, {
        manualMapping,
        objectDisinfection,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const response = await axios.get(`/appdetails/${decodedEmail}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAppDetails(response.data);
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating user settings:", error);
    }
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
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

  if (!appDetails) {
    return <div>No robot details found</div>;
  }

  return (
    <div style={{ padding: "20px", marginTop: "30px" }}>
      <div style={{ padding: "30px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", backgroundColor: "#fff" }}>
        <h2 style={{ marginBottom: "20px", fontWeight: "bold", color: "#333" }}>
          Robot Metadata Details
        </h2>
        <div style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)", backgroundColor: "#e0f7fa", padding: "20px" }}>
          <div style={{ marginBottom: "10px" }}>
            <strong>Email ID:</strong> {appDetails.user.email}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Version:</strong> {appDetails.version}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Manual Mapping:</strong> {appDetails.user.manualMapping}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Object Disinfection:</strong> {appDetails.user.objectDisinfection}
          </div>
          <button
            onClick={handleOpenDialog}
            style={{
              backgroundColor: "#3f51b5",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Update
          </button>
        </div>
      </div>

      {/* Dialog for updating settings */}
      {dialogOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Dimming the background
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Update Robot Settings</h3>
            <div style={{ marginBottom: "15px" }}>
              <label>Manual Mapping</label>
              <select
                value={manualMapping}
                onChange={(e) => setManualMapping(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label>Object Disinfection</label>
              <select
                value={objectDisinfection}
                onChange={(e) => setObjectDisinfection(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={handleCloseDialog}
                style={{
                  backgroundColor: "#f44336",
                  color: "#fff",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                style={{
                  backgroundColor: "#4caf50",
                  color: "#fff",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RobotVersionList2;
