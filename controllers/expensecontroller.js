const { db } = Require('../db');

Exports.addExpense = (req, res) => { // Exports a function called addExpense
  const userId = req.user.id; // verify token middleware 
  const { categoryId, amount, date, description } = req.body; //Extracts expense data from request body Sent from frontend as JSON

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
  `; // SQL command to insert a new expense

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
      expenseId: this.lastID, // expense created and given an id 
    });
  });
};

Exports.getExpenses = (req, res) => {
  const userId = req.user.id; // from cookie token 

  const query = `SELECT * FROM EXPENSES WHERE USER_ID = ?`; //sql query fetches user expenses by user id 

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
