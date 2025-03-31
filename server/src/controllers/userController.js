const db = require('../config/db');

// GET /account?userId=...
// Возвращает информацию об аккаунте.
// Если пользователь не найден, возвращаются дефолтные значения.

exports.getAccount = async (req, res) => {
  // Если у вас настроен JWT‑middleware, можно получить userId из req.user.
  // Здесь для примера используем query-параметр.
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
      // Если не передан userId, возвращаем дефолтные значения
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
// Обновляет для пользователя поля department_id и description.
// В теле запроса ожидаются: userId, department_id и description.
// src/controllers/userController.js

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
