import React, { useState, useEffect } from "react";
import Navebar from "../component/Navebar";
import { useParams, useNavigate, Link } from "react-router-dom";

const Onebook = () => {
  const { id } = useParams(); // Fetch book ID from URL
  const [book, setBook] = useState(null); // Book details
  const [reviews, setReviews] = useState([]); // List of reviews
  const [newReview, setNewReview] = useState({ rating: "", review: "" }); // Review form data
  const navigate = useNavigate();

  // Fetch book details and reviews
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        // Fetch book details
        const bookResponse = await fetch(`http://127.0.0.1:3000/book/${id}`);
        if (!bookResponse.ok) {
          throw new Error("Failed to fetch book details");
        }
        const bookData = await bookResponse.json();
        setBook(bookData);

        // Fetch reviews for the book
        const reviewsResponse = await fetch(`http://127.0.0.1:3000/reviews/${id}`);
        if (!reviewsResponse.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchBookData();
  }, [id]);

  // Handle review form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  // Submit a new review
  const submitReview = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://127.0.0.1:3000/reviews/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const addedReview = await response.json();
      setReviews([...reviews, addedReview]); // Update the reviews list with the new review
      setNewReview({ rating: "", review: "" }); // Clear the form
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3000/deletebook/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      navigate("/view-book");
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <>
      <Navebar />
      <div className="mx-auto p-4">
        {book ? (
          <>
            <div className="flex">
              <img
                src={`http://127.0.0.1:3000${book.imageUrl}`}
                alt={book.bookName}
                className="w-96 h-80 rounded-md"
              />
              <div className="pt-20 pl-4">
                <h1 className="text-2xl font-bold mb-4">{book.bookName}</h1>
                <p>Author: {book.author}</p>
                <p>Genre: {book.genre}</p>
                <p>Published Date: {book.publishedDate}</p>
              </div>
            </div>
            <p>Description: {book.description}</p>

            <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none">
              <Link to={`/update-book/${book._id}`}>Update</Link>
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white p-2 rounded-md ml-4 hover:bg-red-600 focus:outline-none"
            >
              Delete
            </button>
          </>
        ) : (
          <p>Loading...</p>
        )}

        {/* Add Review Section */}
        <div className="mt-10 p-4 bg-gray-100 rounded-md">
          <h2 className="text-lg font-bold mb-4">Add Your Review</h2>
          <form onSubmit={submitReview}>
            <div className="mb-4">
              <label className="block text-gray-700">Rating:</label>
              <div className="flex space-x-2">
                {["1", "2", "3", "4", "5"].map((star) => (
                  <label key={star} className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      value={star}
                      checked={newReview.rating === star}
                      onChange={handleInputChange}
                      required
                    />
                    <span className="ml-2 text-yellow-500">{star} ⭐</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Review:</label>
              <textarea
                name="review"
                value={newReview.review}
                onChange={handleInputChange}
                placeholder="Write your review here"
                className="w-full p-2 border rounded-md"
                rows="4"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none"
            >
              Submit Review
            </button>
          </form>
        </div>

        {/* Display Reviews Section */}
        <div className="mt-10">
          <h2 className="text-lg font-bold mb-4">Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div
                key={index}
                className="p-4 border-b border-gray-200 last:border-none"
              >
                <p className="text-sm text-gray-600">Rating: {review.rating} ⭐</p>
                <p className="mt-2">{review.review}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Onebook;
