//Import dependencies
const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
connectDB();

//Use Custom Routes 
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/receipts', require('./routes/receiptRoutes'))

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`) );
