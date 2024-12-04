import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../Images/logo.png';

const Navebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3000/logout');
      if (response.ok) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }

    navigate('/login');
  };

  return (
    <>
      <nav className="flex justify-between items-center text-red-600 bg-slate-300 px-6 py-4">
        <div className='flex'>
          <img src={logo} alt="Get Your Book" className="h-14 w-14" /><span className='pt-4 text-green-600 font-bold text-xl'>Get Your Book</span>
        </div>

        <ul className="flex gap-6 items-center">
          <li className="hover:text-indigo-500">
            <Link to={'/view-book'}>Library</Link>
          </li>
          <li className="hover:text-indigo-500">
            <Link to={'/add-book'}>Add Book</Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="hover:text-indigo-500 bg-transparent border-none cursor-pointer"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navebar;
