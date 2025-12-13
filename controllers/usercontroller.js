const { db } = require('../db');

const getMyInfo = (req, res) => {
  const userId = req.user.id;

  const query = `SELECT ID, EMAIL, ROLE FROM USER WHERE ID = ?`;

  db.get(query, [userId], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    if (!row) return res.status(404).json({ error: 'User not found.' });

    res.status(200).json({
      status: 'success',
      data: row
    });
  });
};


const getAllUsers = (req, res) => { //admin only 
  const query = `SELECT ID, EMAIL, ROLE FROM USER`;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error.' });

    res.status(200).json({
      status: 'success',
      results: rows.length,
      data: rows
    });
  });
};


const getUserById = (req, res) => { //also by admin 
  const userId = req.params.id;

  const query = `SELECT ID, EMAIL, ROLE FROM USER WHERE ID = ?`;

  db.get(query, [userId], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    if (!row) return res.status(404).json({ error: 'User not found.' });

    res.status(200).json({
      status: 'success',
      data: row
    });
  });
};

module.exports = { getMyInfo, getAllUsers, getUserById };
