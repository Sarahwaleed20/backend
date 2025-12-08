const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../controllers/authController');
const { getMyInfo, getAllUsers, getUserById } = require('../controllers/userController');

// logged in user info
router.get('/information', verifyToken, getMyInfo);

// admin only
router.get('/', verifyAdmin, getAllUsers);
router.get('/:id', verifyAdmin, getUserById);

module.exports = router;
