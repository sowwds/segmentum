const db = require('../config/db');

// GET /projects - Возвращает все проекты
exports.getAllProjects = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM projects');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /projects?userId=<id> - Возвращает проекты, созданные конкретным пользователем (фильтр по company_user_id)
exports.getProjectsByUser = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'userId query parameter is required' });
  }
  try {
    const result = await db.query('SELECT * FROM projects WHERE company_user_id = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching projects by user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
