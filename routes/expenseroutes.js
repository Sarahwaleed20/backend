const express = require('express');
const router = express.Router();
const { verifyToken } = require('../controllers/authController');
const { addExpense, getExpenses } = require('../controllers/expenseController');

router.post('/add', verifyToken, addExpense);
router.get('/', verifyToken, getExpenses);

module.exports = router;
