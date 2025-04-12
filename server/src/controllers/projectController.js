// src/controllers/projectController.js
const db = require('../config/db');
const { getCached, invalidateCacheByPrefix } = require('../utils/cache');

// GET /projects?companyId=<id>
exports.getProjectsByCompany = async (req, res) => {
  const { companyId } = req.query;
  if (!companyId) {
    return res.status(400).json({ error: 'companyId query parameter is required' });
  }

  // Проверка на вшивость company_user_id или админ

  if (companyId !== req.user.id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: You can only view your own company projects' });
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

  // **НОВОЕ**: Проверяем, что пользователь запрашивает свои проекты или админ
  if (userId !== req.user.id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: You can only view your own projects' });
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
  // **НОВОЕ**: Можно добавить ограничение по ролям, но пока оставим публичным
  // if (req.user.role !== 'admin') {
  //   return res.status(403).json({ error: 'Access denied: Only admins can view all projects' });
  // }

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

// POST /projects
exports.createProject = async (req, res) => {
  const { title, description, department_id, company_user_id, status, price, start_date } = req.body;

  if (!title || !company_user_id) {
    return res.status(400).json({ error: 'title and company_user_id are required' });
  }

  // Проверяем, что company_user_id совпадает с req.user.id и роль — company или admin
  if (company_user_id !== req.user.id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: You can only create projects for your own company' });
  }
  // Проверяем, что роль — company или admin
  if (!['company', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied: Only company users or admins can create projects' });
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

  // Проверяем, что проект принадлежит пользователю или он админ
  try {
    const projectCheck = await db.query('SELECT company_user_id FROM projects WHERE id = $1', [id]);
    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const projectOwnerId = projectCheck.rows[0].company_user_id.toString();
    if (projectOwnerId !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: You can only update your own projects' });
    }

    // Проверяем, что новый company_user_id (если передан) совпадает с req.user.id или админ
    if (company_user_id && company_user_id !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: You cannot change the project owner' });
    }

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