const db = require('../config/db');

// GET /account?userId=...

exports.getAccount = async (req, res) => {
  const userId = req.query.userId;
  
  try {
    if (userId) {
      const result = await db.query(
        'SELECT id, name, email, role, description, department_id FROM users WHERE id = $1',
        [userId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json(result.rows[0]);
    } else {
      return res.json({
        id: null,
        name: '',
        email: '',
        role: 'student',
        description: '',
        department_id: 0
      });
    }
  } catch (err) {
    console.error('Error fetching account info:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /account/department
exports.updateDepartment = async (req, res) => {
  const { userId, department_id, description } = req.body;
  console.log('Received updateDepartment:', req.body);

  if (!userId) {
    return res.status(400).json({ error: 'User id is required' });
  }

  try {
    const result = await db.query(
      `UPDATE users 
       SET department_id = $1, description = $2 
       WHERE id = $3 
       RETURNING id, name, email, role, description, department_id`,
      [department_id, description, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating department info:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
