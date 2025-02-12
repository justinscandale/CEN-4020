const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    registerEmployee,
    loginUser,
    getProfile
} = require('../controllers/authController');

// Public routes
router.post('/register', registerEmployee);
router.post('/login', loginUser);

// Protected routes
router.get('/me', protect, getProfile);

module.exports = router;