import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Navbar from "../pages/Navbar";
import Footer from "../pages/footer";
import "../styles/BecomeADoctor.css";
import TimePicker from "react-time-picker";
import Select from "react-select";

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const BecomeADoctor = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [availability, setAvailability] = useState([]);
  const [qualifications, setQualifications] = useState([""]);
  const [experience, setExperience] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [clinicCity, setClinicCity] = useState("");
  const [clinicPinCode, setClinicPinCode] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [consultationMode, setConsultationMode] = useState(""); // Fixed this line
  const [startTimings, setStartTimings] = useState("10:00");
  const [endTimings, setEndTimings] = useState("18:00");
  const [startPeriod, setStartPeriod] = useState("AM");
  const [endPeriod, setEndPeriod] = useState("PM");
  const [profilePic, setProfilePic] = useState(null);

  const user = useSelector((state) => state.auth.user);

  const availabilityOptions = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" },
  ];

  const handleAddQualification = () => {
    setQualifications([...qualifications, ""]);
  };

  const handleRemoveQualification = (index) => {
    const newQualifications = qualifications.filter((_, i) => i !== index);
    setQualifications(newQualifications);
  };

  const handleQualificationChange = (index, value) => {
    const newQualifications = qualifications.slice();
    newQualifications[index] = value;
    setQualifications(newQualifications);
  };

  const handleAvailabilityChange = (selectedOptions) => {
    setAvailability(selectedOptions.map((option) => option.value));
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

  const requestDoctorStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to submit a request.");
      return;
    }

    const startTiming24 = convertTo24HourFormat(startTimings, startPeriod);
    const endTiming24 = convertTo24HourFormat(endTimings, endPeriod);

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("specialty", specialty);
    formData.append("availability", JSON.stringify(availability));
    formData.append("qualifications", JSON.stringify(qualifications));
    formData.append("experience", experience);
    formData.append("fullAddress", fullAddress);
    formData.append("clinicAddress", clinicAddress);
    formData.append("clinicCity", clinicCity);
    formData.append("clinicPinCode", clinicPinCode);
    formData.append("timings[start]", startTiming24); // Changed here
    formData.append("timings[end]", endTiming24); // Changed here
    formData.append("PhoneNo", PhoneNo);
    formData.append("consultationFee", consultationFee);
    formData.append("consultationMode", consultationMode);
    formData.append("state", state);
    formData.append("city", city);
    formData.append("pinCode", pinCode);
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    try {
      const response = await axios.post(
        `${REACT_APP_BACKEND_URL}/api/doctor-requests/request`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Reset form fields
      setFirstName("");
      setLastName("");
      setSpecialty("");
      setAvailability([]);
      setQualifications([""]);
      setExperience("");
      setFullAddress("");
      setClinicAddress("");
      setClinicCity("");
      setClinicPinCode("");
      setPhoneNo("");
      setState("");
      setCity("");
      setPinCode("");
      setConsultationFee("");
      setConsultationMode(""); // Reset consultation mode
      setStartTimings("10:00");
      setEndTimings("18:00");
      setStartPeriod("AM");
      setEndPeriod("PM");
      setProfilePic(null);

      alert("Your request to become a doctor has been submitted!");
    } catch (error) {
      alert("Error submitting request. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <main>
        <section id="become-doctor">
          <h2>Request to Become a Doctor</h2>

          <div className="section-header">Personal Details</div>
          <div className="personal-details">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={PhoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
            />
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type="number"
              placeholder="Pin code"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
            />
            <input
              type="text"
              placeholder="Address"
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePic(e.target.files[0])}
          />

          <div className="section-header">Professional Details</div>
          <div className="professional-details">
            <input
              type="text"
              placeholder="Specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            />
            <Select
              isMulti
              options={availabilityOptions}
              value={availabilityOptions.filter((option) =>
                availability.includes(option.value)
              )}
              onChange={handleAvailabilityChange}
              placeholder="Select Availability"
            />
            <input
              type="number"
              placeholder="Experience (in years)"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              min="0"
            />
            <input
              type="number"
              placeholder="Consulation Fee(in Ruppees)"
              value={consultationFee}
              onChange={(e) => setConsultationFee(e.target.value)}
              min="0"
            />
            <input
              type="text"
              placeholder="Consultation Mode"
              value={consultationMode}
              onChange={(e) => setConsultationMode(e.target.value)}
            />

            <input
              type="text"
              placeholder="City for Clinic"
              value={clinicCity}
              onChange={(e) => setClinicCity(e.target.value)}
            />
            <input
              type="number"
              placeholder="Pin Code for Clinic"
              value={clinicPinCode}
              onChange={(e) => setClinicPinCode(e.target.value)}
            />
            <input
              type="text"
              placeholder="Clinic Full Address"
              value={clinicAddress}
              onChange={(e) => setClinicAddress(e.target.value)}
            />

            <div className="timing-picker">
              <TimePicker
                onChange={setStartTimings}
                value={startTimings}
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

              <span>To</span>

              <TimePicker
                onChange={setEndTimings}
                value={endTimings}
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

          <div>
            <div className="section-header">Qualifications</div>
            {qualifications.map((qual, index) => (
              <div key={index} className="qualification-field">
                <input
                  type="text"
                  placeholder="Qualification"
                  value={qual}
                  onChange={(e) =>
                    handleQualificationChange(index, e.target.value)
                  }
                />
                {qualifications.length > 1 && (
                  <button onClick={() => handleRemoveQualification(index)}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              className="add-qualification-btn"
              onClick={handleAddQualification}
            >
              Add More
            </button>
          </div>

          <button className="request-doctor-btn" onClick={requestDoctorStatus}>
            Submit Request
          </button>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BecomeADoctor;
