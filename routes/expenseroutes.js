const express = require('express');
const router = express.Router();
const { verifyToken } = require('../controllers/authcontroller');
const { addExpense, getExpenses } = require('../controllers/expensecontroller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', verifyToken, addExpense);
router.get('/', verifyToken, getExpenses);
router.post('/add', authMiddleware, addExpense);
router.get('/', authMiddleware, getExpenses);

module.exports = router;
