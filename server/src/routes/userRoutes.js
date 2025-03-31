const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Эндпоинт для получения информации об аккаунте
// Пример запроса: GET http://localhost:3000/account?userId=1
router.get('/account', userController.getAccount);

// Эндпоинт для обновления department_id и description пользователя
// Пример запроса: POST http://localhost:3000/account/department
// Тело запроса (JSON):
// {
//   "userId": 1,
//   "department_id": 2,
//   "description": "Some department description"
// }
router.post('/account/department', userController.updateDepartment);

module.exports = router;
