const express = Require('express');
const router = express.Router();
const { verifyToken } = Require('../controllers/authcontroller');
const { addExpense, getExpenses } = Require('../controllers/expensecontroller');

router.post('/add', verifyToken, addExpense);
router.get('/', verifyToken, getExpenses);

module.exports = router;
