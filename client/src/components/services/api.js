import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = () => api.get('/auth/oauthURL');
export const getProfile = () => api.get('/auth/profile');
export const logout = () => api.post('/auth/logout');
export const getProjects = (params) => api.get('/projects', { params });
export const createProject = (data) => api.post('/projects', data);
export const getProjectById = (id) => api.get(`/projects/${id}`);
export const applyToProject = (id) => api.post(`/projects/${id}/apply`);
