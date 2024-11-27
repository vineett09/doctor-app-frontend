// src/pages/AboutUs.js
import React from "react";
import Navbar from "../pages/Navbar";
import Footer from "./footer";
import "../styles/AboutUs.css";

const AboutUs = () => {
  return (
    <div>
      <Navbar />
      <main>
        <section>
          <h2>About Us</h2>
          <p>
            We are committed to providing the highest quality healthcare
            services.
          </p>
          <p>
            Our team consists of experienced professionals who are passionate
            about patient care.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
