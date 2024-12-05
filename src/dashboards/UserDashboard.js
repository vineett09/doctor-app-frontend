import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../pages/Navbar";
import Footer from "../pages/footer";
import "../styles/Dashboard.css";

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [notifications, setNotifications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("No token found. Please log in again.");
        return;
      }

      try {
        // Fetch notifications
        const notificationsResponse = await axios.get(
          `${REACT_APP_BACKEND_URL}/api/notifications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNotifications(notificationsResponse.data);

        // Fetch appointments
        const appointmentsResponse = await axios.get(
          `${REACT_APP_BACKEND_URL}/api/reviews/approved-appointments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAppointments(appointmentsResponse.data);

        // Set user stats
        setUserStats({
          totalAppointments: appointmentsResponse.data.length,
          pendingAppointments: appointmentsResponse.data.filter(
            (apt) => apt.status === "pending"
          ).length,
          completedAppointments: appointmentsResponse.data.filter(
            (apt) => apt.status === "approved"
          ).length,
          unreadNotifications: notificationsResponse.data.filter(
            (notif) => !notif.read
          ).length,
        });
      } catch (error) {
        setError("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          <section className="dashboard-section stats-section">
            <h2 className="section-title">Dashboard Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Appointments</h3>
                <p>{userStats?.totalAppointments || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Appointments</h3>
                <p>{userStats?.pendingAppointments || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Completed Appointments</h3>
                <p>{userStats?.completedAppointments || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Unread Notifications</h3>
                <p>{userStats?.unreadNotifications || 0}</p>
              </div>
            </div>
          </section>
        );

      case "appointments":
        return (
          <section className="dashboard-section appointments-section">
            <div className="section-header">
              <h2 className="section-title">My Appointments</h2>
            </div>
            {loading ? (
              <p className="loading-state">Loading appointments...</p>
            ) : appointments.length > 0 ? (
              <div className="appointments-container custom-scrollbar">
                {appointments.map((appointment) => (
                  <div key={appointment._id} className="appointment-card">
                    <h3 className="appointment-doctor">
                      Appointment ID:{appointment._id}
                    </h3>
                    <p className="appointment-date">
                      Date:{" "}
                      {new Date(appointment.appointmentDate).toLocaleString()}
                    </p>
                    <p className="appointment-status">
                      Status:{" "}
                      <span className={`status-${appointment.status}`}>
                        {appointment.status}
                      </span>
                    </p>
                    {appointment.responseMessage && (
                      <p className="appointment-message">
                        Message: {appointment.responseMessage}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No appointments found.</p>
            )}
          </section>
        );

      case "notifications":
        return (
          <section className="dashboard-section notifications-section">
            <div className="section-header">
              <h2 className="section-title">Notifications</h2>
              <button
                className="dashboard-btn btn-primary"
                onClick={markAllAsRead}
              >
                Mark All as Read
              </button>
            </div>
            {loading ? (
              <p className="loading-state">Loading notifications...</p>
            ) : notifications.length > 0 ? (
              <div className="notifications-list custom-scrollbar">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`notification-item ${
                      notification.read ? "read" : "unread"
                    }`}
                  >
                    <p className="notification-message">
                      {notification.message}
                    </p>
                    <span className="notification-time">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No notifications found.</p>
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
          <h2 className="sidebar-title">User Dashboard</h2>
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
                activeSection === "appointments" ? "active" : ""
              }`}
              onClick={() => setActiveSection("appointments")}
            >
              My Appointments
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

export default UserDashboard;
