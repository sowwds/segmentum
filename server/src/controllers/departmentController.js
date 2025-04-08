const db = require('../config/db');

// GET /departments
exports.getDepartments = async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, description, head FROM departments');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
