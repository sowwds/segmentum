const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const fakeAuth = require('../middlewares/authMiddleware');

// Применяем фейковую аутентификацию для всех маршрутов заявок
router.use(fakeAuth);

// POST /applications/:id/apply – студент подает заявку на проект с указанным ID
router.post('/:id/apply', applicationController.applyForProject);

// GET /applications/:id/applications – получение всех заявок для проекта (для заведующего кафедрой)
router.get('/:id/applications', applicationController.getApplicationsForProject);

// PUT /applications/:id – обновление статуса заявки (например, утверждение или отклонение)
router.put('/:id', applicationController.updateApplicationStatus);

module.exports = router;
