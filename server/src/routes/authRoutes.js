const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken'); // Импортируем jsonwebtoken
const authController = require('../controllers/authController');
const jwtAuth = require('../middlewares/jwtAuth'); // Импортируйте middleware для JWT

// Инициализация входа через Google с нужным scope
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback URL для Google OAuth – при неудаче редирект на /auth/failure
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    // Генерируем JWT-токен
    const token = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '1h' }
    );

    // Перенаправляем на фронтенд с токеном в query-параметре
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
);

// Маршрут для обработки неудачного входа
router.get('/failure', (req, res) => {
  res.status(401).json({ message: "Authentication Failed" });
});

// Защищённый маршрут профиля – теперь с middleware jwtAuth
router.get('/profile', jwtAuth, authController.profile);

// Маршрут для выхода (логики logout в JWT обычно сводится к удалению токена на клиенте)
router.get('/logout', authController.logout);

module.exports = router;
