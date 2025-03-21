import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App'; // Предполагаем, что контекст определён в App.js
import { logoutUser } from '../services/authService';

const Header = () => {
  const { user, setUser } = useContext(AuthContext); // Данные пользователя из контекста
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser(); // Вызов сервиса для выхода
      setUser(null); // Очистка контекста
      navigate('/login'); // Перенаправление на страницу входа
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  // Условная навигация в зависимости от роли
  const renderNavLinks = () => {
    if (!user) return null;

    const commonLinks = (
      <>
        <li className="nav-item">
          <Link className="nav-link" to="/dashboard">Главная</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/projects">Проекты</Link>
        </li>
      </>
    );

    switch (user.role) {
      case 'student':
        return (
          <>
            {commonLinks}
            <li className="nav-item">
              <Link className="nav-link" to="/notifications">
                Уведомления
                {/* Предполагается, что у студента есть непрочитанные уведомления */}
                {user.unreadNotifications > 0 && (
                  <span className="badge bg-danger ms-1">{user.unreadNotifications}</span>
                )}
              </Link>
            </li>
          </>
        );
      case 'company':
      case 'head_of_department':
        return commonLinks;
      case 'admin':
        return (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/users">Пользователи</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/projects">Проекты</Link>
            </li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Student Projects</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {renderNavLinks()}
          </ul>
          {user ? (
            <div className="d-flex align-items-center">
              <span className="me-3">Привет, {user.name} ({user.role})</span>
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Выйти
              </button>
            </div>
          ) : (
            <Link className="btn btn-outline-primary" to="/login">Войти</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
