const { app } = require('./index');
const dbAccess = require('./db');
const db = dbAccess.db;

const PORT = 3000;

db.serialize(() => {
  db.run(dbAccess.createUserTable, (err) => {
    if (err) console.log('Error creating USER table:', err.message);
    else console.log('USER table ready');
  });

  db.run(dbAccess.createExpensesTable, (err) => {
    if (err) console.log('Error creating EXPENSES table:', err.message);
    else console.log('EXPENSES table ready');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
