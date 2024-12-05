import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../pages/Navbar";
import Footer from "../pages/footer";
import "../styles/Dashboard.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const DoctorDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [notifications, setNotifications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctorStats, setDoctorStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const doctorId = useSelector((state) => state.auth.doctorId);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [rescheduledAppointments, setRescheduledAppointments] = useState([]);
  const [cancelledAppointments, setCancelledAppointments] = useState([]);

  // Fetch data function moved to outer scope
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

      // Fetch pending appointments
      const pendingResponse = await axios.get(
        `${REACT_APP_BACKEND_URL}/api/appointments/doctor/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch approved appointments
      const approvedResponse = await axios.get(
        `${REACT_APP_BACKEND_URL}/api/appointments/doctor/approved-appointments/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const pendingAppointments = pendingResponse.data;
      const approvedAppointments = approvedResponse.data;
      const allAppointments = [...pendingAppointments, ...approvedAppointments];

      // Calculate today's appointments
      const today = new Date().toDateString();
      const todayAppointments = approvedAppointments.filter(
        (apt) => new Date(apt.appointmentDate).toDateString() === today
      );

      // Calculate this week's appointments
      const thisWeek = new Date();
      thisWeek.setDate(thisWeek.getDate() - 7);
      const weeklyAppointments = approvedAppointments.filter(
        (apt) => new Date(apt.appointmentDate) >= thisWeek
      );

      setAppointments(allAppointments);

      // Set doctor stats
      setDoctorStats({
        totalAppointments: approvedAppointments.length,
        todayAppointments: todayAppointments.length,
        weeklyAppointments: weeklyAppointments.length,
        pendingAppointments: pendingAppointments.length,
      });

      // Fetch upcoming appointments
      const upcomingResponse = await axios.get(
        `${REACT_APP_BACKEND_URL}/api/appointments/doctor/approved-appointments/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUpcomingAppointments(upcomingResponse.data);

      // Fetch completed appointments
      const completedResponse = await axios.get(
        `${REACT_APP_BACKEND_URL}/api/appointments/doctor/completed-appointments/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCompletedAppointments(completedResponse.data);

      // Fetch rescheduled appointments
      const rescheduledResponse = await axios.get(
        `${REACT_APP_BACKEND_URL}/api/appointments/doctor/rescheduled-appointments/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRescheduledAppointments(rescheduledResponse.data);

      // Fetch cancelled appointments
      const cancelledResponse = await axios.get(
        `${REACT_APP_BACKEND_URL}/api/appointments/doctor/cancelled-appointments/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCancelledAppointments(cancelledResponse.data);
      console.log("Cancelled Appointments Response:", cancelledResponse.data); // Log the response
    } catch (error) {
      setError("Error fetching data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [doctorId]);

  const handleMarkComplete = async (appointmentId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `${REACT_APP_BACKEND_URL}/api/appointments/appointment/${appointmentId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData(); // Now accessible
    } catch (error) {
      alert("Error marking appointment as completed");
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `${REACT_APP_BACKEND_URL}/api/appointments/appointment/${appointmentId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (error) {
      alert("Error cancelling appointment");
    }
  };

  const handleRescheduleAppointment = async (appointmentId, newDate) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `${REACT_APP_BACKEND_URL}/api/appointments/doctors/appointments/${appointmentId}/reschedule`,
        { newAppointmentDate: newDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (error) {
      alert("Error rescheduling appointment");
    }
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

  const handleUpdateProfileClick = () => {
    navigate("/update-profile");
  };

  const filteredAppointments = appointments.filter((appointment) => {
    return (
      appointment._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const renderActiveSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <section className="dashboard-section stats-section">
            <h2 className="section-title">Dashboard Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Today's Appointments</h3>
                <p>{doctorStats?.todayAppointments || 0}</p>
              </div>
              <div className="stat-card">
                <h3>This Week's Appointments</h3>
                <p>{doctorStats?.weeklyAppointments || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Total Appointments</h3>
                <p>{doctorStats?.totalAppointments || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Appointments</h3>
                <p>{doctorStats?.pendingAppointments || 0}</p>
              </div>
            </div>
          </section>
        );

      case "appointments":
        return (
          <section className="dashboard-section appointments-section">
            <div className="section-header">
              <h2 className="section-title">Appointments</h2>
              <div className="appointment-tabs">
                <button
                  className={`tab-btn ${
                    activeTab === "upcoming" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("upcoming")}
                >
                  Upcoming
                </button>
                <button
                  className={`tab-btn ${
                    activeTab === "completed" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("completed")}
                >
                  Completed
                </button>
                <button
                  className={`tab-btn ${
                    activeTab === "rescheduled" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("rescheduled")}
                >
                  Rescheduled
                </button>
                <button
                  className={`tab-btn ${
                    activeTab === "cancelled" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("cancelled")}
                >
                  Cancelled
                </button>
              </div>
            </div>

            {loading ? (
              <p className="loading-state">Loading appointments...</p>
            ) : (
              <div className="appointments-container custom-scrollbar">
                {activeTab === "upcoming" &&
                  upcomingAppointments.map((appointment) => (
                    <div key={appointment._id} className="appointment-card">
                      <div className="appointment-header">
                        <h3>Patient: {appointment.user.email}</h3>
                        <span className={`status-badge ${appointment.status}`}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="appointment-details">
                        <p>
                          Date:{" "}
                          {new Date(
                            appointment.appointmentDate
                          ).toLocaleString()}
                        </p>
                        <button
                          className="complete-btn"
                          onClick={() => handleMarkComplete(appointment._id)}
                        >
                          Mark as Completed
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() =>
                            handleCancelAppointment(appointment._id)
                          }
                        >
                          Cancel Appointment
                        </button>
                        <button
                          className="reschedule-btn"
                          onClick={() =>
                            handleRescheduleAppointment(
                              appointment._id,
                              new Date()
                            )
                          } // Replace with actual new date
                        >
                          Reschedule Appointment
                        </button>
                      </div>
                    </div>
                  ))}
                {activeTab === "completed" &&
                  completedAppointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="appointment-card completed"
                    >
                      <div className="appointment-header">
                        <h3>Patient: {appointment.user.email}</h3>
                      </div>
                      <div className="appointment-details">
                        <p>
                          Appointment Date:{" "}
                          {new Date(
                            appointment.appointmentDate
                          ).toLocaleString()}
                        </p>
                        <p>
                          Completed:{" "}
                          {new Date(appointment.completedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                {activeTab === "rescheduled" &&
                  rescheduledAppointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="appointment-card rescheduled"
                    >
                      <div className="appointment-header">
                        <h3>Patient: {appointment.user.email}</h3>
                      </div>
                      <div className="appointment-details">
                        <p>
                          Appointment Date:{" "}
                          {new Date(
                            appointment.appointmentDate
                          ).toLocaleString()}
                        </p>
                        <p>
                          Rescheduled:{" "}
                          {new Date(appointment.rescheduledAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                {activeTab === "cancelled" &&
                  cancelledAppointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="appointment-card cancelled"
                    >
                      <div className="appointment-header">
                        <h3>Patient: {appointment.user.email}</h3>
                      </div>
                      <div className="appointment-details">
                        <p>
                          Appointment Date:{" "}
                          {new Date(
                            appointment.appointmentDate
                          ).toLocaleString()}
                        </p>
                        <p>
                          Cancelled:{" "}
                          {new Date(appointment.cancelledAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
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

      case "profile":
        return (
          <section className="dashboard-section profile-section">
            <div className="section-header">
              <h2 className="section-title">Doctor Profile</h2>
              <button
                className="dashboard-btn btn-primary"
                onClick={handleUpdateProfileClick}
              >
                Update Profile
              </button>
            </div>
            {/* Add profile content here */}
          </section>
        );

      case "completedAppointments":
        return (
          <section className="dashboard-section completed-appointments-section">
            <h2 className="section-title">Completed Appointments</h2>
            {loading ? (
              <p className="loading-state">Loading completed appointments...</p>
            ) : completedAppointments.length > 0 ? (
              <div className="appointments-container custom-scrollbar">
                {completedAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="appointment-card completed"
                  >
                    <div className="appointment-header">
                      <h3>Patient: {appointment.user.email}</h3>
                    </div>
                    <div className="appointment-details">
                      <p>
                        Appointment Date:{" "}
                        {new Date(appointment.appointmentDate).toLocaleString()}
                      </p>
                      <p>
                        Completed:{" "}
                        {new Date(appointment.completedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No completed appointments found.</p>
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
          <h2 className="sidebar-title">Doctor Dashboard</h2>
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
              Appointments
            </li>
            <li
              className={`sidebar-item ${
                activeSection === "notifications" ? "active" : ""
              }`}
              onClick={() => setActiveSection("notifications")}
            >
              Notifications
            </li>
            <li
              className={`sidebar-item ${
                activeSection === "profile" ? "active" : ""
              }`}
              onClick={() => setActiveSection("profile")}
            >
              Profile
            </li>
          </ul>
        </div>
        <div className="main-content">{renderActiveSection()}</div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorDashboard;
