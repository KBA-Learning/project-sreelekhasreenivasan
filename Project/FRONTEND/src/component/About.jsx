import React from 'react'
import pic from '../Images/aboutus.png'

const About = () => {
  return (
    <section
    id="about"
    className="bg-gray-100 py-16 pt-32 pb-14"
    style={{ marginTop: "100px" }}
  >
    <div className="container mx-auto text-center">
      <h2 className="text-4xl font-bold text-indigo-800 mb-8">About Us</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        We are a small group of dedicated book enthusiasts, passionate about curating the best reads for every kind of reader.
      </p>
      <img
        src={pic}
        alt="About Us Icon"
        className="w-60 h-60 rounded-full shadow-lg mx-auto"
      />
    </div>
  </section>
  )
}

export default About