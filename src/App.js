// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../src/pages/Homepage";
import LoginPage from "../src/pages/LoginPage";
import RegisterPage from "../src/pages/RegisterPage";
import BecomeADoctor from "../src/pages/BecomeADoctor";
import DoctorList from "./pages/DoctorList";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import DoctorProfile from "./pages/DoctorProfile";
import DoctorAppointments from "./pages/DoctorAppointments"; // Import the new component
import SearchResults from "./components/SearchResults";
import DoctorDashboard from "./notifications/DoctorDashboard";
import UserDashboard from "./notifications/UserDashboard";
import AdminDashboard from "./notifications/AdminDashboard";
import DoctorUserUpdate from "./pages/DoctorUserUpdate";
import DoctorReviews from "./pages/DoctorReviews";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/become-a-doctor" element={<BecomeADoctor />} />
        <Route path="/doctor-list" element={<DoctorList />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/update-profile" element={<DoctorUserUpdate />} />
        <Route
          path="/search-results/:specialty/:clinicCity"
          element={<SearchResults />}
        />{" "}
        <Route path="/doctors/:doctorId" element={<DoctorProfile />} />
        <Route path="/reviews/:doctorId" element={<DoctorReviews />} />
        <Route
          path="/doctor-appointments"
          element={<DoctorAppointments />}
        />{" "}
        {/* New route */}
      </Routes>
    </Router>
  );
};

export default App;
