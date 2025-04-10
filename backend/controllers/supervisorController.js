const asyncHandler = require('express-async-handler');
const { Employee } = require('../models/userModel');
const  Department  = require('../models/departmentModel');

// @desc    Get all employees
// @route   GET /api/supervisor/employees
// @access  Private/Supervisor
const getAllEmployees = asyncHandler(async (req, res) => {
    const employees = await Employee.find({})
        .select('-password')
        .populate('department', 'name description');

    if (!employees) {
        res.status(404);
        throw new Error('No employees found');
    }

    res.status(200).json({
        success: true,
        count: employees.length,
        data: employees
    });
});

// @desc    Get employee by ID
// @route   GET /api/supervisor/employees/:id
// @access  Private/Supervisor
const getEmployeeById = asyncHandler(async (req, res) => {
    const employee = await Employee.findById(req.params.id)
        .select('-password')
        .populate('department', 'name description');

    if (!employee) {
        res.status(404);
        throw new Error('Employee not found');
    }

    res.status(200).json({
        success: true,
        data: employee
    });
});

// @desc    Get deptartment employees
// @route   GET /api/supervisor/deptemployees
// @access  Private/Supervisor
const getDeptEmployees = asyncHandler(async (req, res) => {
    const employees = await Employee.find({})
        .select('-password')
        .populate('department', 'name description');

    if (!employees) {
        res.status(404);
        throw new Error('No employees found');
    }

    res.status(200).json({
        success: true,
        count: employees.length,
        data: employees
    });
});

module.exports = {
    getAllEmployees,
    getEmployeeById,
    getDeptEmployees
};