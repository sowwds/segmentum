const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

// Эндпоинт для создания новой заявки
// Пример запроса: POST http://localhost:3000/applications
// Тело запроса (JSON):
// {
//   "project_id": 1,
//   "student_id": 2,
//   "status": "pending"
// }
router.post('/applications', applicationController.createApplication);
router.get('/applications', applicationController.getApplications);

// GET /applications?projectId=<id> - Возвращает заявки для конкретного проекта
router.get('/applications', (req, res) => {
    if (req.query.projectId) {
      return applicationController.getApplicationsByProject(req, res);
    }
    // Если не передан projectId, можно вернуть ошибку или все заявки
    return res.status(400).json({ error: 'projectId query parameter is required' });
  });

router.put('/applications', applicationController.updateApplicationStatusPut);
module.exports = router;
