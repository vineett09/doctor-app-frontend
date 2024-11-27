// src/pages/Register.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginSuccess } from "../redux/features/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // To maintain consistency in toast notifications
import "../styles/RegisterPage.css"; // Import the CSS file

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/auth/register`, {
        email,
        password,
      });
      dispatch(loginSuccess(data));
      navigate("/login");
      toast.success("Registration successful! Please log in.");
    } catch (error) {
      toast.error("Registration failed");
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h4 className="register-title">Create an Account</h4>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="register-input"
              placeholder="Email"
              required
            />
          </div>
          <div className="register-form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="register-input"
              placeholder="Password"
              required
            />
          </div>
          <div className="register-form-group">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="register-input"
              placeholder="Confirm Password"
              required
            />
          </div>
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
        <p className="register-text">
          Already have an account?{" "}
          <span className="register-link" onClick={() => navigate("/login")}>
            Log In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
