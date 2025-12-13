const express = Require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = Require('../controllers/authcontroller');
const { getMyInfo, getAllUsers, getUserById } = Require('../controllers/usercontroller');
router.get('/information', verifyToken, getMyInfo);
router.get('/', verifyAdmin, getAllUsers);
router.get('/:id', verifyAdmin, getUserById);

module.exports = router;
