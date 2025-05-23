const express = require('express');
const router = express.Router();
const {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
  updateReportStatus,
  requestReportChanges
} = require('../controllers/reportController');

// Route to create a new report
router.post('/', createReport);

// Route to get all reports
router.get('/', getAllReports);

// Route to get a single report by ID
router.get('/:id', getReportById);

// Route to update a report by ID
router.put('/:id', updateReport);

// Route to delete a report by ID
router.delete('/:id', deleteReport);

//Route to update report by ID
router.post('/status',updateReportStatus);

// Route to request changes to a report
router.post('/request-changes', requestReportChanges);

module.exports = router;
