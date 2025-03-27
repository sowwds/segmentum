import { getProfile, logout } from './api';

// Базовый URL бэкенда из переменных окружения
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/';

export const startLogin = () => {
  const authUrl = `${BASE_URL}/auth/google`; // Полный URL для редиректа
  window.location.href = authUrl; // Редирект на OAuth-эндпоинт бэкенда
};

export const getUser = async () => {
  const { data } = await getProfile();
  return data; // { id, name, email, role, department_id }
};

export const logoutUser = async () => {
  await logout();
  localStorage.removeItem('token');
};
