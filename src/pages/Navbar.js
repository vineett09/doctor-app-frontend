import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/features/authSlice";
import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="header">
      <h1 className="header-title">Find Doctors</h1>
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/services">Services</Link>
          </li>
          <li>
            <Link to="/about-us">AboutUs</Link>
          </li>

          <li>
            <Link to="/doctor-list">Doctors</Link>
          </li>
          {user && user.role === "user" && (
            <>
              <li>
                <Link to="/user-dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/become-a-doctor">Serve</Link>
              </li>
            </>
          )}
          {user && user.role === "doctor" && (
            <>
              <li>
                <Link to="/doctor-appointments">Visits</Link>
              </li>
              <li>
                <Link to="/doctor-dashboard">Dashboard</Link>
              </li>
            </>
          )}
          {user && user.role === "admin" && (
            <li>
              <Link to="/admin-dashboard">Dashboard</Link>
            </li>
          )}
        </ul>
      </nav>
      <div className="user-info">
        {user ? (
          <>
            <span>Welcome, {user.email}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
