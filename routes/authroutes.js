const express = require('express');
const router = express.Router();
const { signUp, login, logout, refresh, verifyToken } = require('../controllers/authController');

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', verifyToken, logout);
router.post('/refresh', refresh);

module.exports = router;
