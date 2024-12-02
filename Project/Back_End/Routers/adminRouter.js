import { Router } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import bcrypt from 'bcrypt'
import generatedAccessToken from "../Middle-Ware/generateAccessToken.js";


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
  role : { type : String, enum : ['ADMIN',"USER"], default : "USER"}

});

const bookSchema = new mongoose.Schema({
  bookName: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  description: { type: String, required: true },
  publishedDate: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const bookreviewSchema = new mongoose.Schema({
  bookName: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
});

const User = mongoose.model("User_Profiles", userSchema);
const Books = mongoose.model("Book_Details", bookSchema);
const Book_review = mongoose.model("Book_Review", bookreviewSchema);

adminRouter.get("/", (req, res) => {
  res.send("Welcome");
});


adminRouter.post('/signup', async (req,res)=>{
  try {
    const { Fullname, Emailaddress, Password, Mobilenumber } = req.body;

    if (!Fullname || !Emailaddress || !Password || !Mobilenumber) {
        return res.status(400).json({
            message: "Provide the required details",
            error: true,
            success: false,
        });
    }

    const user = await User.findOne({ emailAddress:Emailaddress });

    if (user) {
        return res.json({
            message: "Email already registered",
            error: true,
            success: false,
        });
    }

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


adminRouter.post('/login', async (req,res)=>{
  try {
    const { Emailaddress , Password } = req.body
    console.log(Password);
    

    if(!Emailaddress || !Password){
        return res.status(400).json({
            message : "provide email, password",
            error : true,
            success : false
        })
    }

    const user = await User.findOne({ emailAddress:Emailaddress })

    if(!user){
        return res.status(400).json({
            message : "User not register",
            error : true,
            success : false
        })
    }

    const checkPassword = await bcrypt.compare(Password,user.password)

    if(!checkPassword){
        return res.status(400).json({
            message : "Check your password",
            error : true,
            success : false
        })
    }


    const accesstoken = await generatedAccessToken(user._id)


    res.cookie('accessToken',accesstoken)

    console.log(accesstoken);
    

    return res.json({
        message : "Login successfully",
        error : false,
        success : true,
        data : {
            accesstoken
            
        }
    })

} catch (error) {
    return res.status(500).json({
        message : error.message || error,
        error : true,
        success : false
    })
}
})


//upload single file
adminRouter.post("/addbook", upload.single("file"), async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});


adminRouter.get("/book/:id", async (req, res) => {

  const ID=req.params.id;
  

  try {
    const book = await Books.findById({_id:ID});
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


adminRouter.put("/updatebook/:id", async (req, res) => {
  try {
    const ID=req.params.id;
    
    const { title, author, genre, description, pubdate } = req.body;

    const existingBook = await Books.findById({_id:ID});

    if (existingBook) {

      const body = await Books.updateOne(
        { _id:ID},
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
  } catch (error) {
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




// adminRouter.delete("/deleteuser/:id", async (req, res) => {
//   const EmailAddress = req.params.id;

//   const existingUser = await Signup.findOne({ emailAddress: EmailAddress });
//   console.log(existingUser);

//   try {
//     if (existingUser) {
//       await Signup.deleteOne({ emailAddress: EmailAddress });
//       res.status(200).json({ message: "User deleted" });
//     } else {
//       console.log("No user found");
//     }
//   } catch {
//     console.error("Error");
//     res.status(500).json({ message: "Error!" });
//   }
// });


adminRouter.post("/reviews", async (req, res) => {
  const { bookTitle, author, genre, rating, review } = req.body;

  try {
    // Save the review to the database (e.g., MongoDB)
    const newReview = new Book_review({
      bookName: bookTitle,
      author: author,
      genre: genre,
      rating: rating,
      review: review,
    });
    await newReview.save();

    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});





adminRouter.get('/reviews/:bookId', async (req, res) => {
  try {
    const reviews = await Book_review.find({ bookId: req.params.bookId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});


adminRouter.get("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.status(200).json({ message: "Logout successful" });
});

export { adminRouter, User}; // Export the router
