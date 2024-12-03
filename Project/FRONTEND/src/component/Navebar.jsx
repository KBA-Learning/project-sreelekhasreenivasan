import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import logo from '../Images/logo.png'
import getUserType from '../utils/auth'

const Navebar = () => {

  const navigate=useNavigate();

  const handleLogout = async () => {

    try {

      const response = await fetch('http://127.0.0.1:3000/logout');

      if (response.ok) {

        navigate('/login')

      }
     
     
      
    } catch (error) {
      console.error("Error fetching book details:", error);
    }

    navigate('/login');
  };

  return (
    <>
      <nav className='flex justify-between items-center text-red-600 bg-slate-300'>
        <div>
         <img src={logo} alt="Get Your Book" className='h-14 w-14'/>
        </div>
        <ul className='flex  gap-6 mt-4 justify-center w-full'>
          <li className='hover:text-indigo-500'><Link to={'/view-book'}>Library</Link></li>
          <li className='hover:text-indigo-500'><Link to={'/search-book'}>Search Book</Link></li>
          <li className='hover:text-indigo-500'><Link to={'/add-book'}>Add Book</Link></li>
          <button onClick={handleLogout} className="bg-transparent border-none cursor-pointer">
              Logout
            </button>        
            </ul>
      </nav>
    </>
  )
}

export default Navebar