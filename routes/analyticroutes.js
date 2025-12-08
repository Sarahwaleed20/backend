const express = require('express');
const router = express.Router();
const { verifyToken } = require('../controllers/authController');
const { getSummary, getTimeSeries } = require('../controllers/analyticsController');

router.get('/summary', verifyToken, getSummary);
router.get('/time-series', verifyToken, getTimeSeries);

module.exports = router;
