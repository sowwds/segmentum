-- 1. Создаем таблицу факультетов (departments) без столбца head
CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

-- 2. Создаем таблицу пользователей (users) с полем description и ссылкой на departments
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  role VARCHAR(50),
  description TEXT,
  department_id INTEGER REFERENCES departments(id)
);

-- 3. Добавляем столбец head в таблицу departments и внешний ключ,
--    ссылающийся на users.id (например, для заведующего кафедрой)
ALTER TABLE departments
  ADD COLUMN head INTEGER,
  ADD CONSTRAINT fk_departments_head FOREIGN KEY (head) REFERENCES users(id);

-- 4. Создаем таблицу проектов (projects)
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

-- 5. Создаем таблицу заявок (applications)
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  student_id INTEGER REFERENCES users(id),
  status VARCHAR(50)
);
