import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../App';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjects, getProjectById, applyToProject, getDepartments, getApplications } from '../services/api'; // Добавляем getApplications
import { Container, Card, Button } from 'react-bootstrap';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams(); // ID проекта из URL
  const navigate = useNavigate();
  const [myProjects, setMyProjects] = useState([]); // Проекты, в которых участвует студент
  const [applications, setApplications] = useState([]); // Заявки студента
  const [availableProjects, setAvailableProjects] = useState([]); // Свободные проекты по кафедре
  const [project, setProject] = useState(null); // Детали конкретного проекта
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        switch (user.role) {
          case 'student':
            await fetchStudentData();
            break;
          case 'company':
            await fetchCompanyData();
            break;
          default:
            console.warn('Роль пользователя не поддерживается:', user.role);
        }
        setLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [user, id, navigate]);

  // Логика загрузки данных для студента
  const fetchStudentData = async () => {
    if (id) {
      // Детали конкретного проекта
      const response = await getProjects({ id });
      setProject(response.data[0]);
    } else {
      // 1. Получаем заявки студента
      const applicationsResponse = await getApplications({ userId: user.id });
      setApplications(applicationsResponse.data);

      // 2. Получаем проекты, в которых участвует студент
      const myProjectsResponse = await getProjects({ userId: user.id });
      setMyProjects(myProjectsResponse.data);

      // 3. Получаем свободные проекты по кафедре студента (status: initialized)
      const allProjectsResponse = await getProjects({ departmentId: user.department_id });
      const initializedProjects = allProjectsResponse.data.filter(
        (proj) => proj.status === 'initialized'
      );
      setAvailableProjects(initializedProjects);
    }
  };

  // Логика загрузки данных для компании (оставляем как было)
  const fetchCompanyData = async () => {
    if (id) {
      const response = await getProjects({ id });
      setProject(response.data[0]);
    } else {
      const [myProjectsResponse, allProjectsResponse] = await Promise.all([
        getProjects({ userId: user.id }),
        getProjects({}),
      ]);
      setMyProjects(myProjectsResponse.data);
      setAvailableProjects(allProjectsResponse.data); // Для компании это "все проекты"
    }
  };

  // Функция подачи заявки на проект
  const handleApply = async (projectId) => {
    try {
      await applyToProject(projectId);
      alert('Заявка успешно подана!');
      // Обновляем список доступных проектов после подачи заявки
      const updatedProjects = availableProjects.filter((proj) => proj.id !== projectId);
      setAvailableProjects(updatedProjects);
    } catch (error) {
      console.error('Ошибка подачи заявки:', error);
      alert('Не удалось подать заявку.');
    }
  };

  // Рендеринг в зависимости от роли
  const renderContent = () => {
    if (!user) return null;
    if (loading) return <p>Загрузка...</p>;

    switch (user.role) {
      case 'student':
        return renderStudentContent();
      case 'company':
        return renderCompanyContent();
      default:
        return <p>Ваша роль не поддерживается.</p>;
    }
  };

  // Рендеринг для студента
  const renderStudentContent = () => {
    if (id && project) {
      // Детали конкретного проекта
      return (
        <Card>
          <Card.Body>
            <Card.Title>{project.title}</Card.Title>
            <Card.Text>{project.description}</Card.Text>
            <Card.Text>Статус: {project.status}</Card.Text>
            <Card.Text>Цена: {project.price} руб.</Card.Text>
            <Card.Text>Дата начала: {new Date(project.start_date).toLocaleDateString()}</Card.Text>
            {project.status === 'initialized' && (
              <Button variant="primary" onClick={() => handleApply(project.id)}>
                Подать заявку
              </Button>
            )}
            <Button variant="secondary" onClick={() => navigate('/projects')}>
              Назад к списку
            </Button>
          </Card.Body>
        </Card>
      );
    }

    // Главная страница студента
    return (
      <>
        <h2>Мои заявки</h2>
        {applications.length > 0 ? (
          applications.map((app) => (
            <Card key={app.id} className="mb-3">
              <Card.Body>
                <Card.Title>{app.project_title || 'Проект #' + app.project_id}</Card.Title>
                <Card.Text>Статус заявки: {app.status}</Card.Text>
                <Button variant="primary" onClick={() => navigate(`/projects/${app.project_id}`)}>
                  Подробнее
                </Button>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>У вас пока нет заявок.</p>
        )}

        <h2 className="mt-5">Мои проекты</h2>
        {myProjects.length > 0 ? (
          myProjects.map((proj) => (
            <Card key={proj.id} className="mb-3">
              <Card.Body>
                <Card.Title>{proj.title}</Card.Title>
                <Card.Text>Статус: {proj.status}</Card.Text>
                <Button variant="primary" onClick={() => navigate(`/projects/${proj.id}`)}>
                  Подробнее
                </Button>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>У вас пока нет проектов.</p>
        )}

        <h2 className="mt-5">Доступные проекты</h2>
        {availableProjects.length > 0 ? (
          availableProjects.map((proj) => (
            <Card key={proj.id} className="mb-3">
              <Card.Body>
                <Card.Title>{proj.title}</Card.Title>
                <Card.Text>{proj.description}</Card.Text>
                <Card.Text>Цена: {proj.price} руб.</Card.Text>
                <Button variant="primary" onClick={() => navigate(`/projects/${proj.id}`)}>
                  Подробнее
                </Button>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>Нет доступных проектов по вашей кафедре.</p>
        )}
      </>
    );
  };

  // Рендеринг для компании (оставляем как было с небольшими упрощениями)
  const renderCompanyContent = () => {
    if (id && project) {
      return (
        <Card>
          <Card.Body>
            <Card.Title>{project.title}</Card.Title>
            <Card.Text>{project.description}</Card.Text>
            <Card.Text>Статус: {project.status}</Card.Text>
            <Button variant="secondary" onClick={() => navigate('/projects')}>
              Назад к списку
            </Button>
          </Card.Body>
        </Card>
      );
    }
    return (
      <>
        <h2>Мои проекты</h2>
        {myProjects.map((proj) => (
          <Card key={proj.id} className="mb-3">
            <Card.Body>
              <Card.Title>{proj.title}</Card.Title>
              <Card.Text>Статус: {proj.status}</Card.Text>
              <Button variant="primary" onClick={() => navigate(`/projects/${proj.id}`)}>
                Подробнее
              </Button>
            </Card.Body>
          </Card>
        ))}
        <h2 className="mt-5">Все проекты</h2>
        {availableProjects.map((proj) => (
          <Card key={proj.id} className="mb-3">
            <Card.Body>
              <Card.Title>{proj.title}</Card.Title>
              <Card.Text>Статус: {proj.status}</Card.Text>
              <Button variant="primary" onClick={() => navigate(`/projects/${proj.id}`)}>
                Подробнее
              </Button>
            </Card.Body>
          </Card>
        ))}
        <Button variant="success" onClick={() => navigate('/projects/new')}>
          Создать проект
        </Button>
      </>
    );
  };

  return (
    <Container className="mt-4">
      {renderContent()}
    </Container>
  );
};

export default Projects;
