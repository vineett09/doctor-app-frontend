// DoctorProfileUpdate.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import TimePicker from "react-time-picker";
import Select from "react-select";
import "../styles/DoctorProfileUpdate.css";

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const DoctorProfileUpdate = () => {
  const [doctorData, setDoctorData] = useState({
    firstName: "",
    lastName: "",
    specialty: "",
    availability: [],
    qualifications: [],
    experience: 0,
    fullAddress: "",
    clinicAddress: "",
    clinicCity: "",
    clinicPinCode: 0,
    state: "",
    city: "",
    pinCode: 0,
    timings: {
      start: "10:00",
      end: "18:00",
    },
    PhoneNo: "",
  });

  const [startPeriod, setStartPeriod] = useState("AM");
  const [endPeriod, setEndPeriod] = useState("PM");
  const doctorId = useSelector((state) => state.auth.doctorId);

  const availabilityOptions = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" },
  ];

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in again.");
        return;
      }

      try {
        const response = await axios.get(
          `${REACT_APP_BACKEND_URL}/api/appointments/${doctorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDoctorData(response.data);
      } catch (error) {
        alert("Error fetching doctor profile.");
      }
    };

    fetchDoctorProfile();
  }, [doctorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorData({ ...doctorData, [name]: value });
  };

  const handleAvailabilityChange = (selectedOptions) => {
    setDoctorData({
      ...doctorData,
      availability: selectedOptions.map((option) => option.value),
    });
  };

  const convertTo24HourFormat = (time, period) => {
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }

    const startTiming24 = convertTo24HourFormat(
      doctorData.timings.start,
      startPeriod
    );
    const endTiming24 = convertTo24HourFormat(
      doctorData.timings.end,
      endPeriod
    );

    const updatedData = {
      ...doctorData,
      timings: {
        start: startTiming24,
        end: endTiming24,
      },
    };

    try {
      await axios.put(
        `${REACT_APP_BACKEND_URL}/api/appointments/${doctorId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Error updating profile. Please try again.");
    }
  };

  return (
    <div className="doctor-profile-container">
      <form onSubmit={handleSubmit}>
        <h4>Personal Details</h4>
        <div className="input-group">
          <label className="label">First Name</label>
          <input
            type="text"
            name="firstName"
            value={doctorData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label className="label">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={doctorData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label className="label">Contact Number</label>
          <input
            type="text"
            name="PhoneNo"
            value={doctorData.PhoneNo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label className="label">State</label>
          <input
            type="text"
            name="state"
            value={doctorData.state}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label className="label">City</label>
          <input
            type="text"
            name="city"
            value={doctorData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label className="label">Pin Code</label>
          <input
            type="number"
            name="pinCode"
            value={doctorData.pinCode}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label className="label">Full Address</label>
          <input
            type="text"
            name="fullAddress"
            value={doctorData.fullAddress}
            onChange={handleChange}
            required
          />
        </div>

        <div className="professional-details">
          <h4>Professional Details</h4>

          <div className="input-group">
            <label className="label">Specialty</label>
            <input
              type="text"
              name="specialty"
              value={doctorData.specialty}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label className="label">Availability</label>
            <Select
              isMulti
              options={availabilityOptions}
              value={availabilityOptions.filter((option) =>
                doctorData.availability.includes(option.value)
              )}
              onChange={handleAvailabilityChange}
              placeholder="Select Availability"
            />
          </div>

          <div className="input-group">
            <label className="label">Experience (in years)</label>
            <input
              type="number"
              name="experience"
              value={doctorData.experience}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="input-group">
            <label className="label">City for Clinic</label>
            <input
              type="text"
              name="clinicCity"
              value={doctorData.clinicCity}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label className="label">Pin Code for Clinic</label>
            <input
              type="number"
              name="clinicPinCode"
              value={doctorData.clinicPinCode}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label className="label">Clinic Full Address</label>
            <input
              type="text"
              name="clinicAddress"
              value={doctorData.clinicAddress}
              onChange={handleChange}
            />
          </div>

          <div className="timing-picker">
            <div className="input-group">
              <label className="label">Start Timing</label>
              <TimePicker
                onChange={(value) =>
                  setDoctorData({
                    ...doctorData,
                    timings: { ...doctorData.timings, start: value },
                  })
                }
                value={doctorData.timings.start}
                clockIcon={null}
                disableClock={true}
              />
              <select
                value={startPeriod}
                onChange={(e) => setStartPeriod(e.target.value)}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>

            <div className="input-group">
              <label className="label">End Timing</label>
              <TimePicker
                onChange={(value) =>
                  setDoctorData({
                    ...doctorData,
                    timings: { ...doctorData.timings, end: value },
                  })
                }
                value={doctorData.timings.end}
                clockIcon={null}
                disableClock={true}
              />
              <select
                value={endPeriod}
                onChange={(e) => setEndPeriod(e.target.value)}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <h4>Qualifications</h4>
          {doctorData.qualifications.map((qual, index) => (
            <div key={index} className="qualification-field">
              <input
                type="text"
                placeholder="Qualification"
                value={qual}
                onChange={(e) => {
                  const newQualifications = [...doctorData.qualifications];
                  newQualifications[index] = e.target.value;
                  setDoctorData({
                    ...doctorData,
                    qualifications: newQualifications,
                  });
                }}
              />
              {doctorData.qualifications.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const newQualifications = doctorData.qualifications.filter(
                      (_, i) => i !== index
                    );
                    setDoctorData({
                      ...doctorData,
                      qualifications: newQualifications,
                    });
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setDoctorData({
                ...doctorData,
                qualifications: [...doctorData.qualifications, ""],
              })
            }
          >
            Add More
          </button>
        </div>

        <button type="submit" className="book-appointment-button">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default DoctorProfileUpdate;
