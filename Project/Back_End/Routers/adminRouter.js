import { Router } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {authenticate} from '../Middle-Ware/Auth.js'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const adminRouter = Router();
adminRouter.use(
  "/Images",
  express.static(path.join(__dirname, "public/Images"))
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/Images"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});


const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Set the file size limit to 10MB (adjust as needed)
  },
});

const userSchema = new mongoose.Schema({
  fullName: String,
  emailAddress: { type: String, unique: true },
  password: String,
  mobile_no: Number,
  role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
});

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const bookSchema = new mongoose.Schema({

  bookName: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  description: { type: String, required: true },
  publishedDate: { type: String, required: true },
  imageUrl: { type: String, required: true },
  reviews: [reviewSchema],
  rating: {type: Number, required: true,default: 0},
  numReviews: {type: Number,required: true, default: 0}
 
});


const User = mongoose.model("User_Profiles", userSchema);
const Books = mongoose.model("Book_Details", bookSchema);
const Review=mongoose.model("Reviews",reviewSchema);


adminRouter.get("/", (req, res) => {
  res.send("Welcome");
});

adminRouter.post("/signup", async (req, res) => {
  try {

    const found = await User.findOne({ role: 'ADMIN' });
    let role = 'USER';

    if (!found) {
        role = 'ADMIN'
    }
    
    const { Fullname, Emailaddress, Password, Mobilenumber } = req.body;

    if (!Fullname || !Emailaddress || !Password || !Mobilenumber) {
        return res.status(400).json({
            message: "Provide the required details",
            error: true,
            success: false,
        });
    }

    const user = await User.findOne({ emailAddress: Emailaddress });

    if (user) {
      return res.json({
        message: "Email already registered",
        error: true,
        success: false,
      });
    }
    console.log(user);
    

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = new User({
      fullName: Fullname,
      emailAddress: Emailaddress,
      password: hashedPassword,
      mobile_no: Mobilenumber,
      role:role
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
});

adminRouter.post("/login", async (req, res) => {
  try {
    const { Emailaddress, Password } = req.body;
    // console.log(Password);

    if (!Emailaddress || !Password) {
      return res.status(400).json({
        message: "provide email, password",
        error: true,
        success: false,
      });
    }

    const user = await User.findOne({ emailAddress: Emailaddress });
    // console.log(user);

    if (!user) {
      return res.status(400).json({
        message: "User not register",
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcrypt.compare(Password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "Check your password",
        error: true,
        success: false,
      });
    }

        const token = jwt.sign({ userId: user._id, userType: user.role  },process.env.SECRET_KEY, { expiresIn: '7h' });
        
        // console.log(token);

        res.cookie('bookToken', token, { httpOnly: true });
        res.status(200).json({ message: 'Success',  userType: user.role })

  } catch (error) {
    return res.status(500).json({message: error.message || error,error: true,success: false,
    });
  }
});


adminRouter.get('/viewuser',authenticate, async(req,res)=>{
  try {
    const user = req.userType;
    console.log(user);
    
    res.json({ user });
}
catch {
    res.status(404).json({ message: 'user not authorized' });
}
})

//upload single file
adminRouter.post("/addbook", upload.single("file"), async (req, res) => {

  const data = req.body;
  const { title, author, genre, description, pubdate } = data;

  

  try {
   
   
    // Ensure a file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Book image file is required" });
    }

    // Check if the book already exists
    const existingBook = await Books.findOne({
      bookName: title,
      author: author,
    });

    if (existingBook) {
      return res.status(400).json({ message: "Book already exists" });
    }

    // Save new book to database
    const newBook = new Books({
      bookName: title,
      author: author,
      genre: genre,
      description: description,
      publishedDate: pubdate,
      imageUrl: `/Images/${req.file.filename}`,
    });

    await newBook.save();

    // Send success response
    res.status(201).json({ message: "Book added successfully", book: newBook });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});



// Fetch all books
adminRouter.get("/viewbooks", async (req, res) => {
  try {
    const books = await Books.find(); // Find all books in the database
    res.status(200).json(books); // Return books as JSON
    console.log(books);
    
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});


adminRouter.get("/book/:id", async (req, res) => {
  const ID = req.params.id;

  try {
    const book = await Books.findById({ _id: ID });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


adminRouter.post("/books/search", async (req, res) => {
  const { bookTitle, author, genre, publicationYear } = req.body;

  try {
    const query = {};

    if (bookTitle) query.bookName = { $regex: bookTitle, $options: "i" }; // Case-insensitive search
    if (author) query.author = { $regex: author, $options: "i" };
    if (genre && genre !== "All Genres") query.genre = genre;
    if (publicationYear) query.publishedDate = publicationYear;

    const books = await Books.find(query);
    res.status(200).json(books);
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).send("Internal server error");
  }
});


adminRouter.get('/searchbook/:genre', async (req,res)=>{

  try {

  const genre= req.params.genre;
  

  if(genre){

    const result= await Books.find({genre})

    if (result.length === 0) {
      return res.status(404).json({ message: "No books found for this genre" });
    }

    res.status(200).json(result);
    console.log(result);

  }
} catch (error) {
  console.error("Error fetching books by genre:", error);
  res.status(500).json({ error: "An error occurred while fetching books" });
}
})



adminRouter.put("/updatebook/:id", async (req, res) => {
  try {
    const ID = req.params.id;

    if(req.userType='ADMIN'){

   
    const { title, author, genre, description, pubdate } = req.body;

    const existingBook = await Books.findById({ _id: ID });

    if (existingBook) {
      const body = await Books.updateOne(
        { _id: ID },
        {
          $set: {
            bookName: title,
            author: author,
            genre: genre,
            publishedDate: pubdate,
            description: description,
          },
        }
      );
      if (body.matchedCount === 0) {
        return res.status(400).json({ message: "No book found" });
      } else {
        res.status(200).json({ message: "successfully Updated" });
      }
    }
  }  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


adminRouter.delete("/deletebook/:id", async (req, res) => {
  const ID = req.params.id;

  try {
   
   
    const result = await Books.deleteOne({ _id: ID });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book deleted" });
  
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Server error while deleting book" });
  }
});


adminRouter.post("/reviews/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating, review } = req.body;
    

    if (!rating || !review) {
      return res.status(400).json({ message: "Rating and review are required." });
    }


    const newReview = new Review({
      bookId,
      rating,
      review,
    });

    await newReview.save();
    res.status(201).json({ message: "Review added successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error adding review.", error: err.message });
  }
});


adminRouter.get("/reviews/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;

    const reviews = await Review.find({ bookId })

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews.", error: err.message });
  }
});

adminRouter.put("/reviews/:reviewId", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, review } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, review },
      { new: true } // Return the updated document
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found." });
    }

    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(500).json({ message: "Error updating review.", error: err.message });
  }
});

adminRouter.delete("/reviews/:reviewId", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found." });
    }

    res.status(200).json({ message: "Review deleted successfully.", reviewId });
  } catch (err) {
    res.status(500).json({ message: "Error deleting review.", error: err.message });
  }
});


adminRouter.get("/logout", (req, res) => {

  res.clearCookie("bookToken");
  res.status(200).json({ message: "Logout successful" });
  
});

export { adminRouter, User }; // Export the router
