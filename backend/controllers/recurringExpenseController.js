const RecurringExpense = require('../models/recurringExpenseModel');

// Get all recurring expenses
exports.getRecurringExpenses = async (req, res) => {
  try {
    const expenses = await RecurringExpense.find();
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recurring expenses', error: err });
  }
};

// Add a new recurring expense
exports.addRecurringExpense = async (req, res) => {
  try {
    console.log(req.body)
    const newExpense = new RecurringExpense(req.body);
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: 'Error adding recurring expense', error: err });
  }
};

// Delete a recurring expense
exports.deleteRecurringExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await RecurringExpense.findByIdAndDelete(id);
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting expense', error: err });
  }
};

// Mark a recurring expense as paid
exports.markExpenseAsPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedExpense = await RecurringExpense.findByIdAndUpdate(
      { _id: id },
      { lastPaid: Date.now() },
      { new: true }
    );
    res.status(200).json(updatedExpense);
  } catch (err) {
    res.status(500).json({ message: 'Error marking expense as paid', error: err });
  }
};
