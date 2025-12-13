const express = Require('express');
const router = express.Router();
const { verifyToken } = Require('../controllers/authcontroller');
const { getBudgets, createBudget, updateBudget, deleteBudget } = Require('../controllers/budgetcontroller');

router.get('/', verifyToken, getBudgets);
router.post('/', verifyToken, createBudget);
router.put('/:id', verifyToken, updateBudget);
router.delete('/:id', verifyToken, deleteBudget);

module.exports = router;

