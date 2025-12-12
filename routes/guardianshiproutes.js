const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { assignGuardian, getChildren } = require('../controllers/guardianshipcontroller');

router.post('/', authMiddleware, assignGuardian);
router.get('/', authMiddleware, getChildren);

module.exports = router;
