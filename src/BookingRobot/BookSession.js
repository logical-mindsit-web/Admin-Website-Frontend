import React, { useState, useEffect } from "react";
import axios from '../utils/api';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BookSession.css";
import moment from "moment";
export default function BookSession() {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [bookedDate, setBookedDate] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [customerBlockedDates, setCustomerBlockedDates] = useState([]); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch blocked dates from backend
  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const response = await axios.get("/blocked-dates");
        // Convert ISO strings to Date objects for DatePicker compatibility
        const blocked = response.data.blockedDates.map((date) => new Date(date));
        const customerBlocked = response.data.customerBlockedDates.map((date) => new Date(date)); // Fetch customer-specific blocked dates
        setBlockedDates(blocked);
        setCustomerBlockedDates(customerBlocked); // Set customer blocked dates
      } catch (error) {
        setError("Error fetching blocked dates. Please try again.");
        console.error("Error fetching blocked dates", error);
      }
    };

    fetchBlockedDates();
  }, []);

  const handleDateChange = (date) => {
    setBookedDate(date); // Update bookedDate
  };

  const validateForm = () => {
    if (!name || !companyName || !email || !mobile || !address || !bookedDate) {
      return "All fields are required.";
    }

    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(email)) {
      return "Please enter a valid email address.";
    }

    const mobilePattern = /^\d{10}$/;
    if (!mobilePattern.test(mobile)) {
      return "Please enter a valid 10-digit mobile number.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      console.log("Form validation failed:", validationError);
      return;
    }
    const formattedDate = bookedDate ? moment(bookedDate).format("YYYY-MM-DD") : "";
    console.log("Booking details:", {
      name,
      companyName,
      email,
      mobileNumber: mobile,
      address,
      //bookedDate: bookedDate ? bookedDate.toISOString() : "",
      bookedDate: formattedDate,

    });

    try {
      const response = await axios.post("/book-session", {
        name,
        companyName,
        email,
        mobileNumber: mobile,
        address,
        //bookedDate: bookedDate ? bookedDate.toISOString() : "",
        bookedDate: formattedDate,

      
      });
      setSuccess(response.data.message);
      setError("");
      resetForm();
    } catch (error) {
      setError(error.response?.data?.message || "Error booking session. Please try again.");
      setSuccess("");
      console.error("Booking failed:", error.response?.data?.message || error);
    }
  };

  const resetForm = () => {
    setName("");
    setCompanyName("");
    setEmail("");
    setMobile("");
    setAddress("");
    setBookedDate(null); // Reset bookedDate
  };

  // Disable Sundays and add a red color
  const isSunday = (date) => date.getDay() === 0;

  return (
    <div className="book-session-container">
      <h2>Book a Session</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            aria-label="Enter your name"
          />
        </div>

        <div >
          <label htmlFor="companyName">Company Name</label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter your company name"
            required
            aria-label="Enter your company name"
          />
        </div>

        <div >
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            aria-label="Enter your email"
          />
        </div>

        <div >
          <label htmlFor="mobile">Mobile</label>
          <input
            type="text"
            id="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter your mobile number"
            required
            aria-label="Enter your mobile number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
            required
            aria-label="Enter your address"
          />
        </div>

        <div >
          <label htmlFor="bookedDate">Select Booked Date</label>
          <DatePicker
            id="bookedDate"
            selected={bookedDate}
            onChange={handleDateChange}
            minDate={new Date()}
            excludeDates={[...blockedDates, ...customerBlockedDates]} // Exclude both blocked and customer blocked dates
            placeholderText="Select a date"
            required
            filterDate={(date) => !isSunday(date)}  // Disable Sundays
            renderDayContents={(day, date) => {
              if (isSunday(date)) {
                return <span style={{ color: '#ff0000' }}>{day}</span>;  // Red color for Sundays
              }
              return <span>{day}</span>;
            }}
          />
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </form>
    </div>
  );
}
