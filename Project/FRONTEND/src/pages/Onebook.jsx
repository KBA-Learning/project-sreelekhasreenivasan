import React, { useState, useEffect } from "react";
import Navebar from "../component/Navebar";
import { useParams, useNavigate, Link} from "react-router-dom"; 

const Onebook = () => {
  const { id } = useParams(); 
  const [book, setBook] = useState(null);
  const navigate=useNavigate();



  useEffect(() => {
    
    const fetchBookDetails = async () => {

      try {
        const response = await fetch(`http://127.0.0.1:3000/book/${id}`);


        if (!response.ok) {
          throw new Error("Failed to fetch book details");
        }
        const data = await response.json();

        console.log(data);

        setBook(data);
       
        
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [id]);


  const handleDelete = async () => {

    try {
      const response = await fetch (`http://127.0.0.1:3000/deletebook/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      navigate('/view-book')

    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <>
    <Navebar/>
    <div className=" mx-auto p-4">
      
      {book ? (
        <>
        <div className="flex">
        <img
                    src={`http://127.0.0.1:3000${book.imageUrl}`}
                    alt={book.bookName}
                    className="w-96 h-80 rounded-md"
                  />
          <div className="pt-20 pl-4">
          <h1 className="text-2xl font-bold mb-4">{book.bookName}</h1>

          <p>Author: {book.author}</p>
          <p>Genre: {book.genre}</p>
          <p>Published Date: {book.publishedDate}</p>
          </div></div>
          <p>Description: {book.description}</p>
  
          <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none">
            <Link to={`/update-book/${book._id}`}>Update</Link>
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white p-2 rounded-md ml-4 hover:bg-red-600 focus:outline-none"
          >
            Delete
          </button>
        </>
      ) : (
        <p>Loading...</p> 
      )}
    </div>
    </>
  );
  
};

export default Onebook;
