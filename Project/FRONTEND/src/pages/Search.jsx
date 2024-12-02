import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  
import Navebar from "../component/Navebar"; 

const Search = () => {
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("All Genres");
  const [publicationYear, setPublicationYear] = useState("");
  
  const navigate = useNavigate(); 

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/books/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookTitle, author, genre, publicationYear }),
      });
  
      const data = await response.json();
  
      if (Array.isArray(data) && data.length > 0) {
        navigate(`/one-book/${data[0]._id}`, {
          state: data[0],
        });
      } else {
        alert('No books found');
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  return (
    <div className="bg-gray-100">
      <Navebar />
      <div className="bg-cover bg-center h-screen opacity-85 flex items-center justify-center"
        style={{ backgroundImage: "url('/Images/bg.jpg')" }}>
        <div className="w-2/3 px-6 py-8">
          <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md mb-10 mt-4 border border-gray-300">
            <h2 className="text-xl font-semibold mb-4 mt-2 text-indigo-600">Find Your Next Read</h2>

            <div className="mb-4">
              <label className="block font-bold text-gray-700">Book Title:</label>
              <input
                type="text"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                placeholder="Enter the Title"
                className="w-full border border-blue-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold text-gray-700">Author:</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                className="w-full border border-blue-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold text-gray-700">Genre:</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full border border-blue-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
              >
                <option>All Genres</option>
                <option>Fiction</option>
                <option>Non-fiction</option>
                <option>Romance</option>
                <option>Fantasy</option>
                <option>Action</option>
                <option>Thriller</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-bold text-gray-700">Publication Year:</label>
              <input
                type="date"
                value={publicationYear}
                onChange={(e) => setPublicationYear(e.target.value)}
                className="w-full border border-blue-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-center mt-10 mb-4">
              <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Search;
