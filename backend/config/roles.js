const AccessControl = require('accesscontrol');
const ac = new AccessControl();

// Employee permissions
ac.grant('employee')
  // Expense Reports
  .createOwn('expenseReport')
  .readOwn('expenseReport')
  .updateOwn('expenseReport')
  // Receipts
  .createOwn('receipt')
  .readOwn('receipt')
  .updateOwn('receipt')
  .deleteOwn('receipt')
  // Profile
  .readOwn('profile')
  .updateOwn('profile');

// Supervisor permissions (inherits employee permissions)
ac.grant('supervisor')
  .extend('employee')
  // Receipts
  .readAny('receipt')
  .updateAny('receipt')
  .deleteAny('receipt')
  // Expense Reports
  .readAny('expenseReport')
  .updateAny('expenseReport')
  // Employee Management
  .readAny('profile')   
  .readAny('employee')   
  // Reports & Analytics
  .readAny('analytics')
  .readAny('reports')
  // Department
  .readAny('department');

module.exports = ac;