require('dotenv').config();
const mongoose = require('mongoose');
const { User, Employee, Supervisor } = require('../models/userModel');
const Department = require('../models/departmentModel');
const connectDB = require('./db');
const bcrypt = require('bcryptjs');

// Sample department data
const departments = [
  {
    departmentID: 1,
    name: 'Engineering',
    description: 'Software development and technical operations'
  },
  {
    departmentID: 2,
    name: 'Sales',
    description: 'Sales and customer relationship management'
  },
  {
    departmentID: 3,
    name: 'Finance',
    description: 'Financial operations and accounting'
  }
];

// Sample user data 
const users = [
  // Supervisors
  {
    userID: 1001,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@eeris.com',
    password: 'password123',
    role: 'supervisor'
  },
  {
    userID: 1002,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@eeris.com',
    password: 'password123',
    role: 'supervisor'
  },

  // Employees 
  {
    userID: 2001,
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@eeris.com',
    password: 'password123',
    role: 'employee'
  },
  {
    userID: 2002,
    firstName: 'Bob',
    lastName: 'Wilson',
    email: 'bob.wilson@eeris.com',
    password: 'password123',
    role: 'employee'
  },
  {
    userID: 2003,
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie.brown@eeris.com',
    password: 'password123',
    role: 'employee'
  }
];
//  Hash password
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await Department.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing departments and users');

    // Create departments
    const createdDepartments = await Department.insertMany(departments);
    console.log(`Created ${createdDepartments.length} departments`);

    // Hash passwords for all users
    const usersWithHashedPasswords = await Promise.all(
        users.map(async (user) => ({
          ...user,
          password: await hashPassword(user.password)
        }))
      );

    // Assign departments to employees
    const employeeUsers = usersWithHashedPasswords.filter(user => user.role === 'employee');
    const supervisorUsers = usersWithHashedPasswords.filter(user => user.role === 'supervisor');

    // Create supervisors
    await Supervisor.insertMany(supervisorUsers);
    console.log(`Created ${supervisorUsers.length} supervisors`);

    // Create employees with department assignments
    const employeesWithDepartments = employeeUsers.map((employee, index) => ({
      ...employee,
      department: createdDepartments[index % createdDepartments.length]._id
    }));
    await Employee.insertMany(employeesWithDepartments);
    console.log(`Created ${employeesWithDepartments.length} employees`);

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();