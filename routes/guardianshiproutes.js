const express = require('express');
const router = express.Router();
const { verifyToken } = require('../controllers/authcontroller');
const { assignGuardian, getChildren } = require('../controllers/guardianshipcontroller');

router.post('/', verifyToken, assignGuardian);
router.get('/', verifyToken, getChildren);
module.exports = router;
