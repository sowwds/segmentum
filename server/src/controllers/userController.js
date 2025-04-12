// src/controllers/accountController.js
const db = require('../config/db');
const { getCached, invalidateCache } = require('../utils/cache');

// GET /account?userId=...
exports.getAccount = async (req, res) => {
  const { userId } = req.query;

  // Проверяем, что пользователь запрашивает свои данные
  if (userId && userId !== req.user.id.toString()) {
    return res.status(403).json({ error: 'Access denied: You can only access your own account' });
  }

  try {
    if (userId) {
      const cacheKey = `account:${userId}`;

      const account = await getCached(cacheKey, async () => {
        const result = await db.query(
          'SELECT id, name, email, role, description, department_id FROM users WHERE id = $1',
          [userId]
        );
        return result.rows.length > 0 ? result.rows[0] : null;
      }, 3600); // 1 час

      if (!account) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(account);
    } else {
      // Если userId не передан, возвращаем данные текущего пользователя
      const result = await db.query(
        'SELECT id, name, email, role, description, department_id FROM users WHERE id = $1',
        [req.user.id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error fetching account info:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /account/department
exports.updateDepartment = async (req, res) => {
  const { userId, department_id, description } = req.body;

  // Свои данные обновляет?
  if (userId !== req.user.id.toString()) {
    return res.status(403).json({ error: 'Access denied: You can only update your own account' });
  }

  // Изменение department_id только для админов (в качестве опции, если потом добавим)
  // if (department_id && req.user.role !== 'admin') {
  //   return res.status(403).json({ error: 'Access denied: Only admins can change department' });
  // }

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const result = await db.query(
      `UPDATE users 
       SET department_id = COALESCE($1, department_id), 
           description = COALESCE($2, description)
       WHERE id = $3 
       RETURNING id, name, email, role, description, department_id`,
      [department_id, description, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Инвалидация кэша для аккаунта
    await invalidateCache(`account:${userId}`);

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating department info:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};