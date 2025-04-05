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

module.exports = router;
