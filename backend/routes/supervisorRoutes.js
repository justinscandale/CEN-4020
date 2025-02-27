const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getAllEmployees,
    getEmployeeById
} = require('../controllers/supervisorController');

router.get('/employees', protect, authorize('readAny', 'profile'), getAllEmployees);
router.get('/employees/:id', protect, authorize('readAny', 'profile'), getEmployeeById);

module.exports = router;