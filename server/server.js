
const express = require('express');
const cors = require('cors');

const PORT = 8080;

const app = express();

require("dotenv").config();
const dbConfig = require("./config/dbConfig");
const userRoute = require("./routes/userRoute");
const movieRoute = require("./routes/movieRoute");


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cors({ origin: "http://localhost:3000", credentials: true }));


app.use(express.json());
app.use('/', userRoute);
app.use('/', movieRoute);


app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
});


