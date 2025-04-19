const mongoose = require('mongoose');
const { json } = require('stream/consumers');

const reportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  info: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
    default: {}
  }
});

const report = mongoose.model('Report', reportSchema);

module.exports = report;