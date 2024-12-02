import React,{useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import logo from '../Images/logo.png'


const Login = () => {
    const [Emailaddress,setEmailadress] = useState('');
    const [Password,setPassword] = useState('');
    const navigate = useNavigate();

    const signupSubmit = async (userDetails) => {
        const res = await fetch('http://127.0.0.1:3000/login',{

            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            
            },
            body: JSON.stringify(userDetails),
            credentials: 'include',
        });

        if(res.ok){
            navigate('/view-book');
        } else{
            alert('Please check the input data');
        }
    };
    const submitForm = (e) => {
        e.preventDefault();
        const userDetails = {
            Emailaddress,
            Password,
        };
        signupSubmit(userDetails);
    }
  return (
    <>
<div className="relative h-screen flex justify-center items-center bg-image opacity-60"
style={{ backgroundImage: "url('/Images/BOOKSAF-11.png')" }}>


      <div className="relative bg-slate-50 backdrop-filter h-5/4 p-10 rounded-lg shadow-2xl w-96 text-center z-10 transform transition hover:scale-105 duration-300 ease-in-out">
        <div className="flex items-center ml-10 mb-6">
          <img
            src={logo}
            alt="Get Your Book"
            className="w-15 h-12 mr-2"
          />
          <p className="font-bold">Get Your Book</p>
        </div>

        <form onSubmit={submitForm}>
          <p className="text-2xl font-semibold mb-6 pl-0 text-indigo-900">Sign In</p>


          <div className="mb-4">
            <input
              type="email"
              placeholder="Enter Your Email ID"
              className="w-full p-3 bg-red-50 shadow-md border-zinc-800 focus:outline-none focus:ring-1"
              required
              value={Emailaddress}
              onChange={(e) => setEmailadress(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full p-3 bg-red-50 shadow-md border-zinc-800 focus:outline-none focus:ring-1"
              required
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-red-700 text-white w-full h-10 py-2 rounded-lg shadow-lg hover:bg-red-700 transition mb-4"
          >
            Sign In
          </button>

        </form>

        <div className="mt-6 text-sm">
          <p>
            Don't have an account?{" "}
            <Link to={'/signup'} className="text-red-400 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>

    </>
  )
}

export default Login