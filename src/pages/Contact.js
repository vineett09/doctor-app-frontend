// src/pages/Contact.js
import React from "react";
import Navbar from "../pages/Navbar";
import Footer from "./footer";
import "../styles/Contact.css";

const Contact = () => {
  return (
    <div>
      <Navbar />
      <main>
        <section>
          <h2>Contact Us</h2>
          <p>Email: info@doctorappointment.com</p>
          <p>Phone: (123) 456-7890</p>
          <p>Address: 123 Health St, Wellness City, CA</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
