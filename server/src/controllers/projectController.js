const db = require('../config/db');
const { getCached, invalidateCacheByPrefix } = require('../utils/cache');

// GET /projects?companyId=<id>
exports.getProjectsByCompany = async (req, res) => {
  const { companyId } = req.query;
  if (!companyId) {
    return res.status(400).json({ error: 'companyId query parameter is required' });
  }
  try {
    const cacheKey = `projects:company:${companyId}`;
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

    const projects = await getCached(cacheKey, async () => {
      const result = await db.query(query, [companyId]);
      return result.rows;
    }, 600); // 10 минут

    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects by company:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// GET /projects?userId=<id>
exports.getProjectsByUser = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'userId query parameter is required' });
  }
  try {
    const cacheKey = `projects:user:${userId}`;

    const projects = await getCached(cacheKey, async () => {
      const result = await db.query(
        `SELECT p.* 
         FROM projects p 
         JOIN applications a ON p.id = a.project_id 
         WHERE a.student_id = $1`,
        [userId]
      );
      return result.rows;
    }, 600); // 10 минут

    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects for user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// GET /projects
exports.getAllProjects = async (req, res) => {
  try {
    const cacheKey = 'projects:all';

    const projects = await getCached(cacheKey, async () => {
      const result = await db.query('SELECT * FROM projects');
      return result.rows;
    }, 600); // 10 минут

    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /projects - Создает новый проект
exports.createProject = async (req, res) => {
  const { title, description, department_id, company_user_id, status, price, start_date } = req.body;
  
  if (!title || !company_user_id) {
    return res.status(400).json({ error: 'title and company_user_id are required' });
  }
  
  try {
    const projectStartDate = start_date || new Date();
    const result = await db.query(
      `INSERT INTO projects 
        (title, description, department_id, company_user_id, status, price, start_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, department_id, company_user_id, status, price, projectStartDate]
    );

    await invalidateCacheByPrefix('projects:');

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /projects?id=<id>
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

    await invalidateCacheByPrefix('projects:');

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};