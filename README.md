## Запуск проекта

Для запуска проекта потребуется:

- Node.js
- Docker
- Docker-compose 
- PostgreSQL

**Перед запуском проекта Docker, PostgreSQL должны быть запущены**

Переходим в корень проекта /segmentum/

Заходим в /segmentum/server

Устанавливаем node models командой:
```bash
npm install
```
Далее заходим в /segmentum/client

Устанавливаем node models командой:
```bash
npm install
```
Невыходя из папки, запускаем клиент на порте 3000 командой: 
```bash
npm start
```
**Обратите внимания на файл docker-compose там указана конфигурация бд 
```yml
  db:
    image: postgres:13
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: 123
      POSTGRES_DB: segmentum
    ports:
      - "5433:5432"
    volumes:
      - db-data:/var/lib/postgresql/data
      - ./initdb:/docker-entrypoint-initdb.d
```
Убедитесь в совпадении POSTGRES_USER и POSTGRES_PASSWORD с вашими, при необходимости - замените

Также не забудьте заменить в server строку:
```yml
DATABASE_URL: postgres://postgres:123@db:5432/segmentum 
```

Открываем новый терминал в корне проекта /segmentum/ 

Пишем команду:
```bash
docker-compose up --build
```
---
## Операции с бд

Для обозрения полного функционала требуется менять роль пользователя default - student, также присутствуют роли head_of_department и company 

Чтобы изменить роль вашего пользователя откройте новый терминал зайдите в контейнер postgres командой:
```bash
docker-compose exec db psql -U postgres -d segmentum
```

Выберите таблицу users командой 
```sql
select * from users;
```
Там вы увидите тестового юзера D.O. Leviev с id=1 и себя запомните свой id и измените роль командой: 
Для перехода к роли company:
```sql
UPDATE users
SET role = 'company'
WHERE id = 2;
```
Для перехода к роли head_of_department:
```sql
UPDATE users
SET role = 'head_of_department'
WHERE id = 2;
```