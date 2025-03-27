// Импортируем необходимые модули
const express = require('express');
const router = express.Router();
// Импортируем контроллер для работы с проектами
const projectController = require('../controllers/projectController');
// Импортируем middleware для фейковой аутентификации
const fakeAuth = require('../middlewares/authMiddleware');

// Применяем фейковую аутентификацию ко всем маршрутам этого роутера.
// Это означает, что для каждого запроса будет заполнено поле req.user.
router.use(fakeAuth);

// POST /projects – создание нового проекта (доступно только для компаний)
router.post('/', projectController.createProject);

// GET /projects – получение списка всех проектов
router.get('/', projectController.getProjects);

// GET /projects/:id – получение конкретного проекта по его ID
router.get('/:id', projectController.getProjectById);

// PUT /projects/:id/status – обновление статуса проекта (доступно для заведующих кафедрой и админа)
router.put('/:id/status', projectController.updateProjectStatus);

// Экспортируем роутер для использования в основном приложении
module.exports = router;
