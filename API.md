
### GET /account
**Description:**  
Retrieve full account information.  
**URL:**  


GET [http://localhost:5000/account?userId=](http://localhost:5000/account?userId=)<user_id>


**Example Request:**  


GET [http://localhost:5000/account?userId=1](http://localhost:5000/account?userId=1)

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
````

### POST /account/department

**Description:**  
Update the account with department information and description. **URL:**

```
POST http://localhost:5000/account/department
```

**Headers:**

- `Content-Type: application/json` **Example Request Body:**
    

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
Retrieve a list of all departments. **URL:**

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
Retrieve projects. The results can be filtered by different query parameters:

- **By userId:** Returns projects where the student has an application.
    
    ```
    GET http://localhost:5000/projects?userId=2
    ```
    
- **By companyId:** Returns projects created by the specified company.
    
    ```
    GET http://localhost:5000/projects?companyId=1
    ```
    
- **By departmentId:** Returns projects belonging to a specific department.
    
    ```
    GET http://localhost:5000/projects?departmentId=3
    ```
    
- **Without filters:** Returns all projects.
    
    ```
    GET http://localhost:5000/projects
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

### POST /projects

**Description:**  
Create a new project.  
**URL:**

```
POST http://localhost:5000/projects
```

**Headers:**

- `Content-Type: application/json` **Example Request Body:**
    

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
### PUT /projects/:id

**Description:**  
Update an existing project by its id. Only the provided fields will be updated (others will remain unchanged). **URL:**

```
PUT http://localhost:5000/projects?Id=?
```

**Headers:**

- `Content-Type: application/json` **Example Request Body:**
    

```json
{
  "title": "Updated Project Title",
  "description": "Updated project description",
  "status": "active"
}
```

**Example Response:**

```json
{
  "id": 1,
  "title": "Updated Project Title",
  "description": "Updated project description",
  "department_id": 1,
  "company_user_id": 1,
  "status": "active",
  "price": 10000,
  "start_date": "2023-03-27"
}
```

---

## 4. Applications Endpoints

### GET /applications?projectId=

**Description:**  
Retrieve all applications for a specific project. **URL Example:**

```
GET http://localhost:5000/applications?projectId=1
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
This endpoint is used in two ways:

1. **Creation of a new application:**  
    If no query parameter `id` is provided, it creates a new application.
    
2. **Updating an existing application:**  
    If a query parameter `id` is provided, it updates (e.g., approves) the existing application.
    

#### 4.1. Creating a New Application

**URL:**

```
POST http://localhost:5000/applications
```

**Headers:**

- `Content-Type: application/json` **Example Request Body:**
    

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

#### 4.2. Updating (Approving) an Application

**URL:**

```
POST http://localhost:5000/applications?id=1
```

**Headers:**

- `Content-Type: application/json` **Example Request Body:**
    

```json
{
  "status": "approved"
}
```

**Example Response:**

```json
{
  "id": 1,
  "project_id": 1,
  "student_id": 2,
  "status": "approved"
}
```

