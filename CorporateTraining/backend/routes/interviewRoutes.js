const express = require('express');
const {
  startInterview,
  sendAnswer,
  endInterview,
  getInterviewHistory,
  getAllStudentInterviews
} = require('../controllers/interviewController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.use(auth);

router.post('/start', startInterview);
router.post('/answer', sendAnswer);
router.post('/end', endInterview);
router.get('/history', getInterviewHistory);
router.get('/admin/history', admin, getAllStudentInterviews);

module.exports = router;

