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

Докер автоматически создаёт базу данных, в которой находятся 4 sql таблицы следующего содержания:

Таблица факультетов (departments) без столбца head (он добавится потом):

```
CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);
```

Таблица пользователей (users) ссылается на departments:

```
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  role VARCHAR(50),
  description TEXT,
  department_id INTEGER REFERENCES departments(id)
);
```

Таблица проектов (projects):

```
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200),
  description TEXT,
  department_id INTEGER REFERENCES departments(id),
  company_user_id INTEGER REFERENCES users(id),
  status VARCHAR(50),
  price BIGINT,              -- BIGINT соответствует типу "long int"
  start_date DATE            -- Дата создания заявки
);
```

Таблица заявок (applications):

```
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  student_id INTEGER REFERENCES users(id),
  status VARCHAR(50)
);
```

Запрос GET:

```
http://localhost:5000/account?userId=0
```

Чтобы всё работало, надо добавить элемент в departments:

```
INSERT INTO departments (id, name, description)
VALUES (0, 'No Department', 'Пользователь без отдела');
```

Добавляем тестовый проект

```
INSERT INTO projects (title, description, department_id, company_user_id, status, price, start_date)
VALUES ('Test Project', 'This is a test project', 0, 1, 'pending', 1000, CURRENT_DATE)
RETURNING id;
```
