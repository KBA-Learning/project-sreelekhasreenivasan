import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import Navebar from '../component/Navebar';

const Viewbook = () => {
  const genres = [
    { name: "Fantasy", image: "/Images/17fatbooks-articleLarge.webp" },
    { name: "Fiction", image: "/Images/17fatbooks-articleLarge.webp" },
    { name: "Non-Fiction", image: "/Images/17fatbooks-articleLarge.webp" },
    { name: "Romance", image: "/Images/17fatbooks-articleLarge.webp" },
    { name: "Mystery", image: "/Images/17fatbooks-articleLarge.webp" },
    { name: "Thriller", image: "/Images/17fatbooks-articleLarge.webp" },
  ];

  const [books, setBooks] = useState([]); 

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3000/viewbooks'); 
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json(); 
        console.log(data);
        
        setBooks(data); // save the book data intp books using setBooks
      } catch (error) {
        console.error('Error fetching books:', error);
      } 
    };

    fetchBooks();
  });

  return (
    <>
      <Navebar />
      <section className="bg-gray-100 p-4">
        <div className="mt-8 mx-auto">
          <div className="flex justify-center mb-6 gap-4">
            {genres.map((genreItem) => (
              <button
                key={genreItem.name}
                style={{
                  backgroundImage: `url(${genreItem.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                className="text-white p-4 rounded-md w-52 h-32 flex items-center justify-center hover:bg-opacity-80 focus:outline-none focus:ring-4 focus:ring-purple-400 transition-opacity duration-300"
              >
                <span className="font-bold text-xl text-center">{genreItem.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-100 p-4">
        <div className="container mx-auto">
          <div className="flex justify-center mb-6">
            <input
              type="text"
              placeholder="Search by Title, Author, Genre, or Published Date..."
              className="p-3 w-full max-w-2xl border border-gray-300 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </section>

      {/* Book Details Section */}
      <section className="bg-white p-4 mt-8">
        <div className="container mx-auto">
        
            <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {books.map((book) => (
                <div key={book._id} className="border border-gray-300 p-4 rounded-lg shadow-lg">
                  <img
                    src={`http://127.0.0.1:3000${book.imageUrl}`}
                    alt={book.bookName}
                    className="w-full h-32 rounded-md"
                  />
                  <p className="text-xl font-semibold mt-4">Title: {book.bookName}</p>
                  <p className="text-gray-700 mt-2">Author: {book.author}</p>
                  <p className="text-gray-500 mt-2">Genre: {book.genre}</p>
                  <p className="text-gray-600 mt-2">Published date: {book.publishedDate}</p>

                  <Link
                    to={`/one-book/${book._id}`} // This links to the Book Detail page
                    className="bg-blue-500 ml-28 text-white p-2 rounded-md mt-4 inline-block hover:bg-blue-600 focus:outline-none"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          
        </div>
      </section>
    </>
  );
};

export default Viewbook;
