-- 1. Создаем таблицу факультетов (departments) без столбца head
CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

-- 2. Создаем таблицу пользователей (users) с полем description и ссылкой на departments
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  role VARCHAR(50),
  description TEXT,
  department_id INTEGER REFERENCES departments(id),
  google_id VARCHAR(255)
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
  price BIGINT,              
  start_date DATE            
);

-- 5. Создаем таблицу заявок (applications)
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  student_id INTEGER REFERENCES users(id),
  status VARCHAR(50)
);



INSERT INTO departments (id, name, description)
VALUES (0, 'No Department', 'Пользователь без отдела');

INSERT INTO public.users (name, email, role, description, department_id, google_id) 
VALUES ('D.O. LEVIEV', 'jir1488@bmstu.ru', 'pudge', 'Главная свиноматка улицы Бауманская', 0, 'dummy_google_id');

INSERT INTO projects (title, description, department_id, company_user_id, status, price, start_date)
VALUES ('Test Project', 'This is a test project', 0, 1, 'initialized', 1000, CURRENT_DATE);