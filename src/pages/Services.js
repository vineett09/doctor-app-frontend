// src/pages/Services.js
import React from "react";
import Navbar from "../pages/Navbar";
import Footer from "./footer";
import "../styles/Services.css";

const Services = () => {
  return (
    <div>
      <Navbar />
      <main>
        <section>
          <h2>Our Services</h2>
          <p>Details about each service offered will go here.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
