const mongoose = require('mongoose');

// Base User Schema
const userSchema = new mongoose.Schema({
  userID: {
    type: Number,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['employee', 'supervisor'],
    required: true
  }
});

// Employee Schema
const employeeSchema = new mongoose.Schema({
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: false,
    default: null
  }
});

// Supervisor Schema
const supervisorSchema = new mongoose.Schema({});

const User = mongoose.model('User', userSchema);
const Employee = User.discriminator('Employee', employeeSchema);
const Supervisor = User.discriminator('Supervisor', supervisorSchema);

module.exports = {
  User,
  Employee,
  Supervisor
};