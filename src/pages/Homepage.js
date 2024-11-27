import React, { useState } from "react";
import Navbar from "../pages/Navbar";
import Footer from "./footer";
import { Link, useNavigate } from "react-router-dom";
import InfoSection from "../components/InfoSection";
import ServiceCard from "../components/ServiceCard";
import FetchOptions from "../components/FetchOptions"; // Import the new component
import "../styles/Homepage.css";
import "../styles/SearchForm.css"; // Import the new CSS for the search form

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cityTerm, setCityTerm] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [cities, setCities] = useState([]);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm && cityTerm) {
      navigate(`/search-results/${searchTerm}/${cityTerm}`);
    }
  };

  const services = [
    {
      title: "General Checkups",
      description:
        "Access healthcare professionals for regular health examinations.",
    },
    {
      title: "Virtual Consultations",
      description: "Consult with doctors from anywhere, at any time.",
    },
    {
      title: "Specialized Care",
      description:
        "Find specialists in various fields, from pediatrics to cardiology.",
    },
    {
      title: "Appointment Booking",
      description:
        "Easily book appointments with your chosen healthcare provider.",
    },
    {
      title: "Mental Health Support",
      description: "Access counseling and therapy services.",
    },
    {
      title: "Emergency Services",
      description: "Get immediate assistance during medical emergencies.",
    },
    {
      title: "Wellness Programs",
      description:
        "Participate in programs designed for your overall well-being.",
    },
  ];

  return (
    <div className="homepage">
      <Navbar />
      <FetchOptions setSpecialties={setSpecialties} setCities={setCities} />

      <main className="main">
        {/* Search Form */}
        <div className="search-form-container">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-field">
              <select
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              >
                <option value="">Select Specialty</option>
                {specialties.map((specialty, index) => (
                  <option key={index} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
            <div className="location-field">
              <select
                value={cityTerm}
                onChange={(e) => setCityTerm(e.target.value)}
              >
                <option value="">Select City</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </div>

        <InfoSection />

        <section id="services" className="card">
          <h2>Our Services</h2>
          <p>
            We offer a comprehensive range of services to connect patients with
            healthcare professionals worldwide:
          </p>
          <div className="service-cards">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
          <p>
            <Link to="/services" className="card-link">
              Explore all our services.
            </Link>
          </p>
        </section>

        <section id="about-us" className="card">
          <h2>About Us</h2>
          <p>
            Welcome to our global healthcare platform, where we connect patients
            with doctors from all over the world.
          </p>
          <p>
            Our mission is to make healthcare accessible to everyone, regardless
            of location.
          </p>
          <p>
            <Link to="/about-us" className="card-link">
              Learn more about our mission and values.
            </Link>
          </p>
        </section>

        <section id="get-started" className="card">
          <h2>Get Started</h2>
          <p>
            Are you a healthcare professional? Join our platform to reach a
            wider audience and help patients worldwide.
          </p>
          <Link to="/become-a-doctor" className="join-btn">
            Become a Doctor
          </Link>
          <p>
            Looking for medical advice or treatment? Find and connect with
            doctors in various specialties, and book appointments easily.
          </p>
          <Link to="/find-doctor" className="find-doctor-btn">
            Find a Doctor
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
