const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/', async (req, res) => {
  const { email, subject, text } = req.body;

  // Create a transporter object using SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password
    },
  });

  // Set up email data
  let mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: "email", // List of receivers
    subject: subject, // Subject line
    text: text, // Plain text body
  };

  // Send mail with defined transport object
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

module.exports = router; 