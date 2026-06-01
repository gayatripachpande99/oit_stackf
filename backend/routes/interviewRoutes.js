const express = require('express');
const {
  startInterview,
  sendAnswer,
  endInterview,
  getInterviewHistory,
  getAdminInterviewHistory,
} = require('../controllers/interviewController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.use(auth);

router.post('/start', startInterview);
router.post('/answer', sendAnswer);
router.post('/end', endInterview);
router.get('/history', getInterviewHistory);
router.get('/admin/history', admin, getAdminInterviewHistory);

module.exports = router;

