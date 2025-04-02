const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Эндпоинт для получения проектов
// Если query-параметр userId присутствует, возвращаются проекты конкретного пользователя,
// иначе возвращаются все проекты
router.get('/projects', async (req, res) => {
  if (req.query.userId) {
    return projectController.getProjectsByUser(req, res);
  } else {
    return projectController.getAllProjects(req, res);
  }
});

module.exports = router;
