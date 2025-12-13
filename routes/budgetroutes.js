const express = require('express');
const router = express.Router();
const { verifyToken } = require('../controllers/authcontroller');
const { getBudgets, createBudget, updateBudget, deleteBudget } = require('../controllers/budgetcontroller');

router.get('/', verifyToken, getBudgets);
router.post('/', verifyToken, createBudget);
router.put('/:id', verifyToken, updateBudget);
router.delete('/:id', verifyToken, deleteBudget);

module.exports = router;

