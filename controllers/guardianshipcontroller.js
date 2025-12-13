const { db } = Require('../db');

Exports.assignGuardian = (req, res) => {
  const parentId = req.user.id;
  const { childId } = req.body;

  if (!childId) {
    return res.status(400).json({
      status: "fail",
      message: "Child ID is required."
    });
  }

  const query = `
    INSERT INTO GUARDIANSHIP (PARENT_ID, CHILD_ID)
    VALUES (?, ?)
  `;

  db.run(query, [parentId, childId], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: "Could not assign guardianship."
      });
    }

    return res.status(201).json({
      status: "success",
      message: "Guardian assigned successfully.",
      guardianshipId: this.lastID
    });
  });
};

Exports.getChildren = (req, res) => {
  const parentId = req.user.id;

  const query = `
    SELECT CHILD_ID FROM GUARDIANSHIP WHERE PARENT_ID = ?
  `;

  db.all(query, [parentId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: "Could not retrieve children."
      });
    }

    return res.status(200).json({
      status: "success",
      results: rows.length,
      children: rows
    });
  });
};
