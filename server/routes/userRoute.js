const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel.js');
const authMiddleware = require('../middleware/authMiddleware.js');

dotenv.config();
const router = express.Router();


const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("Missing JWT_SECRET in environment variables");
    process.exit(1); 
}


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msgStatus: false, message: "Please enter all fields" });
        }

        const existingUser = await userModel.findOne({ email });
        if (!existingUser || !existingUser.password) {
            return res.status(400).json({ msgStatus: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ msgStatus: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: existingUser._id, email: existingUser.email },
            JWT_SECRET,
            { expiresIn: "1h" } 
        );

        return res.status(200).json({
            msgStatus: true,
            message: "User logged in successfully",
            token,
            user: { 
                id: existingUser._id, 
                username: existingUser.username, 
                email: existingUser.email, 
                isAdmin: existingUser.isAdmin 
            } 
        });

    } catch (error) {
        return res.status(500).json({ msgStatus: false, message: "Internal server error" });
    }
});


router.post('/register', async (req, res) => {
    try {
        const { username, email, password, isAdmin } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ msgStatus: false, message: "Please enter all fields" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msgStatus: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new userModel({ 
            username, 
            email, 
            password: hashedPassword, 
            isAdmin: isAdmin || false 
        });

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, username: newUser.username }, 
            JWT_SECRET, 
            { expiresIn: "1h" }
        );

        return res.status(201).json({ 
            msgStatus: true,
            message: "User created successfully", 
            token,
            user: { 
                id: newUser._id, 
                username: newUser.username, 
                email: newUser.email, 
                isAdmin: newUser.isAdmin 
            } 
        });

    } catch (error) {
        return res.status(500).json({ msgStatus: false, message: "Internal server error" });
    }
});

router.get('/get-current-user', authMiddleware, async (req, res) => {
    try {
        console.log("🔹 Fetching current user:", req.user);

        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        return res.status(200).json({
            status: true,
            message: "Current user fetched successfully",
            data: user
        });

    } catch (error) {
        console.error(" Error fetching current user:", error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
});

module.exports = router;
