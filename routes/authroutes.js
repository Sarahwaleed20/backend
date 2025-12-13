const express = Require('express');
const router = express.Router();
const { signUp, login, logout, refresh, verifyToken } = Require('../controllers/authcontroller');

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', verifyToken, logout);
router.post('/refresh', refresh);

module.exports = router;
