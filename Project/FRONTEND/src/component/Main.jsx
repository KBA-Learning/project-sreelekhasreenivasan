import React, { useState, useEffect } from 'react';
import { useNavigate} from "react-router-dom";


const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true); 
    } else {
      setIsLoggedIn(false);
    }
  }, []); 

  const handleExploreClick = () => {
    if (!isLoggedIn) {
      alert('Please log in to explore books'); 
      navigate('/login')
    } else {
      navigate('/view-book');
    }
  }

  return (
    <div
      className="bg-cover bg-center h-screen bg-fixed relative flex items-center justify-center"
      style={{ backgroundImage: "url('/Images/main.gif')" }}
    >
      <div className="overlay absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50"></div>
      <div className="w-3/4 text-center relative z-10">
        <h1 className="text-5xl font-extrabold mb-6 text-indigo-800">
          Find Your Next Adventure
        </h1>
        <h2 className="text-3xl mb-6 italic text-indigo-500">
          Books that Speak to Your Soul!
        </h2>
        <p className="text-lg mb-10 text-indigo-200 max-w-2xl mx-auto">
          Discover an exquisite collection of the latest bestsellers and timeless classics, handpicked with care to
          perfectly complement your unique style and refined tastes.
        </p>
        <button
          onClick={handleExploreClick} 
          className="bg-red-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-400 transition"
        >
          Explore
        </button>
      </div>
    </div>
  )
}

export default Main