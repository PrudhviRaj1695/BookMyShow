
const mongoose = require('mongoose');

require("dotenv").config();
const mongoURI = process.env.MONGO_URL;

mongoose.connect(mongoURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  });


const connection = mongoose.connection;

connection.on('connected', () => {
    console.log(' Mongoose connected to database');
});

connection.on('error', (err) => {
    console.error(' Mongoose connection error:', err);
});


