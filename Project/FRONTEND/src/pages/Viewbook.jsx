import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navebar from '../component/Navebar';

const Viewbook = () => {
  const genres = [
    { name: 'Fantasy', image: '/Images/17fatbooks-articleLarge.webp' },
    { name: 'Fiction', image: '/Images/17fatbooks-articleLarge.webp' },
    { name: 'Non-Fiction', image: '/Images/17fatbooks-articleLarge.webp' },
    { name: 'Romance', image: '/Images/17fatbooks-articleLarge.webp' },
    { name: 'Mystery', image: '/Images/17fatbooks-articleLarge.webp' },
    { name: 'Thriller', image: '/Images/17fatbooks-articleLarge.webp' },
  ];

  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch all books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://127.0.0.1:3000/viewbooks');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []); // Empty dependency array ensures this runs only once

  // Search books by genre
  const searchBook = async (genre) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://127.0.0.1:3000/searchbook/${genre}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch books for genre: ${genre}`);
      }
      const result = await response.json();
      setBooks(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter books by search term
  const filteredBooks = books.filter(
    (book) =>
      book.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navebar />
      <section className="bg-gray-100 p-4">
        <div className="mt-8 mx-auto">
          <div className="flex justify-center mb-6 gap-4">
            {genres.map((genreItem) => (
              <button
                onClick={() => searchBook(genreItem.name)}
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

      {/* Display Error Message */}
      {error && (
        <div className="bg-red-100 text-red-800 border border-red-200 p-4 rounded-md max-w-2xl mx-auto mt-4">
          <p>Error: {error}</p>
        </div>
      )}

      <section className="bg-gray-100 p-4">
        <div className="container mx-auto">
          <div className="flex justify-center mb-6">
            <input
              type="text"
              placeholder="Search by Title, Author, Genre, or Published Date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-3 w-full max-w-2xl border border-gray-300 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </section>

      {/* Book Details Section */}
      <section className="bg-white p-4 mt-8">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center text-lg font-semibold">Loading...</div>
          ) : (
            <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredBooks.map((book) => (
                <div key={book._id} className="border border-gray-300 p-4 rounded-lg shadow-lg">
                  <img
                    src={`http://127.0.0.1:3000${book.imageUrl}`}
                    alt={book.bookName}
                    className="w-32 h-32 rounded-md object-cover"
                  />
                  <p className="text-xl font-semibold mt-4">Title: {book.bookName}</p>
                  <p className="text-gray-700 mt-2">Author: {book.author}</p>
                  <p className="text-gray-500 mt-2">Genre: {book.genre}</p>
                  <p className="text-gray-600 mt-2">Published date: {book.publishedDate}</p>

                  <Link
                    to={`/one-book/${book._id}`}
                    className="bg-blue-500 text-white p-2 rounded-md mt-4 inline-block hover:bg-blue-600 focus:outline-none"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Viewbook;
