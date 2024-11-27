import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../pages/Navbar.js";
import Footer from "../pages/footer.js";
import { useNavigate, Link } from "react-router-dom";
import "../styles/SearchResults.css";
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const SearchResults = () => {
  const { specialty, clinicCity } = useParams(); // Get both specialty and clinicCity from URL parameters
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          `${REACT_APP_BACKEND_URL}/api/search/search-doctors?specialty=${specialty}&clinicCity=${clinicCity}`
        );

        if (!response.ok) {
          throw new Error("No doctors found for this specialty and location");
        }

        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [specialty, clinicCity]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Navbar />
      <div className="search-results">
        {doctors.length === 0 ? (
          <div className="no-results">
            <h3>No Doctors Found</h3>
            <p>
              Sorry, we couldn't find any doctors specializing in {specialty} in{" "}
              {clinicCity}.
            </p>
            <p>
              Please try a different specialty or location, or check back later
              as new doctors are added regularly.
            </p>
          </div>
        ) : (
          <ul>
            <h2>
              Doctors specialized in {specialty} in {clinicCity}
            </h2>
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
                      <span className="doctor-specialty">
                        {doctor.specialty}
                      </span>
                    </h3>
                    <p className="rating">
                      ⭐ {doctor.rating || "N/A"} ·{" "}
                      <Link to={`/reviews/${doctor._id}`}>
                        {doctor.reviewsCount || 0} reviews
                      </Link>
                    </p>
                    <p>
                      Clinic Address:{" "}
                      {doctor.clinicCity || "Address not available"}
                    </p>
                    <p>
                      Experience: {doctor.experience || "Not specified"} years
                    </p>
                    <p>
                      Availability: {(doctor.availability || []).join(", ")}
                    </p>
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
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
