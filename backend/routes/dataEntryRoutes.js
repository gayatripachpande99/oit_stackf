const express = require('express');
const router = express.Router();
const {
  createDataEntry,
  getAllDataEntries,
  updateDataEntry,
  deleteDataEntry,
} = require('../controllers/dataEntryController');

// Routes for employee candidate data entry stored in MongoDB
router.post('/data-entries', createDataEntry);
router.get('/data-entries', getAllDataEntries);
router.put('/data-entries/:id', updateDataEntry);
router.delete('/data-entries/:id', deleteDataEntry);

module.exports = router;
