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

// GET /projects?userId=<id> - Возвращает проекты, созданные конкретным пользователем (через query параметр)
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

// GET /projects/user/:userId - Возвращает проекты, созданные конкретным пользователем (через URL параметр)
exports.getProjectsByUserParam = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: 'userId parameter is required' });
  }
  try {
    const result = await db.query('SELECT * FROM projects WHERE company_user_id = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching projects by user id:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /projects - Создает новый проект
exports.createProject = async (req, res) => {
  const { title, description, department_id, company_user_id, status, price, start_date } = req.body;
  
  if (!title || !company_user_id) {
    return res.status(400).json({ error: 'Title and company_user_id are required' });
  }
  
  try {
    // Если start_date не передан, используем текущую дату
    const projectStartDate = start_date || new Date();
    const result = await db.query(
      `INSERT INTO projects 
        (title, description, department_id, company_user_id, status, price, start_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, department_id, company_user_id, status, price, projectStartDate]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
