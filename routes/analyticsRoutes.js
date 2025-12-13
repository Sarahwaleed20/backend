const express = Require('express');
const router = express.Router();
const { verifyToken } = Require('../controllers/authcontroller');
const { getSummary, getTimeSeries } = Require('../controllers/analyticscontroller');

router.get('/summary', verifyToken, getSummary);
router.get('/time-series', verifyToken, getTimeSeries);

module.exports = router;
