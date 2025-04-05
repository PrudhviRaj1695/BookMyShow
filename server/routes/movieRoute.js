const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware.js');
const movieModel = require('../models/moviesModel.js'); 

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("Missing JWT_SECRET in environment variables");
    process.exit(1); 
}

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, genre, releaseDate, duration, language, imageUrl } = req.body;
        console.log("Request body:", req.body);

        const requiredFields = [title, description, genre, releaseDate, duration, language, imageUrl];
        // if (requiredFields.some(field => !field)) {
        //     return res.status(400).json({ status: false, message: "Please enter all fields" });
        // }

        const newMovie = new movieModel({
            title, 
            description, 
            genre, 
            releaseDate, 
            duration, 
            language, 
            imageUrl
        });

        await newMovie.save();
        return res.status(200).json({ status: true, message: "Movie added successfully", movie: newMovie });
    } catch (error) {
        console.error("Error adding movie:", error);
        return res.status(500).json({ status: false, message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const movies = await movieModel.find();
        return res.status(200).json({ status: true, movies });
        } catch (error) {
        console.error("Error fetching movies:", error);
        return res.status(500).json({ status: false, message: error.message });
        }
});



module.exports = router;
