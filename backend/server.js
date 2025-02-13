//Import dependencies
const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const supervisorRoutes = require("./routes/supervisorRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
connectDB();

//  Routes
app.use("/api/supervisor", supervisorRoutes);
app.use("/api/auth", authRoutes)


// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`) );
