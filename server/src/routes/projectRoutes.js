const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const jwtAuth = require('../middlewares/jwtAuth');
/*
  GET /projects
  - Если передан query параметр userId, возвращаются проекты, связанные с заявками студента (join с applications)
  - Если передан query параметр companyId, возвращаются проекты, созданные компанией (по полю company_user_id)
  - Если передан query параметр departmentId, возвращаются проекты для указанной кафедры
  - Если никаких фильтров не передано, возвращаются все проекты
*/
router.get('/projects', (req, res, next) => {
  if (req.query.userId) {
    return jwtAuth(req, res, () => projectController.getProjectsByUser(req, res));
  }
  if (req.query.companyId) {
    return jwtAuth(req, res, () => projectController.getProjectsByCompany(req, res));
  }
  if (req.query.departmentId) {
    return jwtAuth(req, res, () => projectController.getProjectsByDepartment(req, res));
  }
  // Публичный доступ для getAllProjects
  return projectController.getAllProjects(req, res);
});

router.post('/projects', jwtAuth, projectController.createProject);
router.put('/projects', jwtAuth, projectController.updateProject);

module.exports = router;
