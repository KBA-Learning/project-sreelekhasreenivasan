import React, { useState } from 'react';
import Navebar from '../component/Navebar';

const Addreview = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    bookTitle: '',
    author: '',
    genre: '',
    rating: '',
    review: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const submitReview = async (e) => {
    e.preventDefault(); 
    console.log(formData);
    

    try {
      const response = await fetch('http://127.0.0.1:3000/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Review submitted successfully!');
        setFormData({
          bookTitle: '',
          author: '',
          genre: '',
          rating: '',
          review: ''
        });
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('There was an error submitting your review. Please try again later.');
    }
  };

  return (
    <>
      <Navebar />
      <div className='bg-cover bg-center h-screen opacity-85 flex items-center justify-center'
        style={{ backgroundImage: "url('/Images/bg.jpg')" }}>

        <div className="w-max bg-black opacity-80 p-6 pt-10">
          <form onSubmit={submitReview}>
            <div className="mb-4">
              <label className="block text-blue-500 font-semibold">Book Title:</label>
              <input
                type="text"
                name="bookTitle"
                value={formData.bookTitle}
                placeholder="Enter book title"
                className="w-full rounded-sm"
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-blue-500 font-semibold">Author:</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                placeholder="Enter author's name"
                className="w-full rounded-sm"
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-blue-500 font-semibold">Genre:</label>
              <select
                name="genre"
                value={formData.genre}
                className="w-full rounded-sm"
                onChange={handleInputChange}
                required
              >
                <option value="">Select a genre</option>
                <option>Fiction</option>
                <option>Non-Fiction</option>
                <option>Fantasy</option>
                <option>Romance</option>
                <option>Mystery</option>
                <option>Thriller</option>
                <option>Science Fiction</option>
                <option>Historical</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-blue-500 font-semibold">Rating:</label>
              <div className="flex space-x-4">
                {['1', '2', '3', '4', '5'].map((star) => (
                  <label key={star} className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      value={star}
                      checked={formData.rating === star}
                      onChange={handleInputChange}
                      required
                    />
                    <span className="ml-2 text-red-700">{star} ⭐</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-blue-500 font-semibold">Your Review:</label>
              <textarea
                name="review"
                value={formData.review}
                placeholder="Write your review here"
                rows="4"
                className="w-full rounded-sm"
                onChange={handleInputChange}
                required
              ></textarea>
            </div>

            <div className="flex justify-center bg-green-500 w-32 ml-24 rounded-sm">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Addreview;
