const express = require('express');
const router = express.Router();
const { getRecurringExpenses, addRecurringExpense, deleteRecurringExpense, markExpenseAsPaid } = require('../controllers/recurringExpenseController');

// Route to get all recurring expenses
router.get('/', getRecurringExpenses);

// Route to add a new recurring expense
router.post('/', addRecurringExpense);

// Route to delete a recurring expense
router.delete('/:id', deleteRecurringExpense);

// Route to mark a recurring expense as paid
router.put('/:id/pay', markExpenseAsPaid);

module.exports = router;
