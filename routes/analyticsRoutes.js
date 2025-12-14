const express = require('express');
const router = express.Router();
const { verifyToken } = require('../controllers/authcontroller'); // to verify user 
const { getSummary, getTimeSeries } = require('../controllers/analyticscontroller'); 

router.get('/summary', verifyToken, getSummary); // Defines a GET endpoint, first check if they are logged in then get summary 
router.get('/time-series', verifyToken, getTimeSeries);

module.exports = router; //Exports this router Allows server.js to use it
