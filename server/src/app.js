// src/app.js

const express = require('express');
const session = require('express-session');
const passport = require('./config/passport'); // Импорт настроенного Passport
const cors = require('cors')
const app = express();
require('dotenv').config();
// Разбор JSON-тел запросов
app.use(express.json());

app.use(cors());

// Если нужно настроить конкретные опции:

const corsOptions = {
  origin: 'http://localhost:3000', // Разрешаем запросы только с этого адреса (фронтенд)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Если нужно передавать куки
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

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
const userRoutes = require('./routes/userRoutes');
const departmentRoutes = require('./routes/departmentRoutes');

// Подключение маршрутов
app.use('/auth', authRoutes);                 //auth (+)                        
app.use(projectRoutes);                       //projects (POST NETU)
app.use(applicationRoutes);                   //applications (GET NETU)
app.use(userRoutes);                          //users (+)
app.use(departmentRoutes);                    //departments (+)
// Базовый роут
app.get('/', (req, res) => {
  res.send('Segmentum Backend is running');
});

app.post('/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

module.exports = app;

