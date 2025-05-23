const Report = require('../models/reportModel');
const {Receipt, categories, defaultSubcategories} = require('../models/receiptModel');
const asyncHandler = require('express-async-handler');

// Create a new report
const createReport = async (req, res) => {
  try {
    const {name, description, startDate, endDate, expenseType } = req.body;
    if( !name || !description || !startDate )
    {
        throw new Error("input not valid")
    }

    const receipts = await Receipt.find({
      date: {
        $gte: new Date(startDate),
        ...(endDate && { $lte: new Date(endDate) })
      }
    });

    const receiptIds = receipts.map(receipt => receipt._id);
    await Receipt.updateMany(
      { _id: { $in: receiptIds } },
      { $set: { report: true } }
    );

    // Calculate total amount and gather purchase names
    const totalAmount = receipts.reduce((sum, receipt) => (sum + (receipt.total ? receipt.total : 0)), 0);
    const purchaseNames = [...new Set(receipts.map(receipt => (receipt.store ? receipt.store : "Unamed" )))];

    // Calculate additional insights
    const averageAmount = receipts.length > 0 ? totalAmount / receipts.length : 0;
    const receiptCount = receipts.length;

    // Include all receipts info
    const receiptsInfo = receipts.map(receipt => ({
      date: receipt.date,
      total: receipt.total,
      store: receipt.store,
      category: receipt.category,
      subcategory: receipt.subcategory
    }));

    // Create report data
    const reportData = {
      name,
      description,
      info: {
        totalAmount,
        purchaseNames,
        averageAmount,
        receiptCount,
        receiptsInfo // Add all receipts info
      }
    };
    const report = new Report(reportData);
    const savedReport = await report.save();
    res.status(201).json(savedReport);
  }
  catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
    
// Get all reports
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single report by ID
const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (report) {
      res.status(200).json(report);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a report by ID
const updateReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (report) {
      res.status(200).json(report);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a report by ID
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (report) {
      res.status(200).json({ message: 'Report deleted' });
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    const report = await Report.findByIdAndUpdate(id, { status }, { new: true });

    if (report) {
      // Update the status on the associated receipts
      await Report.updateOne({ report: id }, { status });
      res.status(200).json(report);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const requestReportChanges = async (req, res) => {
  try {
    const { id, changes } = req.body;

    const report = await Report.findByIdAndUpdate(id, { requested_changes: changes }, {new: true});
    
    if (report) {
      console.log(report);
      res.status(200).json(report);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
  updateReportStatus,
  requestReportChanges
};
