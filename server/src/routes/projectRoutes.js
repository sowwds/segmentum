const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

/*
  GET /projects
  - Если передан query параметр userId, возвращаются проекты, связанные с заявками студента (join с applications)
  - Если передан query параметр companyId, возвращаются проекты, созданные компанией (по полю company_user_id)
  - Если передан query параметр departmentId, возвращаются проекты для указанной кафедры
  - Если никаких фильтров не передано, возвращаются все проекты
*/
router.get('/projects', async (req, res) => {
  if (req.query.userId) {
    return projectController.getProjectsByUser(req, res);
  } else if (req.query.companyId) {
    return projectController.getProjectsByCompany(req, res);
  } else if (req.query.departmentId) {
    return projectController.getProjectsByDepartment(req, res);
  } else {
    return projectController.getAllProjects(req, res);
  }
});

/*
  POST /projects
  Создает новый проект.
  Ожидается, что тело запроса содержит JSON с полями:
    - title (обязательно)
    - description
    - department_id
    - company_user_id (обязательно)
    - status
    - price
    - start_date (опционально; если не передан, используется текущая дата)
*/
router.post('/projects', projectController.createProject);
router.put('/projects', projectController.updateProject);

module.exports = router;
