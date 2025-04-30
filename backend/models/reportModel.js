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
  },
  status:{
    type: String,
    default: "Pending"
  },
  requested_changes:{
    type: String,
    default: "No changes requested"
  }
});

const report = mongoose.model('Report', reportSchema);

module.exports = report;