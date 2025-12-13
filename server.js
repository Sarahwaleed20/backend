const { app } = Require('./index');
const { db, createUserTable, createExpensesTable, createCategoryTable, createBudgetTable, createGuardianshipTable } = Require('./db');

const PORT = 3000;

db.serialize(() => {
  db.run(createUserTable, (err) => {
    if (err) console.log('Error creating USER table:', err.message);
    else console.log('USER table ready');
  });

  db.run(createCategoryTable, (err) => {
    if (err) console.log('Error creating CATEGORY table:', err.message);
    else console.log('CATEGORY table ready');
  });

  db.run(createExpensesTable, (err) => {
    if (err) console.log('Error creating EXPENSES table:', err.message);
    else console.log('EXPENSES table ready');
  });

  db.run(createBudgetTable, (err) => {
    if (err) console.log('Error creating BUDGET table:', err.message);
    else console.log('BUDGET table ready');
  });

  db.run(createGuardianshipTable, (err) => {
    if (err) console.log('Error creating GUARDIANSHIP table:', err.message);
    else console.log('GUARDIANSHIP table ready');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

