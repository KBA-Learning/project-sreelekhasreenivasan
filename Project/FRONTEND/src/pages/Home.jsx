import Main from "../component/Main";
import About from "../component/About";
import Contact from "../component/Contact";
import Navebar2 from "../component/Navebar2";
import React, { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom'


const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate=useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true); 
    } else {
      setIsLoggedIn(false);
    }
  }, []);

 useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3000/viewbooks"); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json(); 
        console.log(data);

        setBooks(data); 
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleViewClick = (bookId) => {
    if (!isLoggedIn) {
      alert('Please log in to view the book details');
      navigate('/login')
      
    } else {
      navigate = (`/one-book/${bookId}`); 
    }
  };

  return (
    <>
      <Navebar2 />
      <Main />
      <section className="bg-white p-4 mt-8">
        <div className="container mx-auto">
          {loading ? (
            <p className="text-center text-gray-500">Loading books...</p>
          ) : (
            <div className="grid grid-cols-6 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {books.map((book) => (
                <div
                  key={book._id}
                  className="border border-gray-300 p-4 rounded-lg shadow-lg"
                >
                  <img
                    src={`http://127.0.0.1:3000${book.imageUrl}`}
                    alt={book.bookName}
                    className="w-full h-32 rounded-md"
                  />
                  <p className="text-xl font-semibold mt-4">
                    Title: {book.bookName}
                  </p>
                  <p className="text-gray-700 mt-2">Author: {book.author}</p>
                  <p className="text-gray-500 mt-2">Genre: {book.genre}</p>

                  <button
                  onClick={() => handleViewClick(book._id)} 
                  className="bg-blue-500 text-white p-2 rounded-md mt-4 inline-block hover:bg-blue-600 focus:outline-none"
                >
                  View
                </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <About />
      <Contact />
    </>
  );
};

export default Home;
