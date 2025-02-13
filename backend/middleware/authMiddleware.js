const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const {User} = require('../models/userModel');
const ac = require('../config/roles');

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
    let token;
    
    if (req.headers.authorization?.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized (no token)');
    }
});

// Authorize based on role
const authorize = (action, resource) => {
    return asyncHandler(async (req, res, next) => {
        try {
            const permission = ac.can(req.user.role)[action](resource);
            
            if (!permission.granted) {
                res.status(403);
                throw new Error('You don\'t have permission to perform this action');
            }

            req.permission = permission;
            next();
        } catch (error) {
            next(error);
        }
    });
};

module.exports = { protect, authorize };