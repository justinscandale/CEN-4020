const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const supervisorRoutes = require("./routes/supervisorRoutes");
const authRoutes = require("./routes/authRoutes");
const receiptRoutes = require("./routes/receiptRoutes"); // Import the receipt routes

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS for all routes
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
}));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/supervisor", supervisorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/receipts", receiptRoutes); // Connect the receipts route

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));

