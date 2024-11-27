import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../pages/Navbar";
import Footer from "./footer";
import "../styles/Appointments.css";
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const doctorId = useSelector((state) => state.auth.doctorId);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");
      try {
        const { data } = await axios.get(
          `${REACT_APP_BACKEND_URL}/api/appointments/doctor/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId]);

  const respondToAppointment = async (appointmentId, status) => {
    const token = localStorage.getItem("token");
    const message = prompt("Enter your message (optional):");

    try {
      await axios.patch(
        `${REACT_APP_BACKEND_URL}/api/appointments/respond/${appointmentId}`,
        { status, message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Response sent successfully");

      // Refresh the appointment list
      setAppointments((prevAppointments) =>
        prevAppointments.filter((a) => a._id !== appointmentId)
      );
    } catch (error) {
      console.error("Error responding to appointment:", error);
      if (error.response.status === 403) {
        alert("You are not authorized to perform this action.");
      } else {
        alert("Failed to respond to appointment. Please try again.");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="appointments-container">
        <h1>Your Appointments</h1>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <ul>
            {appointments.map((appointment) => (
              <li key={appointment._id}>
                <p>
                  Appointment Date:{" "}
                  {new Date(appointment.appointmentDate).toLocaleString()}
                </p>
                <p>Requested by: {appointment.user.email}</p>
                <button
                  onClick={() =>
                    respondToAppointment(appointment._id, "approved")
                  }
                >
                  Approve
                </button>
                <button
                  onClick={() =>
                    respondToAppointment(appointment._id, "rejected")
                  }
                >
                  Reject
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DoctorAppointments;
