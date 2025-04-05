import React, { useState, useEffect } from 'react';
import { createProject, updateProject, getDepartments } from '../services/api';
import '../pages/Projects.css';

const CompanyProjects = ({ project: initialProject, myProjects, user, navigate, setProject }) => {
  const [project, setLocalProject] = useState(initialProject);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department_id: '',
    price: '',
    start_date: '',
    status: 'pending',
    company_user_id: user.id,
  });

  useEffect(() => {
    if (isCreating || isEditing) {
      const fetchDepartments = async () => {
        try {
          const response = await getDepartments();
          setDepartments(response.data);
        } catch (error) {
          console.error('Ошибка загрузки отделов:', error);
        }
      };
      fetchDepartments();
    }
  }, [isCreating, isEditing]);

  const handleCreateProject = async () => {
    try {
      const response = await createProject(formData);
      alert('Проект успешно создан!');
      setIsCreating(false);
      navigate('/projects');
    } catch (error) {
      console.error('Ошибка создания проекта:', error);
      alert('Не удалось создать проект.');
    }
  };

  const handleUpdateProject = async () => {
    try {
      await updateProject(project.id, formData);
      alert('Проект успешно обновлен!');
      setLocalProject({ ...project, ...formData });
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка обновления проекта:', error);
      alert('Не удалось обновить проект.');
    }
  };

  const startEditing = () => {
    setFormData({
      title: project.title || '',
      description: project.description || '',
      department_id: project.department_id || '',
      price: project.price || '',
      start_date: project.start_date ? project.start_date.split('T')[0] : '',
      status: project.status || 'pending',
      company_user_id: user.id,
    });
    setIsEditing(true);
  };

  if (project && !isEditing) {
    return (
      <div className="card">
        <h2>{project.title}</h2>
        <div className="project-details">
          <p><label>Описание:</label> {project.description}</p>
          <p><label>Статус:</label> {project.status}</p>
          <p><label>Цена:</label> {project.price} руб.</p>
          <p><label>Дата начала:</label> {new Date(project.start_date).toLocaleDateString()}</p>
          <div className="button-container">
            <button className="cta-button" onClick={startEditing}>
              Редактировать
            </button>
            <button
              className="cta-button secondary"
              onClick={() => {
                setProject(null); // Сбрасываем глобальный проект
                setLocalProject(null); // Сбрасываем локальный проект
                navigate('/projects');
              }}
            >
              Назад
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isCreating || isEditing) {
    return (
      <div className="card">
        <h2>{isCreating ? 'Создание проекта' : 'Редактирование проекта'}</h2>
        <div className="project-details">
          <div>
            <label>Название проекта:</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Описание:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Кафедра:</label>
            <select
              value={formData.department_id}
              onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
              required
            >
              <option value="">Выберите кафедру</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Цена (руб.):</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Дата начала:</label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Статус:</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
            >
              <option value="initialized">Initialized</option>
              <option value="pending">Pending</option>
              <option value="finalized">Finalized</option>
            </select>
          </div>
          <div className="button-container">
            <button className="cta-button" onClick={isCreating ? handleCreateProject : handleUpdateProject}>
              {isCreating ? 'Создать' : 'Сохранить'}
            </button>
            <button
              className="cta-button secondary"
              onClick={() => (isCreating ? setIsCreating(false) : setIsEditing(false))}
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Мои проекты</h2>
      <div className="project-details">
        <div className="project-list">
          {myProjects.length > 0 ? (
            myProjects.map((proj) => (
              <div key={proj.id} className="project-item">
                <p><label>Название:</label> {proj.title}</p>
                <p><label>Статус:</label> {proj.status}</p>
                <button
                  className="cta-button"
                  onClick={() => navigate(`/projects/${proj.id}`)}
                >
                  Подробнее
                </button>
              </div>
            ))
          ) : (
            <p>У вас пока нет проектов.</p>
          )}
        </div>
        <div className="button-container">
          <button
            className="cta-button"
            onClick={() => {
              setFormData({
                title: '',
                description: '',
                department_id: '',
                price: '',
                start_date: '',
                status: 'pending',
                company_user_id: user.id,
              });
              setIsCreating(true);
            }}
          >
            Создать проект
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyProjects;
