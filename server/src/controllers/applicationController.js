const db = require('../config/db');

// POST /applications
// Создает новую заявку и возвращает созданную запись
exports.createApplication = async (req, res) => {
  const { project_id, student_id, status } = req.body;

  if (!project_id || !student_id || !status) {
    return res.status(400).json({ error: 'project_id, student_id and status are required' });
  }

  try {
    // Проверяем, существует ли уже заявка для данного проекта от этого студента
    const checkResult = await db.query(
      'SELECT * FROM applications WHERE project_id = $1 AND student_id = $2',
      [project_id, student_id]
    );
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ error: 'Application already exists for this project and student' });
    }

    // Если заявки нет, создаем новую
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
// GET /applications?projectId=<id>
// Возвращает заявки для конкретного проекта
exports.getApplicationsByProject = async (req, res) => {
  const { projectId } = req.query;
  if (!projectId) {
    return res.status(400).json({ error: 'projectId query parameter is required' });
  }
  try {
    const result = await db.query('SELECT * FROM applications WHERE project_id = $1', [projectId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching applications by project:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /applications?id=<applicationId>
// Обновляет (например, утверждает) заявку с указанным id.
// Ожидается, что в теле запроса придёт поле "status" для обновления.
exports.updateApplicationStatus = async (req, res) => {
  const { id } = req.query;
  const { status } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: 'Application id is required in query parameter' });
  }
  if (!status) {
    return res.status(400).json({ error: 'Status is required in the request body' });
  }
  
  try {
    const result = await db.query(
      'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating application status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
