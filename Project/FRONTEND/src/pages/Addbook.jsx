import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navebar from '../component/Navebar';

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pubdate, setPubdate] = useState('');
  const [genre, setGenre] = useState('Fiction');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();

    // Create a new FormData object to handle the file and text data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('genre', genre);
    formData.append('description', description);
    formData.append('pubdate', pubdate);
    if (file) formData.append('file', file);

    try {
      const res = await fetch('http://127.0.0.1:3000/addbook', {
        method: 'POST',
        body: formData, // Send form data with file
      });

      if (res.status === 201) {
        alert('Book added successfully');
        navigate('/view-book');  
      } else {
        alert('Failed to add book');
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  return (
    <>
    <Navebar/>
    <section className="bg-white mb-20">
      <div className="container mx-auto max-w-2xl py-4">
        <div className="bg-slate-100 px-6 py-8 shadow-md rounded-md border m-4 md:m-0">
          <form onSubmit={submitForm}>
            <h2 className="text-3xl text-green-800 text-center font-semibold mb-6">Add Book</h2>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Book Title</label>
              <input
                type="text"
                className="border rounded w-full py-2 px-3 mb-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Author</label>
              <input
                type="text"
                className="border rounded w-full py-2 px-3 mb-2"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Published Date</label>
              <input
                type="date"
                className="border rounded w-full py-2 px-3 mb-2"
                value={pubdate}
                onChange={(e) => setPubdate(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Genre</label>
              <select
                className="border rounded w-full py-2 px-3"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
              >
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Romance">Romance</option>
                <option value="Thriller">Thriller</option>
                <option value="Mystery">Mystery</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Description</label>
              <textarea
                className="border rounded w-full py-2 px-3 mb-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Image Upload</label>
              <input
                type="file"
                accept="image/*"
                className="border rounded w-full py-2 px-3 mb-2"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>

            <button
              type="submit"
              className="bg-red-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full w-full"
            >
              Add Book
            </button>
          </form>
        </div>
      </div>
    </section>
    </>
  );
};

export default AddBook;
