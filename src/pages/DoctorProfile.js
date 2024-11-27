import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux"; // Add this import
import Navbar from "../pages/Navbar";
import Footer from "./footer";
import "../styles/DoctorProfile.css";

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const DoctorProfile = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchDoctor = async () => {
      const token = localStorage.getItem("token");

      try {
        const { data } = await axios.get(
          `${REACT_APP_BACKEND_URL}/api/appointments/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDoctor(data);
      } catch (error) {
        console.error("Error fetching doctor:", error);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  const bookAppointment = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to book an appointment.");
      navigate("/login");
      return;
    }

    if (!appointmentDate) {
      setError("Please select a date for the appointment.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${REACT_APP_BACKEND_URL}/api/appointments/book`,
        {
          doctorId,
          appointmentDate,
          userEmail: user.email, // Add user email
          userName: user.name, // Add user name
          doctorName: `${doctor.firstName} ${doctor.lastName}`, // Add doctor's name
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(
        "Appointment request sent successfully! Check your email for confirmation."
      );
    } catch (error) {
      setError(
        error.response?.data?.msg ||
          "Failed to book appointment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) return <div className="loading-spinner">Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="doctor-profile-container">
        <h1>
          Dr. {doctor.firstName} {doctor.lastName}
        </h1>
        <div className="doctor-profile">
          {doctor.profilePic && (
            <img
              src={doctor.profilePic}
              alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
              className="doctor-profile-pic"
            />
          )}
        </div>
        <div className="contact-info">
          <p>
            <strong>Contact Number:</strong> {doctor.PhoneNo}
          </p>
          <p>
            <strong>Clinic Address:</strong> {doctor.clinicAddress}
          </p>
          <p className="rating">
            ⭐ {doctor.rating || "N/A"} ·{" "}
            <Link to={`/reviews/${doctor._id}`}>
              {doctor.reviewsCount || 0} reviews
            </Link>
          </p>
        </div>
        <div className="professional-details">
          <h4>Professional Details</h4>
          <p>
            <strong>Specialty:</strong> {doctor.specialty}
          </p>
          <p>
            <strong>Experience:</strong>{" "}
            <span style={{ color: "#e67e22" }}>{doctor.experience} years</span>
          </p>
          <p>
            <strong>Timings:</strong> {doctor.timings.start} -{" "}
            {doctor.timings.end}
          </p>
          <h4>Availability</h4>
          <div className="availability-container">
            {doctor.availability.map((day, index) => (
              <div key={index} className="availability-box">
                {day}
              </div>
            ))}
          </div>
          <p>
            <strong>Consultation Fee:</strong> {doctor.consultationFee}
          </p>
          <p>
            <strong>Consultation Mode:</strong>
            <span className="mode-box">{doctor.consultationMode}</span>
          </p>
        </div>
        <h4>Qualifications</h4>
        <p>
          <strong>Qualifications:</strong> {doctor.qualifications.join(", ")}
        </p>
        <div className="appointment-section">
          <h4>Book Appointment</h4>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <label className="label">
            Appointment Date:
            <input
              type="datetime-local" // Changed to datetime-local for more precise booking
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="appointment-date-input"
              min={new Date().toISOString().split("T")[0]} // Prevent past dates
            />
          </label>

          <button
            onClick={bookAppointment}
            className={`book-appointment-button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Booking..." : "Book Appointment"}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorProfile;
