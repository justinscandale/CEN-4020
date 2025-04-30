const mongoose = require('mongoose');

const recurringExpenseModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true
  },
  lastPaid: {
    type: Date,
    default: Date.now // or null if you prefer
  }
});

const RecurringExpense = mongoose.model('RecurringExpense', recurringExpenseModelSchema);

module.exports = RecurringExpense;