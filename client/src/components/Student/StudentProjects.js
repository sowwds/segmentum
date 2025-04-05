import React from 'react';
import { applyToProject } from '../services/api';
import '../pages/Projects.css';

const StudentProjects = ({ project, applications, myProjects, availableProjects, user, navigate, setProject }) => {
  const handleApply = async (projectId) => {
    try {
      await applyToProject(projectId, user.id, 'pending');
      alert('Заявка успешно подана!');
    } catch (error) {
      console.error('Ошибка подачи заявки:', error);
      alert('Не удалось подать заявку.');
    }
  };

  if (project) {
    return (
      <div className="card">
        <h2>{project.title}</h2>
        <div className="project-details">
          <p><label>Описание:</label> {project.description}</p>
          <p><label>Статус:</label> {project.status}</p>
          <p><label>Цена:</label> {project.price} руб.</p>
          <p><label>Дата начала:</label> {new Date(project.start_date).toLocaleDateString()}</p>
          <div className="button-container">
            {project.status === 'initialized' && (
              <button className="cta-button" onClick={() => handleApply(project.id)}>
                Подать заявку
              </button>
            )}
            <button
              className="cta-button secondary"
              onClick={() => {
                setProject(null); // Сбрасываем проект
                navigate('/projects');
              }}
            >
              назад к списку
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Проекты</h2>
      <div className="project-details">
        <h3>Мои заявки</h3>
        <div className="project-list">
          {applications.length > 0 ? (
            applications.map((app) => (
              <div key={app.id} className="project-item">
                <p><label>Проект:</label> {app.project_title || 'Проект #' + app.project_id}</p>
                <p><label>Статус заявки:</label> {app.status}</p>
                <button
                  className="cta-button"
                  onClick={() => navigate(`/projects/${app.project_id}`)}
                >
                  Подробнее о проекте
                </button>
              </div>
            ))
          ) : (
            <p>У вас пока нет заявок.</p>
          )}
        </div>

        <h3>Мои проекты</h3>
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

        <h3>Доступные проекты</h3>
        <div className="project-list">
          {availableProjects.length > 0 ? (
            availableProjects.map((proj) => (
              <div key={proj.id} className="project-item">
                <p><label>Название:</label> {proj.title}</p>
                <p><label>Описание:</label> {proj.description}</p>
                <p><label>Цена:</label> {proj.price} руб.</p>
                <button
                  className="cta-button"
                  onClick={() => navigate(`/projects/${proj.id}`)}
                >
                  Подробнее
                </button>
              </div>
            ))
          ) : (
            <p>Нет доступных проектов по вашей кафедре.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProjects;
