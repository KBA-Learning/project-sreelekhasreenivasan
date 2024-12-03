import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./component/Footer";
import Home from "./pages/Home"
import AddReview from './pages/Addreview'
import Viewbook from "./pages/Viewbook";
import Addbook from "./pages/Addbook";
import Onebook from "./pages/Onebook";
import Updatebook from "./pages/Updatebook";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Search from './pages/Search'

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
        <Route path='/login' element={<Login/>}/> 
        <Route path='/' element={<Home/>}/>
        <Route path='/add-review/:id' element={<AddReview/>}/>
        <Route path='/view-book' element={<Viewbook/>}/>
        <Route path='/add-book' element={<Addbook/>}/>
        <Route path='/update-book/:id' element={<Updatebook/>}/>
        <Route path='/one-book/:id' element={<Onebook/>}/>
        <Route path='/search-book/' element={<Search/>}/>
        <Route path='/signup' element={<Signup/>}/>


        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
