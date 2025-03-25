import React from 'react';
import { useNavigate } from 'react-router-dom';
import { startLogin } from '../services/authService';
import "./Login.css"

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await startLogin(); // Редирект на OAuth-провайдера
      // После успешного возврата с токеном бэкенд перенаправит на /dashboard
    } catch (error) {
      console.error('Ошибка при попытке входа:', error);
      alert('Не удалось начать процесс входа. Попробуйте позже.');
    }
  };

  return (
    <div class="card">
        <h2>Вход в систему</h2>
        <p>Требуется авторизация через google</p>
        <button class='cta-button' onClick={handleLogin}>Войти через OAuth</button>
        <a class="support" href="mailto:support@example.com">Свяжитесь с поддержкой</a>
    </div>
  );
};

export default Login;
