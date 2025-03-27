// Контроллер для аутентификации

// Возвращает информацию о текущем пользователе (если аутентификация прошла успешно)
exports.profile = (req, res) => {
    if (req.user) {
      res.json({ user: req.user });
    } else {
      res.status(401).json({ error: 'Not authenticated' });
    }
  };
  
  // Выход пользователя из сессии
  exports.logout = (req, res) => {
    req.logout(function(err) {
      if (err) { 
        return res.status(500).json({ error: 'Error during logout' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  };
  