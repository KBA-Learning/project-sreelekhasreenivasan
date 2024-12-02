import React from 'react'
import insta from '../Images/insta.png'
import fb from '../Images/fb.png'
import twt from '../Images/twitt.png'

const Contact = () => {
  return (
    <section id="contact" className="py-16">
    <div className="flex flex-row md:flex-row md:items-center md:justify-between mb-6">
      <h2 className="text-4xl font-bold text-indigo-800 ml-36 pt-32">Contact Us</h2>
      <div className="w-2/5 bg-white rounded-lg p-8 mt-8">
        <form action="#" className="p-4">
          <div>
            <label
              for="name"
              className="block text-gray-700 font-semibold text-red-600"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full border-b-1 shadow-md border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label
              for="email"
              className="block text-gray-700 font-semibold text-red-600 mt-4"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className="w-full border-b-1 shadow-md border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email address"
              required
            />
          </div>
          <div>
            <label
              for="message"
              className="block text-gray-700 font-semibold text-red-600 mt-4"
            >
              Your Message
            </label>
            <input
              type="text"
              id="message"
              name="message"
              className="w-full border-b-1 shadow-md border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your messages"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-700 transition mt-4"
          >
            Send Message
          </button>
        </form>
      </div>
      <div className='mr-4 ml-4 pt-32'>
      <h3 className="text-1xl text-blue-800">Or get in touch with us</h3>
      <div className='flex ml-6'>
      <img src={insta} alt="insta icon" className='h-10 w-10' />
      <img src={fb} alt="insta icon" className='h-10 w-10' />
      <img src={twt} alt="insta icon" className='h-10 w-14' />

      </div>
     

      </div>
    </div>
  </section>
  )
}

export default Contact