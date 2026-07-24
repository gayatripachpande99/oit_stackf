const express = require('express');
const {
  getMyResults,
  getResultDetail,
  getAllResults,
  getResultStats,
} = require('../controllers/resultController');
const { saveAnswer } = require('../controllers/testController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.use(auth);

router.get('/my', getMyResults);
router.get('/my/:id', getResultDetail);
router.get('/admin/all', admin, getAllResults);
router.get('/admin/stats/:testId', admin, getResultStats);
router.get('/:id', getResultDetail);

router.put('/:resultId/answer', saveAnswer);
router.patch('/:resultId/answer', saveAnswer);

module.exports = router;


