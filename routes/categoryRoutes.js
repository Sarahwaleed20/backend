const express = Require('express');
const router = express.Router();
const { verifyToken } = Require('../controllers/authcontroller');
const { getCategories, createCategory, updateCategory, deleteCategory } = Require('../controllers/categorycontroller');

router.get('/', verifyToken, getCategories);
router.post('/', verifyToken, createCategory);
router.put('/:id', verifyToken, updateCategory);
router.delete('/:id', verifyToken, deleteCategory);

module.exports = router;
