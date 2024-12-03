import { Router } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyToken } from "../Middle-Ware/Auth.js";


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

const upload = multer({ storage }); //multer middleware

const userSchema = new mongoose.Schema({
  fullName: String,
  emailAddress: { type: String, unique: true },
  password: String,
  mobile_no: Number,
  role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
});

const reviewSchema= new mongoose.Schema({

  bookName:{type:String, required:true},
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId,required: true,ref: 'User'}
})

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
    const { Fullname, Emailaddress, Password, Mobilenumber } = req.body;
    // console.log(Fullname, Emailaddress, Password, Mobilenumber);

    // if (!Fullname || !Emailaddress || !Password || !Mobilenumber) {
    //     return res.status(400).json({
    //         message: "Provide the required details",
    //         error: true,
    //         success: false,
    //     });
    // }

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

    const token = jwt.sign(
      { userId: user._id, userType: user.role },process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("Authtoken", token);
    res.json({
      status: true,
      message: "login success",
      userType: user.role,
    });
    return res;
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
});

//upload single file
adminRouter.post(
  "/addbook",
  upload.single("file"),
  verifyToken,
  async (req, res) => {
    try {

      if(req.userType='ADMIN'){

      const { title, author, genre, description, pubdate } = req.body;

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

      res
        .status(201)
        .json({ message: "Book added successfully", book: newBook });
    }}
    
    catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }
);


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



adminRouter.put("/updatebook/:id", verifyToken, async (req, res) => {
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


adminRouter.delete("/deletebook/:id", verifyToken, async (req, res) => {
  const ID = req.params.id;

  try {
    if(req.userType==='ADMIN'){

   
    const result = await Books.deleteOne({ _id: ID });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book deleted" });
  }
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Server error while deleting book" });
  }
});


adminRouter.post("/reviews/:bookId", verifyToken, async (req, res) => {
  const { rating, review } = req.body;
  const bookId = req.params.bookId;
  const userId = req.userId; 

  // console.log(bookId, rating, review, userId);

  try {

    const book = await Books.findById(bookId);
    // console.log(book);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const existingReview = await Review.findOne({ bookName: book.bookName, user: userId });
    console.log(existingReview);
    
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this book." });
    }

    const newReview = new Review({
      bookName: book.bookName,
      rating,
      review,
      user: userId,
    });

    await newReview.save();

    book.reviews.push(newReview);
    book.numReviews += 1;
    book.rating = (book.rating * (book.numReviews - 1) + rating) / book.numReviews;
    await book.save();

    res.status(201).json({
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});



adminRouter.put("/updatereview/:bookId", verifyToken, async (req, res) => {
  const { rating, review } = req.body;
  const bookId = req.params.bookId;
  const userId = req.userId;

  try {
    const book = await Books.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Find review by user for the specific book
    const existingReview = book.reviews.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Update the review
    existingReview.rating = rating;
    existingReview.review = review;

    // Update overall book rating
    book.rating =
      book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length;

    await book.save();

    res.status(200).json({
      message: "Review updated successfully",
      review: existingReview,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});


adminRouter.get("/userreviews", verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const reviews = await Review.find({ user: userId }).populate({
      path: "user",
      select: "fullName emailAddress", // Include relevant user details
    });

    if (reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this user" });
    }

    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});



adminRouter.delete("/deletereview/:bookId/:reviewId",verifyToken,async (req, res) => {
  
    const { bookId, reviewId } = req.params;
    const userId = req.userId;

    try {
      const book = await Books.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      const review = book.reviews.find((r) => r._id.toString() === reviewId);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      if (
        review.user.toString() !== userId.toString() &&
        req.userType !== "ADMIN"
      ) {
        return res
          .status(403)
          .json({ message: "Unauthorized to delete this review" });
      }

      // Remove review from book
      book.reviews = book.reviews.filter((r) => r._id.toString() !== reviewId);

      // Update book rating
      book.numReviews = book.reviews.length;
      book.rating =
        book.reviews.length > 0
          ? book.reviews.reduce((sum, r) => sum + r.rating, 0) /
            book.reviews.length
          : 0;

      await book.save();

      // Delete review from Review collection
      await Review.findByIdAndDelete(reviewId);

      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  }
);





adminRouter.get("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.status(200).json({ message: "Logout successful" });
});

export { adminRouter, User }; // Export the router
