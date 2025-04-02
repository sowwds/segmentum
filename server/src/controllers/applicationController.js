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
