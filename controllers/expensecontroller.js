const { db } = require('../db');

exports.addExpense = (req, res) => {
  const userId = req.user.id;
  const { categoryId, amount, date, description } = req.body;

  if (!categoryId || !amount || !date) {
    return res.status(400).json({
      status: 'fail',
      message: 'Category, amount, and date are required.',
    });
  }

  if (isNaN(amount)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Amount must be a valid number.',
    });
  }

  const query = `
    INSERT INTO EXPENSES (USER_ID, CATEGORY_ID, AMOUNT, DATE, DESCRIPTION)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [userId, categoryId, amount, date, description], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        status: 'error',
        message: 'Database error: Could not save expense.',
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Expense added successfully',
      expenseId: this.lastID,
    });
  });
};

exports.getExpenses = (req, res) => {
  const userId = req.user.id;

  const query = `SELECT * FROM EXPENSES WHERE USER_ID = ?`;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        status: 'error',
        message: 'Database error: Could not retrieve expenses.',
      });
    }

    res.status(200).json({
      status: 'success',
      results: rows.length,
      data: rows,
    });
  });
};
