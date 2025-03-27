// src/controllers/authController.js
const jwt = require('jsonwebtoken');

exports.profile = (req, res) => {
  // Если токен уже был проверен через middleware, req.user будет заполнен.
  // Если вы хотите выполнять проверку прямо здесь, можно так:
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    // Здесь можно дополнительно загрузить профиль из базы, если необходимо.
    // Для примера просто возвращаем декодированные данные:
    res.json({ user: decoded });
  });
};

exports.logout = (req, res) => {
  // Если вы работаете с JWT, "logout" на сервере обычно означает, что клиент удаляет токен.
  res.json({ message: 'Logged out successfully (remove token on client side)' });
};
