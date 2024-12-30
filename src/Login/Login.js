
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from '../utils/api';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isFirstTime, setIsFirstTime] = useState(null);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('/validate-user', { email });
//       if (response.data.isFirstTime) {
//         setIsFirstTime(true);
//         navigate('/verify-otp', { state: { email } });
//       } else {
//         setIsFirstTime(false);
//         navigate('/loginPassword', { state: { email } });
//       }
//     } catch (error) {
//       console.error('Error:', error.response?.data || error.message);
//     }
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('/login', { email, password });
//       console.log(response.data);
//       navigate('/dashboard');
//     } catch (error) {
//       console.error('Error:', error.response?.data || error.message);
//     }
//   };

//   return (
//     <div style={styles.pageContainer}>
//       <div style={styles.headingContainer}>
//         <h2 style={styles.heading}>{isFirstTime === null ? 'Login' : 'Login'}</h2>
//       </div>
//       <div style={styles.container}>
//         <form style={styles.form} onSubmit={isFirstTime === null ? handleSubmit : handleLogin}>
//           <label style={styles.formLabel}>
//             Email:
//             <input
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               style={styles.formInput}
//             />
//           </label>
//           {isFirstTime === false && (
//             <>
//               <label style={styles.formLabel}>
//                 Password:
//                 <input
//                   type="password"
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   style={styles.formInput}
//                 />
//               </label>
//               <button type="submit" style={styles.submitButton}>
//                 Login
//               </button>
//             </>
//           )}
//           {isFirstTime === null && (
//             <button type="submit" style={styles.submitButton}>
//               Submit
//             </button>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   pageContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: '100vh',
//     backgroundColor: '#f5f5f5',
//     padding: '2rem',
//   },
//   headingContainer: {
//     marginBottom: '2rem',
//     position: 'absolute',
//     top: '5rem',
//   },
//   heading: {
//     fontSize: '2rem',
//     color: '#007bff',
//     marginBottom: '-4rem',
//   },
//   container: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//     padding: '2rem',
//     borderRadius: '10px',
//     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.6)',
//     width: '50%',
//     maxWidth: '500px',
//     marginTop: '-13rem', 
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   formLabel: {
//     marginBottom: '1rem',
//     width: '100%',
//     textAlign: 'left',
//     fontSize: '1rem',
//     color: '#555',
//   },
//   formInput: {
//     padding: '0.75rem',
//     marginTop: '0.5rem',
//     borderRadius: '5px',
//     border: '1px solid #ddd',
//     width: '100%',
//     fontSize: '1rem',
//     boxSizing: 'border-box',
//   },
//   submitButton: {
//     backgroundColor: '#007bff',
//     color: '#fff',
//     border: 'none',
//     padding: '0.75rem 1.5rem',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     marginTop: '1rem',
//     fontSize: '1rem',
//     transition: 'background-color 0.3s ease',
//   },
// };

// export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/api.js";
import roboImg from "../assets/robo.png";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const handleLogin = async (e) => {
    e.preventDefault();
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
        error.response?.data?.message || "Check your Connection ,Something went wrong. Please try again.";
      alert(errorMessage);
  
      setMessage(errorMessage); 
    }
  };
  
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post("/login", { email, password });
  //     console.log(response.data);
  //     localStorage.setItem('token', response.data.token);
  //     localStorage.setItem('role', response.data.role);
  //     localStorage.setItem('email',email);
  //     setMessage(response.data.message);
  //     navigate("/card"); 
  //   } catch (error) {
  //     console.error("Error:", error.response?.data || error.message);
  //     setMessage(error.response.data.message);
  //   }
  // };

  return (
    <div style={styles.black}>
    <div style={styles.container}>
      <div style={styles.robotContainer}>
        <img src={roboImg} alt="Robot" style={styles.robotImage} />
      </div>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>Login</h2>
        <h3 style={styles.welcome}>Welcome Back</h3>
        <form
          style={styles.form}
          onSubmit={ handleLogin}
        >
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
                placeholder="**********"
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

      
            <button type="submit" style={styles.submitButton}>
              Submit
            </button>
          
      
          
          
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
    </div>
  );
}

const styles = { 
  black:{
    background: `linear-gradient(to bottom, #28003d, #400050, #1a0144)`,
  
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "(135deg,rgb(128, 8, 114), #06DDE5",
    position: "relative",
    backgroundImage: ` linear-gradient(135deg, rgba(201, 0, 177, 0.5), rgba(6, 221, 229, 0.5)),
    linear-gradient(black 1px, transparent 1px), 
    linear-gradient(black 1px, transparent 1px), 
    linear-gradient(90deg, black 1px, transparent 1px)`,
    backgroundSize: "100% 100%,50px 50px", // Adjust grid size here
  }
  ,
  loginBox: {
    width: "400px",
    height: "450px",
    padding: "50px",
    borderRadius: "20px",
    background: "rgba(82, 5, 81, 0.5)", // Adjusted alpha for transparency
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
  message:{
    color:"white"
  }
};


