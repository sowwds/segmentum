import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { getAccount, updateAccount, getDepartments } from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [departments, setDepartments] = useState([]);


  const fetchData = async () => {
    if (!user || !user.id) {
      setError('Пользователь не авторизован');
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      const [profileResponse, deptResponse] = await Promise.all([
        getAccount(user.id),
        getDepartments(),
      ]);
      setProfileData(profileResponse.data);
      setDescription(profileResponse.data.description || '');
      setDepartmentId(profileResponse.data.department_id || '');
      setDepartments(deptResponse.data);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке данных:', err);
      setError('Не удалось загрузить данные');
      setLoading(false);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  // Сохранение изменений профиля
  const handleSave = async () => {
    try {
      await updateAccount(user.id, departmentId, description);
      setProfileData({ ...profileData, description, department_id: departmentId });
      setIsEditing(false);
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
      setError('Не удалось сохранить изменения');
    }
  };


  useEffect(() => {
    fetchData();
  }, [user]);

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
    <div className="card">
      <h2>Профиль пользователя</h2>
      <div className="profile-details">
        <p>
          <label>Имя:</label> {profileData.name || 'Не указано'}
        </p>
        <p>
          <label>Email:</label> {profileData.email}
        </p>
        <p>
          <label>Роль:</label> {profileData.role || 'Не указано'}
        </p>

        {isEditing ? (
          <>
            <div>
              <label>Описание:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                cols="50"
                placeholder="Введите описание"
              />
            </div>
            <div>
              <label>Отдел:</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
              >
                <option value="">Выберите отдел</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="button-container">
              <button className="cta-button" onClick={handleSave}>
                Сохранить
              </button>
              <button
                className="cta-button secondary"
                onClick={() => setIsEditing(false)}
              >
                Отмена
              </button>
            </div>
          </>
        ) : (
          <>
            <p>
              <label>Описание:</label> {profileData.description || 'Нет описания'}
            </p>
            <p>
              <label>Отдел:</label>{' '}
              {departments.find((d) => d.id === profileData.department_id)?.name ||
                'Не привязан к отделу'}
            </p>
            <button className="cta-button" onClick={() => setIsEditing(true)}>
              Редактировать
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
