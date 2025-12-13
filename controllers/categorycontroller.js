const { db } = require('../db');

const getCategories = (req, res) => {
  const userId = req.user.id; //verify token 

  const query = `SELECT * FROM CATEGORY WHERE USER_ID = ?`;// SQL query Fetches categories linked to the user USER_ID is a foreign key

  db.all(query, [userId], (err, rows) => { // IF DATABASE ERROR AND COULDNT GET CATEGORIES 
    if (err) return res.status(500).json({ error: 'Database error.' });

    res.status(200).json({
      status: 'success',
      results: rows.length,
      data: rows  
    });
  });
};

const createCategory = (req, res) => {
  const userId = req.user.id; // verify token 
  const { name, description } = req.body; // must add name to category 

  if (!name) {
    return res.status(400).json({ error: 'Name is required.' });
  }

  const query = `
    INSERT INTO CATEGORY (USER_ID, NAME, DESCRIPTION, CREATED_AT)
    VALUES (?, ?, ?, ?)
  `;
   
  db.run(query, [userId, name, description || null, new Date().toISOString()], function (err) { // description could be empty hence null 
    if (err) return res.status(500).json({ error: 'Database error.' });

    res.status(201).json({
      status: 'success',
      message: 'Category created successfully',
      categoryId: this.lastID // cat id 
    });
  });
};


const updateCategory = (req, res) => {
  const userId = req.user.id; 
  const categoryId = req.params.id; // Reads category ID from URL
  const { name, description } = req.body;

  const query = `
    UPDATE CATEGORY
    SET NAME = ?, DESCRIPTION = ?
    WHERE ID = ? AND USER_ID = ? 
  `; //Prevents editing someone else’s category

  db.run(query, [name, description, categoryId, userId], function (err) { //Executes update
    if (err) return res.status(500).json({ error: 'Database error.' }); 

    if (this.changes === 0) { // no rows updated means no category found 
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
