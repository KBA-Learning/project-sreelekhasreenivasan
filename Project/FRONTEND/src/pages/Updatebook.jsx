import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navebar from "../component/Navebar";

const Updatebook = () => {

  const { id } = useParams();
  const [book, setBook] = useState({
    bookName: "",
    author: "",
    genre: "",
    publishedDate: "",
    description: "",
    imageUrl: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3000/book/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch book details");
        }
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError("Failed to load book details.");
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:3000/updatebook/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });

      if (!response.ok) {
        throw new Error("Failed to update book");
      }

      const updatedBook = await response.json();
      console.log(updatedBook);

      navigate('/view-book'); // Redirect to the book view page after updating

    } catch (error) {
      console.error("Error updating book:", error);
      setError("Failed to update the book.");
    }
  };

  return (
    <>
    <Navebar/>

    <div className="max-w-lg mx-auto p-4">
      
      <h1 className="text-2xl font-bold mb-4">Update Book</h1>

        <form onSubmit={handleSubmit}>

          <div className="mb-4">

            <label htmlFor="bookName" className="block text-sm font-medium text-gray-700">
              Book Name
            </label>
            <input
              type="text"
              id="bookName"
              name="bookName"
              value={book.bookName}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="author" className="block text-sm font-medium text-gray-700">
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={book.author}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
              Genre
            </label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={book.genre}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-700">
              Published Date
            </label>
            <input
              type="date"
              id="publishedDate"
              name="publishedDate"
              value={book.publishedDate}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={book.description}
              onChange={handleChange}
              rows="4"
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            ></textarea>
          </div>


          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Update Book
          </button>
        </form>
      
    </div>
    </>
  );
};

export default Updatebook;
