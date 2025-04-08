CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  role VARCHAR(50),
  description TEXT,
  department_id INTEGER REFERENCES departments(id),
  google_id VARCHAR(255)
);

ALTER TABLE departments
  ADD COLUMN head INTEGER,
  ADD CONSTRAINT fk_departments_head FOREIGN KEY (head) REFERENCES users(id);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200),
  description TEXT,
  department_id INTEGER REFERENCES departments(id),
  company_user_id INTEGER REFERENCES users(id),
  status VARCHAR(50),
  price BIGINT,
  start_date DATE,
  students_id INTEGER[] DEFAULT '{}'
);


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