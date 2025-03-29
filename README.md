# Segmentum

## Подготовка к запуску
Так - как весь .env добавлен в .gitignore нам необходимо добавить .env в папки server и client. В /server/.env пропишем:
```
PORT=5000
DATABASE_URL=postgres://postgres:123@db:5432/segmentum
SESSION_SECRET=your_generated_session_secret
JWT_SECRET=your_generated_jwt_secret GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
```
Далее директорие /server пропишем команду:
```
npm install
```
Аналогично для папки /client 
Далее в папке /client необходимо написать
```
npm start
```
(для запуска фронта)
Далее возвращаемся в корень проекта и прописываем следующие команды:
Проверка наличия Docker:
```
docker -v
```
Проверка наличия Docker-compose:
```
docker-compose -v
```
Если отсутствуют - установить и запустить. 
Далее прописываем команду для запуска бэкенда и бд:
```
docker-compose up --build
```

Достуа к бд осуществляется командой:
```
docker-compose exec db psql -U postgres -d segmentum
```

Создание таблиц в базе данных:
```
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200),
  description TEXT,
  department_id INTEGER,
  company_user_id INTEGER,
  status VARCHAR(50)
);

```
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  student_user_id INTEGER REFERENCES users(id),
  status VARCHAR(50)
);
```
```
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  role VARCHAR(50),
  department_id INTEGER
);

```