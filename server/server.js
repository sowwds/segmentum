// Импортируем Express-приложение, которое инициализируется в src/app.js
const app = require('./src/app');
// Импортируем конфигурационные данные (порт, строка подключения и т.д.)
const config = require('./src/config/config');

// Определяем порт из переменных окружения или используем 3000 по умолчанию
const PORT = config.port || 5000;

// Запускаем сервер и выводим сообщение в консоль
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
