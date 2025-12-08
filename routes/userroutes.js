const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../controllers/authcontroller');
const { getMyInfo, getAllUsers, getUserById } = require('../controllers/usercontroller');
router.get('/information', verifyToken, getMyInfo);
router.get('/', verifyAdmin, getAllUsers);
router.get('/:id', verifyAdmin, getUserById);

module.exports = router;
