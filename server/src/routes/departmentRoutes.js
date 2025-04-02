const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

// Эндпоинт для получения всех факультетов
// Пример запроса: GET http://localhost:3000/departments
router.get('/departments', departmentController.getDepartments);

module.exports = router;
