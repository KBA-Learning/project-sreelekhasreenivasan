import React, { useState, useEffect } from "react";
import Navebar from "../component/Navebar";
import { useParams, useNavigate } from "react-router-dom";

const AddReview = () => {
  const { id } = useParams(); // Fetch book ID from URL
  const [book, setBook] = useState(null); // Store book details
  const [formData, setFormData] = useState({
    rating: "",
    review: "",
  });
  const navigate = useNavigate(); // To handle navigation

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3000/book/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch book details");
        }
        const data = await response.json();
        setBook(data); // Set fetched book details
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitReview = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const response = await fetch(`http://127.0.0.1:3000/reviews/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Review submitted successfully!");
        setFormData({
          rating: "",
          review: "",
        });
        navigate(`/one-book/${id}`); // Redirect to the book details page
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("There was an error submitting your review. Please try again later.");
    }
  };

  return (
    <>
      <Navebar />
      <div
        className="bg-cover bg-center h-screen opacity-90 flex items-center justify-center"
        style={{ backgroundImage: "url('/Images/bg.jpg')" }}
      >
        <div className="w-max bg-black opacity-85 p-6 pt-10 rounded-lg">
          <h2 className="text-white text-2xl font-bold mb-4 text-center">
            {book ? `Add Review for "${book.bookName}"` : "Loading..."}
          </h2>
          {book && (
            <form onSubmit={submitReview}>
              <div className="mb-4">
                <label className="block text-blue-500 font-semibold">
                  Rating:
                </label>
                <div className="flex space-x-4">
                  {["1", "2", "3", "4", "5"].map((star) => (
                    <label key={star} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value={star}
                        checked={formData.rating === star}
                        onChange={handleInputChange}
                        required
                      />
                      <span className="ml-2 text-yellow-500">{star} ⭐</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-blue-500 font-semibold">
                  Your Review:
                </label>
                <textarea
                  name="review"
                  value={formData.review}
                  placeholder="Write your review here"
                  rows="4"
                  className="w-full rounded-md p-2 bg-gray-200 focus:outline-none"
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-green-500 text-white font-bold p-2 rounded-md hover:bg-green-600 focus:outline-none"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default AddReview;
