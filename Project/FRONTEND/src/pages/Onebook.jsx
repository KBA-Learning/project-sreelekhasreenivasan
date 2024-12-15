import React, { useState, useEffect } from "react";
import Navebar from "../component/Navebar";
import { useParams, useNavigate, Link } from "react-router-dom";

const Onebook = () => {
  const { id } = useParams(); 
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]); 
  const [newReview, setNewReview] = useState({ rating: "", review: "" });
  const [error, setError] = useState(""); 
  const navigate = useNavigate();


  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const bookResponse = await fetch(`http://127.0.0.1:3000/book/${id}`);
        if (!bookResponse.ok) {
          throw new Error("Failed to fetch book details");
        }
        const bookData = await bookResponse.json();
        setBook(bookData);

        const reviewsResponse = await fetch(
          `http://127.0.0.1:3000/reviews/${id}`
        );
        if (!reviewsResponse.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const reviewsData = await reviewsResponse.json();
        console.log(reviewsData);

        setReviews(reviewsData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchBookData();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3000/deletebook/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      navigate("/view-book");
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const response = await fetch(`http://127.0.0.1:3000/reviews/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit review");
      }

      const addedReview = await response.json();
      setReviews([...reviews, addedReview]); 
      setNewReview({ rating: "", review: "" }); 
    } catch (error) {
      setError(error.message);
    }
  };

  const updateReview = async (reviewId, updatedData) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/reviews/${reviewId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update review");
      }

      const updatedReview = await response.json();

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId ? { ...review, ...updatedData } : review
        )
      );
      alert("Review updated successfully!");
    } catch (error) {
      console.error("Error updating review:", error);
      alert(`Failed to update review: ${error.message}`);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/reviews/${reviewId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      setReviews(reviews.filter((review) => review._id !== reviewId)); 
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const userType = localStorage.getItem("userType");

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
                <p>Description: {book.description}</p>
              </div>
            </div>
            <div>
              {userType === "ADMIN" && (
                <button className="bg-blue-500 t mt-4 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none">
                  <Link to={`/update-book/${book._id}`}>Update</Link>
                </button>
              )}
              {userType === "ADMIN" && (
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white p-2 rounded-md ml-4 hover:bg-red-600 focus:outline-none"
                >
                  Delete
                </button>
              )}
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}

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

            {error && <p className="text-red-500">{error}</p>}

            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none"
            >
              Submit Review
            </button>
          </form>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-bold mb-4">Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review._id}
                className=" flex justify-between items-center p-4 border-b border-gray-200 last:border-none"
              >
                <p className="text-sm text-gray-600">
                  Rating: {review.rating} ⭐
                </p>
                <p className="mt-2">{review.review}</p>
                <div className="mt-4 space-x-2">
                  <button
                    onClick={() => {
                      const newRating = prompt(
                        "Enter new rating (1-5):",
                        review.rating
                      );
                      const newReview = prompt(
                        "Enter new review:",
                        review.review
                      );
                      if (newRating && newReview) {
                        updateReview(review._id, {
                          rating: newRating,
                          review: newReview,
                        });
                      }
                    }}
                    className=" text-orange-500 p-1 rounded-md hover:undetline focus:outline-none"
                  >
                    Edit my review
                  </button>
                  {userType === "ADMIN" && (

                  <button
                    onClick={() => deleteReview(review._id)}
                    className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600 focus:outline-none"
                  >
                    Delete
                  </button>
                  )}
                </div>
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
