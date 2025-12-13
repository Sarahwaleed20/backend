const { db } = require('../db');

const getBudgets = (req, res) => {
  const userId = req.user.id;

  const query = `SELECT * FROM BUDGET WHERE USER_ID = ?`;//• Fetches only budgets belonging to this user

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error.' });

    res.status(200).json({
      status: 'success',
      results: rows.length,
      data: rows
    });
  });
};

const createBudget = (req, res) => {
  const userId = req.user.id;
  const { categoryId, amount, startDate, endDate } = req.body;

  if (!amount || !startDate || !endDate) {
    return res.status(400).json({ error: 'Amount, startDate, and endDate are required.' });
  }

  const query = `
    INSERT INTO BUDGET (USER_ID, CATEGORY_ID, AMOUNT, START_DATE, END_DATE, CREATED_AT)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [userId, categoryId || null, amount, startDate, endDate, new Date().toISOString()], function (err) {
    if (err) return res.status(500).json({ error: 'Database error.' });

    res.status(201).json({
      status: 'success',
      message: 'Budget created successfully',
      budgetId: this.lastID
    });
  });
};

const updateBudget = (req, res) => {
  const userId = req.user.id; // from token 
  const budgetId = req.params.id; // from url
  const { categoryId, amount, startDate, endDate } = req.body;

  const query = `
    UPDATE BUDGET
    SET CATEGORY_ID = ?, AMOUNT = ?, START_DATE = ?, END_DATE = ?
    WHERE ID = ? AND USER_ID = ?
  `;

  db.run(query, [categoryId || null, amount, startDate, endDate, budgetId, userId], function (err) {
    if (err) return res.status(500).json({ error: 'Database error.' });

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Budget not found.' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Budget updated successfully'
    });
  });
};

const deleteBudget = (req, res) => {
  const userId = req.user.id;
  const budgetId = req.params.id; // budget id from url 

  const query = `
    DELETE FROM BUDGET
    WHERE ID = ? AND USER_ID = ?
  `;

  db.run(query, [budgetId, userId], function (err) {
    if (err) return res.status(500).json({ error: 'Database error.' });

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Budget not found.' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Budget deleted successfully'
    });
  });
};

module.exports = { getBudgets, createBudget, updateBudget, deleteBudget };
