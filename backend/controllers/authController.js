const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const { Employee, User } = require('../models/userModel');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new employee
// @route   POST /api/auth/register
// @access  Public
const registerEmployee = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, departmentId } = req.body;

    // Check if user exists
    const userExists = await Employee.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Create employee
    const employee = await Employee.create({
        userID: Math.floor(100000 + Math.random() * 900000), // 6-digit user ID
        firstName,
        lastName,
        email,
        password,
        role: 'employee',
        department: departmentId
    });

    if (employee) {
        res.status(201).json({
            _id: employee._id,
            userID: employee.userID,
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            role: employee.role,
            department: employee.department,
            token: generateToken(employee._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid employee data');
    }
});

// @desc    Login user (employee or supervisor)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for user email in base User model (includes both employees and supervisors)
    const user = await User.findOne({ email });

    if (!user) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    // If credentials are valid, populate additional data based on role
    let userData = user;
    if (user.role === 'employee') {
        userData = await Employee.findById(user._id).populate('department', 'name description');
    }

    res.status(200).json({
        _id: userData._id,
        userID: userData.userID,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        token: generateToken(userData._id)
    });
});

// @desc    Get employee profile
// @route   GET /api/auth/me
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
    const employee = await Employee.findById(req.user._id)
        .select('-password')
        .populate('department', 'name description');
        
    res.status(200).json(employee);
});

module.exports = {
    registerEmployee,
    loginUser,
    getProfile
};