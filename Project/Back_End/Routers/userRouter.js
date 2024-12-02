import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();

const userRouter = Router();

const secretKey = process.env.Secretkey;



export async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Provide email, name, and password",
                error: true,
                success: false,
            });
        }

        const user = await UserModel.findOne({ email });

        if (user) {
            return res.json({
                message: "Email already registered",
                error: true,
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
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
}



userRouter.post('/createprofile', async (req, res) => {

    const data = req.body;
    const { FullName, EmailAddress, Bio, Mobile_No, joinDate } = data;

    try {
        const existingUser = await Signup.findOne({emailAddress:EmailAddress });

        if (existingUser) {
            // Create a new user with default role as 'user'
        const newUser = new User({
            fullName: FullName,
            bio: Bio,
            mobile_no: Mobile_No,
            joinDate: joinDate,
            userRole: 'User' // Default role is set to 'user'
        });

        // Save user to MongoDB
        await newUser.save();
        console.log('Profile created successfully');
        res.status(201).json({ message: "Profile created successfully" });

        }else{
            console.log("User already exists!");
            return res.status(400).json({ message: "User exists" });
        }

        
    } catch (error) {
        res.status(500).json(error);
    }
});

// Login Route
userRouter.post('/login', async (req, res) => {
    const { EmailAddress, Password } = req.body;

    const result = await Signup.findOne({ emailAddress:EmailAddress });
    
    if (!result) {
        return res.status(403).json({ message: "User does not exist" });
    }

    const invalid = await bcrypt.compare(Password, result.password);
    if (!invalid) {
        return res.status(403).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign({ emailAddress:EmailAddress, UserRole: result.userRole }, secretKey, { expiresIn: "1h" });

    // Optionally set cookie for token
    res.cookie('authToken', token, { httpOnly: true });
    res.status(200).json({ userRole: result.userRole }); // Include user role in the response
});



  

//logout
userRouter.get('/logout', (req, res) => {
    res.clearCookie('authToken');
    res.status(200).json({ message: 'Logout successful' })
})

export { userRouter };