const express = Require('express');
const router = express.Router();
const { verifyToken } = Require('../controllers/authcontroller');
const { assignGuardian, getChildren } = Require('../controllers/guardianshipcontroller');

router.post('/', verifyToken, assignGuardian);
router.get('/', verifyToken, getChildren);
module.exports = router;
