const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const supervisorRoutes = require("./routes/supervisorRoutes");
const authRoutes = require("./routes/authRoutes");
const receiptRoutes = require("./routes/receiptRoutes");
const reportRoutes = require('./routes/reportRoutes');
const recurringExpenseRoutes = require('./routes/recurringExpenseRoutes')
const nodemailer = require('nodemailer');
const emailRoutes = require('./routes/emailRoutes');
const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS for all routes
app.use(cors({
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
}));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/supervisor", supervisorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/receipts", receiptRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/recurring-expenses', recurringExpenseRoutes);
app.use('/api/send-email', emailRoutes);

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
