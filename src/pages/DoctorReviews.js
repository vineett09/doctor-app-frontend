import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../pages/Navbar";
import Footer from "./footer";
import "../styles/DoctorReviews.css";

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const DoctorReviews = () => {
  const { doctorId } = useParams(); // Retrieve doctor ID from URL
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);

  // Fetch reviews when the component is mounted or doctorId changes
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${REACT_APP_BACKEND_URL}/api/reviews/reviews/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [doctorId]);

  // Handle form submission for a new review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${REACT_APP_BACKEND_URL}/api/reviews/submit-reviews/${doctorId}`,
        { text: newReview, rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReviews([response.data, ...reviews]); // Add the new review to the list
      setNewReview(""); // Clear the input field
      setRating(0); // Reset rating
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="doctor-reviews-container">
        <div className="reviews-section">
          <h2>Reviews and Feedbacks</h2>

          {/* Conditionally render the reviews or a no reviews message */}
          {reviews.length === 0 ? (
            <div>
              <p>No reviews yet.</p>
              <p>Be the first to leave a review!</p>
            </div>
          ) : (
            <ul className="reviews-list">
              {reviews.map((review) => (
                <li key={review._id} className="review-item">
                  <div className="review-info">
                    {/* Rating Stars */}
                    <p className="review-rating">
                      {/* Display full stars for the rating */}
                      {Array.from({ length: 5 }, (_, index) => (
                        <span key={index}>
                          {index < review.rating ? "⭐" : "☆"}
                        </span>
                      ))}
                    </p>

                    {/* Review text */}
                    <p className="review-text">{review.text}</p>

                    {/* Review date */}
                    <p className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Review Form */}
        <div className="review-form">
          <h3>Submit Your Review</h3>
          <form onSubmit={handleSubmitReview}>
            <div>
              <label>Rating: </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                required
              >
                <option value={0}>Select Rating</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>

            <div>
              <label>Review: </label>
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                rows="4"
                required
              />
            </div>

            <button type="submit" disabled={rating === 0 || !newReview}>
              Submit Review
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorReviews;
