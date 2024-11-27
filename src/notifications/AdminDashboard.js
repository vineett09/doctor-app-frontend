import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../pages/Navbar";
import Footer from "../pages/footer";
import "../styles/Dashboard.css";

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview"); // Add this new state
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [errorRequests, setErrorRequests] = useState(null);
  const [errorNotifications, setErrorNotifications] = useState(null);
  const [errorDoctors, setErrorDoctors] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("No token found. Please log in again.");
        return;
      }

      // Fetch approved doctors
      try {
        const response = await axios.get(
          `${REACT_APP_BACKEND_URL}/api/doctor-requests/doctors/approved`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setApprovedDoctors(response.data.doctors);
      } catch (error) {
        setErrorDoctors("Error fetching approved doctors.");
      } finally {
        setLoadingDoctors(false);
      }

      // Fetch doctor statistics
      try {
        const statsResponse = await axios.get(
          `${REACT_APP_BACKEND_URL}/api/doctor-requests/doctors/stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStats(statsResponse.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("No token found. Please log in again.");
        return;
      }

      try {
        const response = await axios.get(
          `${REACT_APP_BACKEND_URL}/api/doctor-requests/requests`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRequests(response.data);
      } catch (error) {
        setErrorRequests("Error fetching requests. Please try again later.");
      } finally {
        setLoadingRequests(false);
      }
    };

    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("No token found. Please log in again.");
        return;
      }

      try {
        const response = await axios.get(
          `${REACT_APP_BACKEND_URL}/api/notifications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNotifications(response.data);
      } catch (error) {
        setErrorNotifications(
          "Error fetching notifications. Please try again later."
        );
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchRequests();
    fetchNotifications();
  }, []);

  const handleDecision = async (id, approve) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }

    try {
      await axios.post(
        `${REACT_APP_BACKEND_URL}/api/doctor-requests/requests/${id}/approve`,
        { approved: approve },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRequests(requests.filter((req) => req._id !== id));
      alert(approve ? "Doctor request approved!" : "Doctor request rejected!");
    } catch (error) {
      alert("Error processing request. Please try again.");
    }
  };

  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const toggleDetails = (id) => {
    setSelectedRequestId(selectedRequestId === id ? null : id);
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }

    try {
      await axios.patch(
        `${REACT_APP_BACKEND_URL}/api/notifications/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(
        notifications.map((notification) => ({ ...notification, read: true }))
      );
    } catch (error) {
      alert("Error marking notifications as read. Please try again.");
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          stats && (
            <section className="dashboard-section stats-section">
              <h2 className="section-title">Dashboard Overview</h2>
              <div className="stats-grid">
                <h3>Total Doctors</h3>
                <p>{stats.totalDoctors}</p>
              </div>
              <div className="stat-card">
                <h3>Approved Doctors</h3>
                <p>{stats.approvedDoctors}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Approvals</h3>
                <p>{stats.pendingApprovals}</p>
              </div>
              <div className="stat-card">
                <h3>Specialties</h3>
                <p>{stats.specialtiesCount}</p>
              </div>
            </section>
          )
        );
      case "doctors":
        return (
          <section className="dashboard-section approved-doctors-section">
            <div className="section-header">
              <h2 className="section-title">Approved Doctors List</h2>
              <span className="doctor-count">
                Total: {approvedDoctors.length}
              </span>
            </div>
            {loadingDoctors ? (
              <p className="loading-state">Loading approved doctors...</p>
            ) : errorDoctors ? (
              <p className="error-message">{errorDoctors}</p>
            ) : approvedDoctors.length > 0 ? (
              <div className="doctors-list-container">
                <table className="doctors-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Specialty</th>
                      <th>Email</th>
                      <th>Experience</th>
                      <th>Location</th>
                      <th>Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedDoctors.map((doctor) => (
                      <tr key={doctor._id} className="doctor-row">
                        <td>
                          <div className="doctor-name-cell">
                            <img
                              src={doctor.profilePic}
                              alt={`Dr. ${doctor.firstName}`}
                              className="doctor-small-pic"
                            />
                            <span>{`Dr. ${doctor.firstName} ${doctor.lastName}`}</span>
                          </div>
                        </td>
                        <td>{doctor.specialty}</td>
                        <td>{doctor.user.email}</td>
                        <td>{doctor.experience} years</td>
                        <td>{doctor.city}</td>
                        <td>₹{doctor.consultationFee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="empty-state">No approved doctors yet.</p>
            )}
          </section>
        );
      case "requests":
        return (
          <section className="dashboard-section doctor-requests-section">
            <div className="section-header">
              <h2 className="section-title">Doctor Requests</h2>
            </div>
            {loadingRequests ? (
              <p className="loading-state">Loading requests...</p>
            ) : errorRequests ? (
              <p className="error-message">{errorRequests}</p>
            ) : requests.length > 0 ? (
              <div className="requests-container custom-scrollbar">
                {requests.map((req) => (
                  <div key={req._id} className="request-item">
                    <div
                      className="request-header"
                      onClick={() => toggleDetails(req._id)}
                    >
                      <h3 className="request-title">{`Dr. ${req.firstName} ${req.lastName}`}</h3>
                      <p className="request-specialty">{req.specialty}</p>
                    </div>
                    {selectedRequestId === req._id && (
                      <div className="request-details">
                        <h4>Personal Details</h4>
                        <img
                          src={req.profilePic}
                          alt={`${req.firstName} ${req.lastName}`}
                          className="doctor-img"
                        />
                        <p>Email: {req.user.email}</p>
                        <p>Experience: {req.experience} years</p>
                        <p>Location: {req.city}</p>
                        <div className="action-buttons">
                          <button
                            className="approve-btn"
                            onClick={() => handleDecision(req._id, true)}
                          >
                            Approve
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() => handleDecision(req._id, false)}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No doctor requests yet.</p>
            )}
          </section>
        );
      case "notifications":
        return (
          <section className="dashboard-section notifications-section">
            <div className="section-header">
              <h2 className="section-title">Notifications</h2>
              <button className="mark-read-btn" onClick={markAllAsRead}>
                Mark All as Read
              </button>
            </div>
            {loadingNotifications ? (
              <p className="loading-state">Loading notifications...</p>
            ) : errorNotifications ? (
              <p className="error-message">{errorNotifications}</p>
            ) : notifications.length > 0 ? (
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`notification-item ${
                      notification.read ? "read" : "unread"
                    }`}
                  >
                    <p>{notification.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No notifications yet.</p>
            )}
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <Navbar />
      <div className="dashboard-content">
        <div className="sidebar">
          <h2 className="sidebar-title">Admin Dashboard</h2>
          <ul className="sidebar-menu">
            <li
              className={`sidebar-item ${
                activeSection === "overview" ? "active" : ""
              }`}
              onClick={() => setActiveSection("overview")}
            >
              Overview
            </li>
            <li
              className={`sidebar-item ${
                activeSection === "doctors" ? "active" : ""
              }`}
              onClick={() => setActiveSection("doctors")}
            >
              Approved Doctors
            </li>
            <li
              className={`sidebar-item ${
                activeSection === "requests" ? "active" : ""
              }`}
              onClick={() => setActiveSection("requests")}
            >
              Doctor Requests
            </li>
            <li
              className={`sidebar-item ${
                activeSection === "notifications" ? "active" : ""
              }`}
              onClick={() => setActiveSection("notifications")}
            >
              Notifications
            </li>
          </ul>
        </div>
        <div className="main-content">{renderActiveSection()}</div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
