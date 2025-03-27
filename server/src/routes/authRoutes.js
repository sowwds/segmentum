const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken'); // Импортируем jsonwebtoken
const authController = require('../controllers/authController');

// Инициализация входа через Google с нужным scope
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback URL для Google OAuth – при неудаче редирект на /auth/failure
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    // При успешной авторизации у нас есть объект пользователя в req.user
    // Генерируем JWT-токен, подписанный нашим секретом
    const token = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      },
      process.env.JWT_SECRET || 'default_jwt_secret', // используем переменную окружения
      { expiresIn: '1h' } // срок действия токена (1 час, можно изменить по необходимости)
    );

    // Перенаправляем пользователя на фронтенд, передавая токен в query-параметре
    // Здесь предполагается, что фронтенд работает на http://localhost:3000
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
);

// Маршрут для обработки неудачного входа
router.get('/failure', (req, res) => {
  res.status(401).json({ message: "Authentication Failed" });
});

// Дополнительные маршруты для профиля и выхода (если нужны)
router.get('/profile', authController.profile);
router.get('/logout', authController.logout);

module.exports = router;
