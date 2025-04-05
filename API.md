# API usage for backend
## 1. Account Endpoints

### GET /account
**Description:**  
Retrieve full account information. If a user is not found, default values are returned (role: "student", description: "", department_id: 0).

**URL:**  
```
http://localhost:5000/account?userId=<user_id>
```

**Example Request:**  
```
http://localhost:5000/account?userId=1
```

**Example Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "description": "",
  "department_id": 0
}

### POST /account/department
**Description:**  
Update the account with department information and description.

**URL:**  
```
POST http://localhost:5000/account/department
```

**Headers:**  
- `Content-Type: application/json`

**Example Request Body:**
```json
{
  "userId": 1,
  "department_id": 2,
  "description": "Assigned to the Computer Science department"
}
```

**Example Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "description": "Assigned to the Computer Science department",
  "department_id": 2
}
```

---

## 2. Department Endpoints

### GET /departments

**Description:**  
Retrieve a list of all departments.

**URL:**  
```
GET http://localhost:5000/departments
```

**Example Response:**
```json
[
  {
    "id": 1,
    "name": "Computer Science",
    "description": "Department of Computer Science",
    "head": 3
  },
  {
    "id": 2,
    "name": "Mathematics",
    "description": "Department of Mathematics",
    "head": null
  }
]
```

---

## 3. Projects Endpoints

### GET /projects
**Description:**  
Retrieve projects. If the query parameter `userId` is provided, returns projects created by that user.

**URL Examples:**
- All projects:
  ```
  GET http://localhost:5000/projects
  ```
- Projects by a specific user:
  ```
  GET http://localhost:5000/projects?userId=1
  ```

**Example Response:**
```json
[
  {
    "id": 1,
    "title": "New Project",
    "description": "Project description",
    "department_id": 1,
    "company_user_id": 1,
    "status": "pending",
    "price": 10000,
    "start_date": "2023-03-27"
  }
]
```

### GET /projects/department
**Description:**  
Retrieve projects filtered by departmentId.

**URL Example:**
```
GET http://localhost:5000/projects/department?departmentId=2
```

**Example Response:**
```json
[
  {
    "id": 2,
    "title": "Department Project",
    "description": "Project for department 2",
    "department_id": 2,
    "company_user_id": 2,
    "status": "active",
    "price": 20000,
    "start_date": "2023-04-01"
  }
]
```

### POST /projects
**Description:**  
Create a new project.

**URL:**  
```
POST http://localhost:5000/projects
```

**Headers:**  
- `Content-Type: application/json`

**Example Request Body:**
```json
{
  "title": "New Project",
  "description": "Project description",
  "department_id": 1,
  "company_user_id": 1,
  "status": "pending",
  "price": 10000,
  "start_date": "2023-03-27"
}
```

**Example Response:**
```json
{
  "id": 1,
  "title": "New Project",
  "description": "Project description",
  "department_id": 1,
  "company_user_id": 1,
  "status": "pending",
  "price": 10000,
  "start_date": "2023-03-27"
}
```

---

## 4. Applications Endpoints

### GET /applications
**Description:**  
Retrieve applications.  
- If the query parameter `userId` is provided, returns applications for that user (where `student_id` equals `userId`).  
- Otherwise, returns all applications.

**URL Examples:**
- All applications:
  ```
  GET http://localhost:5000/applications
  ```
- Applications for a specific user:
  ```
  GET http://localhost:5000/applications?userId=2
  ```

**Example Response:**
```json
[
  {
    "id": 1,
    "project_id": 1,
    "student_id": 2,
    "status": "pending"
  }
]
```

### POST /applications
**Description:**  
Create a new application.

**URL:**  
```
POST http://localhost:5000/applications
```

**Headers:**  
- `Content-Type: application/json`

**Example Request Body:**
```json
{
  "project_id": 1,
  "student_id": 2,
  "status": "pending"
}
```

**Example Response:**
```json
{
  "id": 1,
  "project_id": 1,
  "student_id": 2,
  "status": "pending"
}
```
