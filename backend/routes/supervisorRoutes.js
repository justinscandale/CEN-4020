const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getAllEmployees,
    getEmployeeById,
    getDeptEmployees,
    updateEmployee
} = require('../controllers/supervisorController');

router.get('/employees', getAllEmployees);
router.get('/employees/dept', getDeptEmployees);
router.get('/employees/:id', protect, authorize('readAny', 'profile'), getEmployeeById);
router.put('/employees/:id', updateEmployee);

module.exports = router;