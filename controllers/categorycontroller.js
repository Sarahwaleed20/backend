const { db } = require('../db');

const getCategories = (req, res) => {
  const userId = req.user.id;

  const query = `SELECT * FROM CATEGORY WHERE USER_ID = ?`;

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error.' });

    res.status(200).json({
      status: 'success',
      results: rows.length,
      data: rows
    });
  });
};

const createCategory = (req, res) => {
  const userId = req.user.id;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required.' });
  }

  const query = `
    INSERT INTO CATEGORY (USER_ID, NAME, DESCRIPTION, CREATED_AT)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [userId, name, description || null, new Date().toISOString()], function (err) {
    if (err) return res.status(500).json({ error: 'Database error.' });

    res.status(201).json({
      status: 'success',
      message: 'Category created successfully',
      categoryId: this.lastID
    });
  });
};


const updateCategory = (req, res) => {
  const userId = req.user.id;
  const categoryId = req.params.id;
  const { name, description } = req.body;

  const query = `
    UPDATE CATEGORY
    SET NAME = ?, DESCRIPTION = ?
    WHERE ID = ? AND USER_ID = ?
  `;

  db.run(query, [name, description, categoryId, userId], function (err) {
    if (err) return res.status(500).json({ error: 'Database error.' });

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Category updated successfully'
    });
  });
};


const deleteCategory = (req, res) => {
  const userId = req.user.id;
  const categoryId = req.params.id;

  const query = `
    DELETE FROM CATEGORY
    WHERE ID = ? AND USER_ID = ?
  `;

  db.run(query, [categoryId, userId], function (err) {
    if (err) return res.status(500).json({ error: 'Database error.' });

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Category deleted successfully'
    });
  });
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
