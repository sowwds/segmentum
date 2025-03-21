import React from 'react';
import { useNavigate } from 'react-router-dom';
import { startLogin } from '../services/authService';

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
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Вход в систему</h2>
        <p className="text-center text-muted mb-4">
          Авторизуйтесь через корпоративный аккаунт или Google
        </p>
        <button
          className="btn btn-primary w-100"
          onClick={handleLogin}
        >
          Войти через OAuth
        </button>
        {/* Опционально: ссылка на регистрацию или помощь */}
        <div className="text-center mt-3">
          <small>
            Проблемы со входом? <a href="mailto:support@example.com">Свяжитесь с поддержкой</a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
