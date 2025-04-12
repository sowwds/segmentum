// src/controllers/departmentController.js
const db = require('../config/db');
const { getCached } = require('../utils/cache');

// GET /departments
exports.getDepartments = async (req, res) => {
  // **НОВОЕ**: Ограничение доступа по ролям (опционально)
  // Раскомментируй, если нужно ограничить доступ, например, только для админов
  /*
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Only admins can view departments' });
  }
  */

  try {
    const cacheKey = 'departments:all';

    const departments = await getCached(cacheKey, async () => {
      const result = await db.query('SELECT id, name, description, head FROM departments');
      return result.rows;
    }, 3600); // 1 час

    res.json(departments);
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};