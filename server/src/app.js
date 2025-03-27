// src/app.js

const express = require('express');
const session = require('express-session');
const passport = require('./config/passport'); // Импорт настроенного Passport

const app = express();

// Разбор JSON-тел запросов
app.use(express.json());


// Настройка сессий (используем secret из переменных окружения)
app.use(session({
  secret: process.env.SESSION_SECRET || 'some_secret_key',
  resave: false,
  saveUninitialized: false
}));

// Инициализация Passport и подключение сессий Passport
app.use(passport.initialize());
app.use(passport.session());

// Импорт маршрутов
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

// Подключение маршрутов
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/applications', applicationRoutes);

// Базовый роут
app.get('/', (req, res) => {
  res.send('Segmentum Backend is running');
});

module.exports = app;

