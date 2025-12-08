const express = require('express');
const router = express.Router();
const { verifyToken } = require('../controllers/authcontroller');
const { getSummary, getTimeSeries } = require('../controllers/analyticscontroller');

router.get('/summary', verifyToken, getSummary);
router.get('/time-series', verifyToken, getTimeSeries);

module.exports = router;
