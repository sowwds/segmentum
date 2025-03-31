const db = require('../config/db');

// Контроллер для работы с проектами
exports.updateDepartment = async (req, res) => {
  console.log('Received POST /account/department with body:', req.body);
  // ... остальной код ...
};

// Создание нового проекта (только для пользователей с ролью 'company')
exports.createProject = async (req, res) => {
  try {
    if (req.user.role !== 'company') {
      return res.status(403).json({ error: 'Forbidden: Only companies can create projects.' });
    }
    const { title, description, department_id } = req.body;
    const company_user_id = req.user.id;
    const result = await db.query(
      'INSERT INTO projects (title, description, department_id, company_user_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, department_id, company_user_id, 'pending']
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Server error while creating project.' });
  }
};

// Получение списка всех проектов
exports.getProjects = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM projects');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Server error while fetching projects.' });
  }
};

// Получение конкретного проекта по ID
exports.getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const result = await db.query('SELECT * FROM projects WHERE id = $1', [projectId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching project by ID:', err);
    res.status(500).json({ error: 'Server error while fetching project.' });
  }
};

// Обновление статуса проекта (доступно для заведующих кафедрой и админа)
exports.updateProjectStatus = async (req, res) => {
  try {
    if (req.user.role !== 'head_of_department' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions to update project status.' });
    }
    const projectId = req.params.id;
    const { status } = req.body;
    const result = await db.query(
      'UPDATE projects SET status = $1 WHERE id = $2 RETURNING *',
      [status, projectId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating project status:', err);
    res.status(500).json({ error: 'Server error while updating project status.' });
  }
};
