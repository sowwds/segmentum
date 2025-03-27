const db = require('../config/db');

// Контроллер для работы с заявками на проекты

// Функция, позволяющая студенту подать заявку на проект
exports.applyForProject = async (req, res) => {
  try {
    // Проверка: доступно только студентам
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Forbidden: Only students can apply for projects.' });
    }
    const projectId = req.params.id;
    const student_user_id = req.user.id;
    
    // Вставляем новую заявку в таблицу applications
    const result = await db.query(
      'INSERT INTO applications (project_id, student_user_id, status) VALUES ($1, $2, $3) RETURNING *',
      [projectId, student_user_id, 'pending']
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error applying for project:', err);
    res.status(500).json({ error: 'Server error while applying for project.' });
  }
};

// Получение всех заявок для конкретного проекта (доступно для заведующего кафедрой)
exports.getApplicationsForProject = async (req, res) => {
  try {
    // Проверяем роль: доступ только для заведующего кафедрой
    if (req.user.role !== 'head_of_department') {
      return res.status(403).json({ error: 'Forbidden: Only head of department can view applications.' });
    }
    const projectId = req.params.id;
    // Выполняем JOIN для получения данных о студенте, подавшем заявку
    const result = await db.query(
      `SELECT a.*, u.name as student_name, u.email as student_email
       FROM applications a
       JOIN users u ON a.student_user_id = u.id
       WHERE project_id = $1`,
      [projectId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ error: 'Server error while fetching applications.' });
  }
};

// Обновление статуса заявки (например, одобрение или отклонение) – доступно для заведующего кафедрой
exports.updateApplicationStatus = async (req, res) => {
  try {
    if (req.user.role !== 'head_of_department') {
      return res.status(403).json({ error: 'Forbidden: Only head of department can update application status.' });
    }
    const applicationId = req.params.id;
    const { status } = req.body;
    // Обновляем статус заявки в таблице applications
    const result = await db.query(
      'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, applicationId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating application status:', err);
    res.status(500).json({ error: 'Server error while updating application status.' });
  }
};
