import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Предполагаем, что api.js экспортирует настроенный axios


const Profile = () => {
  const { user } = useContext(AuthContext); // Текущий авторизованный пользователь
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null); // Данные профиля с бэкенда
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Ошибка при запросе

  // Функция для получения данных профиля
  const fetchProfile = async () => {
    if (!user || !user.id) {
      setError('Пользователь не авторизован');
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(`/account?userId=${user.id}`, {
        baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000', // Укажи правильный baseURL
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Токен из localStorage
        },
      });
      setProfileData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке профиля:', err);
      setError('Не удалось загрузить данные профиля');
      setLoading(false);
      if (err.response?.status === 401) {
        // navigate('/login'); // Перенаправление при неавторизованном доступе2
      }
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchProfile();
  }, [user]); // Зависимость от user, чтобы обновлять данные при его изменении

  // Рендеринг в зависимости от состояния
  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!profileData) {
    return <div>Данные профиля недоступны</div>;
  }

  return (
    <div className="profile-container">
      <h2>Профиль пользователя</h2>
      <div className="profile-details">
        <p>
          <strong>Имя:</strong> {profileData.name || 'Не указано'}
        </p>
        <p>
          <strong>Email:</strong> {profileData.email}
        </p>
        <p>
          <strong>Роль:</strong> {profileData.role || 'Не указано'}
        </p>
        <p>
          <strong>Описание:</strong> {profileData.description || 'Нет описания'}
        </p>
        <p>
          <strong>ID отдела:</strong> {profileData.department_id || 'Не привязан к отделу'}
        </p>
      </div>
      <button className="cta-button" onClick={() => navigate('/dashboard')}>
        Назад
      </button>
    </div>
  );
};

export default Profile;
