import React from 'react';
import { startLogin } from '../services/authService';
import './Login.css';

const Login = () => {
  const handleLogin = () => {
    console.log('Кнопка нажата, вызываем startLogin');
    startLogin();
  };

  return (
    <div className="card">
      <h2>Вход в систему</h2>
      <p>Требуется авторизация через Google</p>
      <button className="cta-button" onClick={handleLogin}>
        Войти через Google
      </button>
      <a className="support" href="mailto:support@example.com">
        Свяжитесь с поддержкой
      </a>
    </div>
  );
};

export default Login;
