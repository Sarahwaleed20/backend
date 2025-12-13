const { db } = Require('../db');

const getSummary = (req, res) => {
  const userId = req.user.id;

  const totalExpensesQuery = `
    SELECT SUM(AMOUNT) as totalExpenses
    FROM EXPENSES
    WHERE USER_ID = ?
  `;

  const totalBudgetQuery = `
    SELECT SUM(AMOUNT) as totalBudget
    FROM BUDGET
    WHERE USER_ID = ?
  `;

  db.get(totalExpensesQuery, [userId], (err, expensesRow) => {
    if (err) return res.status(500).json({ error: 'Database error.' });

    db.get(totalBudgetQuery, [userId], (err2, budgetRow) => {
      if (err2) return res.status(500).json({ error: 'Database error.' });

      res.status(200).json({
        status: 'success',
        data: {
          totalExpenses: expensesRow.totalExpenses || 0,
          totalBudget: budgetRow.totalBudget || 0
        }
      });
    });
  });
};

const getTimeSeries = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT SUBSTR(DATE, 1, 7) as month, SUM(AMOUNT) as total
    FROM EXPENSES
    WHERE USER_ID = ?
    GROUP BY month
    ORDER BY month
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error.' });

    res.status(200).json({
      status: 'success',
      data: rows
    });
  });
};

Module.exports = { getSummary, getTimeSeries };
