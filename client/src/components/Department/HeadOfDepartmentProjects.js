import React, { useState, useEffect } from 'react';
import { getApplications, approveApplication } from '../services/api';
import '../pages/Projects.css';

const HeadOfDepartmentProjects = ({ project: initialProject, availableProjects, user, navigate, setProject }) => {
  const [project, setLocalProject] = useState(initialProject);
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  useEffect(() => {
    if (project) {
      const fetchApplications = async () => {
        setLoadingApplications(true);
        try {
          const response = await getApplications({ projectId: project.id });
          setApplications(response.data);
        } catch (error) {
          console.error('Ошибка загрузки заявок:', error);
        }
        setLoadingApplications(false);
      };
      fetchApplications();
    }
  }, [project]);

  const handleApproveApplication = async (applicationId) => {
    try {
      await approveApplication(applicationId);
      alert('Заявка успешно утверждена!');
      setApplications(
        applications.map((app) =>
          app.id === applicationId ? { ...app, status: 'approved' } : app
        )
      );
    } catch (error) {
      console.error('Ошибка утверждения заявки:', error);
      alert('Не удалось утвердить заявку.');
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

          <h3>Заявки на проект</h3>
          <div className="project-list">
            {loadingApplications ? (
              <p>Загрузка заявок...</p>
            ) : applications.length > 0 ? (
              applications.map((app) => (
                <div key={app.id} className="application-item">
                  <p><label>Студент ID:</label> {app.student_id}</p>
                  <p><label>Статус заявки:</label> {app.status}</p>
                  {app.status === 'pending' && (
                    <button
                      className="cta-button"
                      onClick={() => handleApproveApplication(app.id)}
                    >
                      Утвердить
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>Заявок на этот проект нет.</p>
            )}
          </div>

          <div className="button-container">
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

  return (
    <div className="card">
      <h2>Проекты кафедры</h2>
      <div className="project-details">
        <div className="project-list">
          {availableProjects.length > 0 ? (
            availableProjects.map((proj) => (
              <div key={proj.id} className="project-item">
                <p><label>Название:</label> {proj.title}</p>
                <p><label>Статус:</label> {proj.status}</p>
                <p><label>Компания ID:</label> {proj.company_user_id}</p>
                <button
                  className="cta-button"
                  onClick={() => navigate(`/projects/${proj.id}`)}
                >
                  Подробнее
                </button>
              </div>
            ))
          ) : (
            <p>Проектов по вашей кафедре не найдено.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeadOfDepartmentProjects;
