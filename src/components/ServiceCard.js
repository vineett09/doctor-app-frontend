// src/components/ServiceCard.js
import React from "react";
import "../styles/ServiceCard.css"; // Create this CSS file for styles

const ServiceCard = ({ service }) => {
  return (
    <div className="service-card">
      <h3>{service.title}</h3>
      <p>{service.description}</p>
    </div>
  );
};

export default ServiceCard;
