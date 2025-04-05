import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Токен перед запросом:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Заголовок Authorization установлен:', config.headers.Authorization);
  } else {
    console.log('Токен отсутствует в localStorage');
  }
  return config;
});

// Аутентификация
export const login = () => api.get('/auth/oauthURL');
export const getProfile = () => api.get('/auth/profile');
export const logout = () => api.post('/auth/logout');

// Проекты
export const getProjects = (params = {}) => api.get('/projects', { params });
export const createProject = (data) => api.post('/projects', data);
export const getProjectById = (id) => api.get(`/projects/${id}`);
export const applyToProject = (project_id, student_id, status = 'pending') => {
    return api.post('/applications', { project_id, student_id, status });
  };

// Заявки
export const getApplications = (params = {}) => api.get('/applications', { params });

// Отделы
export const getDepartments = () => api.get('/departments');

// Аккаунт
export const getAccount = (userId) => api.get(`/account?userId=${userId}`);
export const updateAccount = (userId, department_id, description) => {
  return api.post('/account/department', {
    userId,
    department_id,
    description,
  });
};

export default api;
