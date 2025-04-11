const db = require('../config/db');
const { getCached, invalidateCache, invalidateCacheByPrefix} = require('../utils/cache');

// POST /applications
exports.createApplication = async (req, res) => {
  const { project_id, student_id, status } = req.body;

  if (!project_id || !student_id || !status) {
    return res.status(400).json({ error: 'project_id, student_id, and status are required' });
  }

  try {
    const cacheKey = `application:${project_id}:${student_id}`;

    // Проверяем существование заявки с кэшированием
    const checkResult = await getCached(cacheKey, async () => {
      const result = await db.query(
        'SELECT id FROM applications WHERE project_id = $1 AND student_id = $2',
        [project_id, student_id]
      );
      return { exists: result.rows.length > 0 };
    }, 300); // 5 минут

    if (checkResult.exists) {
      return res.status(400).json({ error: 'Application already exists for this project and student' });
    }

    // Создаём заявку
    const result = await db.query(
      'INSERT INTO applications (project_id, student_id, status) VALUES ($1, $2, $3) RETURNING *',
      [project_id, student_id, status]
    );

    // Сбрасываем кэш
    await Promise.all([
      invalidateCache(cacheKey),
      invalidateCacheByPrefix(`applications:${project_id}:`),
      invalidateCacheByPrefix(`applications:student:${student_id}:`)
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating application:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// GET /applications
exports.getApplications = async (req, res) => {
  const { project_id, student_id } = req.query;

  try {
    let queryStr = 'SELECT * FROM applications';
    const params = [];
    const conditions = [];

    if (project_id) {
      conditions.push(`project_id = $${params.length + 1}`);
      params.push(project_id);
    }

    if (student_id) {
      conditions.push(`student_id = $${params.length + 1}`);
      params.push(student_id);
    }

    if (conditions.length > 0) {
      queryStr += ` WHERE ${conditions.join(' AND ')}`;
    }

    const cacheKey = `applications:${project_id || 'all'}:${student_id || 'all'}`;

    const applications = await getCached(cacheKey, async () => {
      const result = await db.query(queryStr, params);
      return result.rows;
    }, 600); // 10 минут

    res.json(applications);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /applications?projectId=<id>
exports.getApplicationsByProject = async (req, res) => {
  const { projectId } = req.query;

  if (!projectId) {
    return res.status(400).json({ error: 'projectId query parameter is required' });
  }

  try {
    const cacheKey = `applications:${projectId}:all`;

    const applications = await getCached(cacheKey, async () => {
      const result = await db.query('SELECT * FROM applications WHERE project_id = $1', [projectId]);
      return result.rows;
    }, 600); // 10 минут

    res.json(applications);
  } catch (err) {
    console.error('Error fetching applications by project:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /applications?id=<applicationId>
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
    // Проверяем существование заявки с кэшированием
    const cacheKey = `application:by_id:${id}`;
    const checkResult = await getCached(cacheKey, async () => {
      const result = await db.query('SELECT project_id, student_id FROM applications WHERE id = $1', [id]);
      return result.rows[0] || null;
    }, 300); // 5 минут

    if (!checkResult) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const { project_id, student_id } = checkResult;

    // Обновляем статус
    const result = await db.query(
      'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    // Сбрасываем кэш
    await Promise.all([
      invalidateCache(cacheKey),
      invalidateCache(`application:${project_id}:${student_id}`),
      invalidateCacheByPrefix(`applications:${project_id}:`),
      invalidateCacheByPrefix(`applications:student:${student_id}:`)
    ]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating application status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// GET /applications?projectId=<id>
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

// PUT /applications/:id - Обновляет статус заявки по её id
exports.updateApplicationStatusPut = async (req, res) => {
  const { id } = req.query;
  const { status } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Application id is required as a query parameter' });
  }

  if (!status) {
    return res.status(400).json({ error: 'Status is required in the request body' });
  }

  try {
    // Проверяем существование заявки с кэшированием
    const cacheKey = `application:by_id:${id}`;
    const checkResult = await getCached(cacheKey, async () => {
      const result = await db.query('SELECT project_id, student_id FROM applications WHERE id = $1', [id]);
      return result.rows[0] || null;
    }, 300); // 5 минут

    if (!checkResult) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const { project_id, student_id } = checkResult;

    // Обновляем статус
    const result = await db.query(
      'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    // Обновляем projects.students_id, если статус approved
    if (status === 'approved') {
      await db.query(
        'UPDATE projects SET students_id = array_append(students_id, $1) WHERE id = $2',
        [student_id, project_id]
      );
    }

    // Сбрасываем кэш
    await Promise.all([
      invalidateCache(cacheKey),
      invalidateCache(`application:${project_id}:${student_id}`),
      invalidateCacheByPrefix(`applications:${project_id}:`),
      invalidateCacheByPrefix(`applications:student:${student_id}:`),
      ...(status === 'approved' ? [invalidateCacheByPrefix('projects:')] : [])
    ]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating application status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
