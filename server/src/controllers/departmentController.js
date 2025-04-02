const db = require('../config/db');

// GET /departments
// Возвращает список всех факультетов (departments) с полями id, name, description и head
exports.getDepartments = async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, description, head FROM departments');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
