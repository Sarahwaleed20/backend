const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('expenses.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

const createUserTable = `
CREATE TABLE IF NOT EXISTS USER (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  EMAIL TEXT UNIQUE NOT NULL,
  PASSWORD TEXT NOT NULL,
  ROLE TEXT NOT NULL
)`;

const createExpensesTable = `
CREATE TABLE IF NOT EXISTS EXPENSES (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  USER_ID INTEGER NOT NULL,
  CATEGORY TEXT NOT NULL,
  AMOUNT REAL NOT NULL,
  DATE TEXT NOT NULL,
  DESCRIPTION TEXT,
  FOREIGN KEY(USER_ID) REFERENCES USER(ID)
)`;

module.exports = {
  db,
  createUserTable,
  createExpensesTable,
}; 