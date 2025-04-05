const db = require('../config/db');

// POST /applications
// Создает новую заявку и возвращает созданную запись
exports.createApplication = async (req, res) => {
  const { project_id, student_id, status } = req.body;

  if (!project_id || !student_id || !status) {
    return res.status(400).json({ error: 'project_id, student_id and status are required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO applications (project_id, student_id, status) VALUES ($1, $2, $3) RETURNING *',
      [project_id, student_id, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating application:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /applications
// Возвращает список всех заявок из таблицы applications
exports.getApplications = async (req, res) => {
  try {
    const { userId } = req.query;

    if (userId) {
      const result = await db.query(
        'SELECT * FROM applications WHERE student_id = $1',
        [userId]
      );
      return res.json(result.rows);
    } else {
      const result = await db.query('SELECT * FROM applications');
      return res.json(result.rows);
    }
  } catch (err) {
    console.error('Error fetching applications:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};