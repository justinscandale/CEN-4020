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
    // Get department ID from request parameters or query
    const departmentId = req.params.departmentId || req.query.departmentId;
    console.log(req)
    if (!departmentId) {
        res.status(400);
        throw new Error('Department ID is required');
    }

    // Find employees with the specified department ID
    const employees = await Employee.find({ department: departmentId })
        .select('-password')
        .populate('department', 'name description');
    
    if (!employees || employees.length === 0) {
        res.status(404);
        throw new Error('No employees found for this department');
    }
    
    res.status(200).json({
        success: true,
        count: employees.length,
        data: employees
    });
});

// @desc    Update employee details
// @route   PUT /api/supervisor/employees/:id
// @access  Private/Supervisor
const updateEmployee = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, role } = req.body;

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
        res.status(404);
        throw new Error('Employee not found');
    }

    employee.firstName = firstName || employee.firstName;
    employee.lastName = lastName || employee.lastName;
    employee.email = email || employee.email;
    employee.role = role || employee.role;
    
    await employee.save();

    res.status(200).json({
        success: true,
        data: employee
    });
});

module.exports = {
    getAllEmployees,
    getEmployeeById,
    getDeptEmployees,
    updateEmployee
};