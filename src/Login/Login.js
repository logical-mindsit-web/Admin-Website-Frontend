import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/api.js";
import roboImg from "../assets/robo.png";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/login", { email, password });
      console.log(response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("email", email);

      setMessage(response.data.message);

      navigate("/card");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message ||
        "Check your Connection ,Something went wrong. Please try again.";
      alert(errorMessage);

      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      style={{
        ...styles.black,
        background: `radial-gradient(circle at ${cursorPos.x}px ${cursorPos.y}px,rgb(238, 124, 225)  , black 15%)`,
      }}
    >
      <div style={styles.container}>
        <div style={styles.robotContainer}>
          <img src={roboImg} alt="Robot" style={styles.robotImage} />
        </div>
        <div style={styles.loginBox}>
          <h2 style={styles.title}>Login</h2>
          <h3 style={styles.welcome}>Welcome Back</h3>
          <form style={styles.form} onSubmit={handleLogin}>
            <label style={styles.label}>
              Email:
              <input
                type="email"
                placeholder="Example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              Password:
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={styles.input}
                />
                <span onClick={togglePasswordVisibility} style={styles.eyeIcon}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </label>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </form>
          {message && <p style={styles.message}>{message}</p>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    position: "relative",
    backgroundImage: `
      linear-gradient(135deg, rgba(27, 26, 27, 0.5), rgba(27, 28, 28, 0.5)),
      linear-gradient(rgba(3, 3, 140, 0.3) 1px, transparent 1px), 
      linear-gradient(rgba(148, 11, 118, 0.3) 1px, transparent 1px), 
      linear-gradient(90deg, rgba(59, 59, 61, 0.3) 1px, transparent 1px)
    `,
    backgroundSize: "100% 100%,50px 50px",
  },
  loginBox: {
    width: "400px",
    height: "450px",
    padding: "50px",
    borderRadius: "20px",
    background: "rgba(82, 5, 81, 0.5)",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(50px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  robotContainer: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: "30px",
    position: "absolute",
    top: "50px",
    left: "50px",
  },
  robotImage: {
    width: "400px",
  },
  welcome: {
    marginBottom: "50px",
    color: "#ffffff",
    textShadow: "0px 0px 8px #ff00ff",
    fontSize: "15px",
  },
  title: {
    textAlign: "center",
    fontSize: "28px",
    color: "#fff",
    marginBottom: "50px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  label: {
    color: "#fff",
    marginBottom: "15px",
    fontSize: "16px",
  },
  input: {
    padding: "14px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #ccc",
    outline: "none",
    backgroundColor: "#fff",
    fontSize: "16px",
    width: "100%",
    boxSizing: "border-box",
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: "20px",
    top: "40%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "black",
    fontSize: "24px",
  },
  submitButton: {
    padding: "14px 0",
    fontSize: "18px",
    color: "#fff",
    backgroundColor: "#000",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    boxShadow: "0px 0px 5px 2px #ff00ff",
    width: "100%",
  },
  message: {
    color: "white",
  },
};