import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  
import Navebar from "../component/Navebar"; 

const Search = () => {

  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
 
  const navigate = useNavigate(); 

  const handleSearch = async (e) => {
    e.preventDefault();
  
    // Check if at least one field is filled
    if (!bookTitle && !author && genre === "All Genres" && !publicationYear) {
      alert("Please fill at least one field to perform the search.");
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:3000/books/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookTitle, author }),
      });
  
      const data = await response.json();
  
      if (Array.isArray(data)) {
        if (data.length === 1) {
          // If exactly one book is found, redirect to the Onebook page
          navigate(`/one-book/${data[0]._id}`);
        } else if (data.length > 1) {
          // If multiple books are found, redirect to a list page
          navigate('/view-book', { state: { books: data } });
        } else {
          alert('No books found.');
        }
      } else {
        alert('Unexpected response from server.');
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
