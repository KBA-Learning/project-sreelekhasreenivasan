import React from 'react'
import { useEffect, useState } from "react";
import {Link} from 'react-router-dom'
import logo from '../Images/logo.png'


const Navebar2 = () => {
    const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      <nav   className={`fixed top-0 left-0 w-full z-10 flex justify-between items-center p-4 transition-all ${
        isScrolled ? "bg-white text-brown" : "bg-transparent text-white"
      }`}>
        <div>
         <img src={logo} alt="Get Your Book" className='h-14 w-14'/>
        </div>
        <ul className='flex ml-96 gap-6 mt-4 '>
          <li  className='hover:text-purple-400'><a href='#home'>Home</a></li>
          <li className='hover:text-purple-400'><a href='#about'>About Us</a></li>
          <li className='hover:text-purple-400'><a href='#contact'>Contact Us</a></li>
          <li className='hover:text-purple-400'><Link to={'/signup'}>Sign Up</Link></li>
          <li className='hover:text-purple-400'><Link to={'/login'}>Login</Link></li>
        </ul>
      </nav>
    </>
  )
}

export default Navebar2