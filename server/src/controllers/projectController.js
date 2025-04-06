const db = require('../config/db');

// GET /projects?companyId=<id>
// Возвращает проекты, созданные конкретной компанией (по company_user_id)
exports.getProjectsByCompany = async (req, res) => {
  const { companyId } = req.query;
  if (!companyId) {
    return res.status(400).json({ error: 'companyId query parameter is required' });
  }
  try {
    const query = `
      SELECT p.*,
             (
               SELECT json_agg(json_build_object('id', u.id, 'name', u.name, 'email', u.email))
               FROM users u
               WHERE u.id = ANY(p.students_id)
             ) AS students
      FROM projects p
      WHERE p.company_user_id = $1
    `;
    const result = await db.query(query, [companyId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching projects by company:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// GET /projects?userId=<id>
// Возвращает проекты, в которых участвует студент. Для этого делается join с таблицей applications.
exports.getProjectsByUser = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'userId query parameter is required' });
  }
  try {
    const result = await db.query(
      `SELECT p.* 
       FROM projects p 
       JOIN applications a ON p.id = a.project_id 
       WHERE a.student_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching projects for user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /projects
// Если ни companyId, ни userId не переданы, возвращаем все проекты
exports.getAllProjects = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM projects');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching projects:', err);
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

exports.updateProject = async (req, res) => {
  const { id } = req.query;
  const { title, description, department_id, company_user_id, status, price, start_date } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: 'Project id is required in query parameter' });
  }
  
  try {
    const result = await db.query(
      `UPDATE projects
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           department_id = COALESCE($3, department_id),
           company_user_id = COALESCE($4, company_user_id),
           status = COALESCE($5, status),
           price = COALESCE($6, price),
           start_date = COALESCE($7, start_date)
       WHERE id = $8
       RETURNING *`,
      [title, description, department_id, company_user_id, status, price, start_date, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};