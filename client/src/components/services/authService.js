import { login, getProfile, logout } from './api';

export const startLogin = async () => {
  const { data } = await login();
  window.location.href = data.url; // Редирект на OAuth
};

export const getUser = async () => {
  const { data } = await getProfile();
  return data; // { id, name, email, role, department_id }
};

export const logoutUser = async () => {
  await logout();
  localStorage.removeItem('token');
};
