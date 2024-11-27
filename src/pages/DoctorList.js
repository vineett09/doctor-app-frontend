import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../pages/Navbar";
import Footer from "./footer";
import "../styles/DoctorList.css";

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      const token = localStorage.getItem("token");

      try {
        const { data } = await axios.get(
          `${REACT_APP_BACKEND_URL}/api/appointments/doctors`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="doctor-list-container">
        <h1>Approved Doctors List</h1>
        <ul className="doctor-list">
          {doctors.map((doctor) => (
            <li key={doctor._id} className="doctor-item">
              <div className="doctor-info">
                <div className="doctor-profile">
                  {doctor.profilePic && (
                    <img
                      src={doctor.profilePic}
                      alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                      className="doctor-profile-pic"
                    />
                  )}
                </div>
                <div className="doctor-details">
                  <h3>
                    Dr. {doctor.firstName} {doctor.lastName},{" "}
                    <span className="doctor-specialty">{doctor.specialty}</span>
                  </h3>
                  <p className="rating">
                    ⭐ {doctor.rating || "N/A"} ·{" "}
                    <Link to={`/reviews/${doctor._id}`}>
                      {doctor.reviewsCount || 0} reviews
                    </Link>
                  </p>
                  <p>
                    Clinic Address:{" "}
                    {doctor.clinicAddress || "Address not available"}
                  </p>
                  <p>
                    Experience: {doctor.experience || "Not specified"} years
                  </p>
                  <p>Availability: {(doctor.availability || []).join(", ")}</p>
                </div>
                <div className="action-buttons">
                  <Link
                    to={`/doctors/${doctor._id}`}
                    className="profile-button"
                  >
                    View profile and reviews
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorList;
