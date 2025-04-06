import { getProfile, logout } from './api';


const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/';

export const startLogin = () => {
  const authUrl = `${BASE_URL}/auth/google`;
  window.location.href = authUrl;
};

export const getUser = async () => {
  const { data } = await getProfile();
  return data.user;
};

export const logoutUser = async () => {
  localStorage.removeItem('token');
};
