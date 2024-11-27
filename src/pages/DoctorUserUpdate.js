// src/pages/UpdateProfile.js
import React from "react";
import DoctorProfileUpdate from "../components/DoctorProfileUpdate";
import Navbar from "./Navbar";
import Footer from "./footer";

const DoctorUserUpdate = () => {
  return (
    <div>
      <Navbar />
      <main>
        <h1>Update Profile</h1>
        <DoctorProfileUpdate />
      </main>
      <Footer />
    </div>
  );
};

export default DoctorUserUpdate;
