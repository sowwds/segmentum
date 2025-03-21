import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../App';
import { getProjects } from '../services/api'; // Предполагаем, что это сервис для API
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap'; // Используем react-bootstrap

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        switch (user.role) {
          case 'company':
            const companyProjects = await getProjects({ company: 'my' });
            setData(companyProjects.data);
            break;
          case 'student':
            const studentProjects = await getProjects({ assigned_to: 'me' });
            setData(studentProjects.data);
            break;
          case 'head_of_department':
            const deptProjects = await getProjects({ department: 'mine', status: 'pending' });
            setData(deptProjects.data);
            break;
          case 'admin':
            const allProjects = await getProjects();
            setData(allProjects.data);
            break;
          default:
            setData([]);
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };
    fetchData();
  }, [user, navigate]);

  const renderContent = () => {
    if (!user || !data) return <p>Загрузка...</p>;

    switch (user.role) {
      case 'company':
        return (
          <>
            <h2>Ваши проекты</h2>
            {data.length > 0 ? (
              data.map((project) => (
                <Card key={project.id} className="mb-3">
                  <Card.Body>
                    <Card.Title>{project.title}</Card.Title>
                    <Card.Text>{project.status}</Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      Подробнее
                    </Button>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>У вас пока нет проектов. Создайте новый!</p>
            )}
            <Button variant="success" onClick={() => navigate('/projects/new')}>
              Создать проект
            </Button>
          </>
        );
      case 'student':
        return (
          <>
            <h2>Ваши проекты</h2>
            {data.length > 0 ? (
              data.map((project) => (
                <Card key={project.id} className="mb-3">
                  <Card.Body>
                    <Card.Title>{project.title}</Card.Title>
                    <Card.Text>Статус: {project.status}</Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      Подробнее
                    </Button>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>Вы пока не назначены на проекты. Посмотрите доступные проекты!</p>
            )}
            <Button variant="primary" onClick={() => navigate('/projects')}>
              Найти проекты
            </Button>
          </>
        );
      case 'head_of_department':
        return (
          <>
            <h2>Проекты кафедры (ожидают назначения)</h2>
            {data.length > 0 ? (
              data.map((project) => (
                <Card key={project.id} className="mb-3">
                  <Card.Body>
                    <Card.Title>{project.title}</Card.Title>
                    <Card.Text>Компания: {project.company_user_id}</Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      Назначить студентов
                    </Button>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>Нет проектов, ожидающих назначения.</p>
            )}
          </>
        );
      case 'admin':
        return (
          <>
            <h2>Обзор системы</h2>
            <p>Всего проектов: {data.length}</p>
            <Button variant="primary" onClick={() => navigate('/admin/projects')}>
              Управление проектами
            </Button>
            <Button variant="secondary" onClick={() => navigate('/admin/users')}>
              Управление пользователями
            </Button>
          </>
        );
      default:
        return <p>Добро пожаловать!</p>;
    }
  };

  return (
    <Container className="mt-4">
      <h1>Добро пожаловать, {user?.name || 'Гость'}</h1>
      {renderContent()}
    </Container>
  );
};

export default Dashboard;
