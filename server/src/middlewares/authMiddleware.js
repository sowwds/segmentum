// Фейковая аутентификация: извлекаем данные пользователя из заголовков запроса.
// В реальной реализации следует заменить эту логику на проверку OAuth-токена или другой механизм аутентификации.
module.exports = function fakeAuth(req, res, next) {
    // Извлекаем user_id из заголовка 'x-user-id', если не передано – используем 1
    const userId = req.headers['x-user-id'] || 1;
    // Извлекаем роль пользователя из заголовка 'x-user-role', если не передано – используем 'student'
    const userRole = req.headers['x-user-role'] || 'student'; // Возможные роли: student, company, head_of_department
    // Извлекаем идентификатор кафедры из заголовка 'x-department-id', если не передано – используем 1
    const departmentId = req.headers['x-department-id'] || 1;
  
    // Сохраняем информацию о пользователе в объекте запроса, чтобы последующие middleware и контроллеры могли её использовать
    req.user = {
      id: parseInt(userId, 10),
      role: userRole,
      department_id: parseInt(departmentId, 10)
    };
  
    // Передаем управление следующему обработчику
    next();
  };
  