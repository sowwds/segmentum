import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../App';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjects, getProjectById, createProject, applyToProject } from '../services/api';
import { Container, Card, Button, Form } from 'react-bootstrap';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams(); // ID проекта из URL
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', department_id: '' });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        if (id) {
          // Детали конкретного проекта
          const response = await getProjectById(id);
          setProject(response.data);
        } else if (window.location.pathname === '/projects/new') {
          // Ничего не загружаем, показываем форму
        } else {
          // Список проектов
          let params = {};
          if (user.role === 'company') params = { company: 'my' };
          if (user.role === 'student') params = { department: user.department_id, status: 'pending' };
          if (user.role === 'head_of_department') params = { department: 'mine' };
          const response = await getProjects(params);
          setProjects(response.data);
        }
      } catch (error) {
        console.error('Ошибка загрузки проектов:', error);
      }
    };
    fetchData();
  }, [user, id, navigate]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await createProject(formData);
      navigate(`/projects/${response.data.id}`);
    } catch (error) {
      console.error('Ошибка создания проекта:', error);
    }
  };

  const handleApply = async () => {
    try {
      await applyToProject(id);
      alert('Заявка успешно подана!');
    } catch (error) {
      console.error('Ошибка подачи заявки:', error);
    }
  };

  const renderContent = () => {
    if (!user) return null;

    if (id && project) {
      // Детали проекта
      return (
        <Card>
          <Card.Body>
            <Card.Title>{project.title}</Card.Title>
            <Card.Text>{project.description}</Card.Text>
            <Card.Text>Статус: {project.status}</Card.Text>
            {user.role === 'student' && project.status === 'pending' && (
              <Button variant="primary" onClick={handleApply}>
                Подать заявку
              </Button>
            )}
            {user.role === 'company' && (
              <Button variant="secondary" onClick={() => navigate('/projects')}>
                Назад к списку
              </Button>
            )}
            {user.role === 'head_of_department' && (
              <Button variant="primary" onClick={() => navigate(`/projects/${id}`)}>
                Назначить студентов
              </Button>
            )}
          </Card.Body>
        </Card>
      );
    } else if (window.location.pathname === '/projects/new' && user.role === 'company') {
      // Форма создания проекта
      return (
        <Form onSubmit={handleCreateProject}>
          <Form.Group className="mb-3">
            <Form.Label>Название проекта</Form.Label>
            <Form.Control
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Описание</Form.Label>
            <Form.Control
              as="textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Кафедра</Form.Label>
            <Form.Control
              type="text"
              value={formData.department_id}
              onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
              required
            />
          </Form.Group>
          <Button type="submit" variant="success">
            Создать проект
          </Button>
        </Form>
      );
    } else {
      // Список проектов
      return (
        <>
          <h2>Проекты</h2>
          {projects.length > 0 ? (
            projects.map((proj) => (
              <Card key={proj.id} className="mb-3">
                <Card.Body>
                  <Card.Title>{proj.title}</Card.Title>
                  <Card.Text>Статус: {proj.status}</Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/projects/${proj.id}`)}
                  >
                    Подробнее
                  </Button>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>Проектов не найдено.</p>
          )}
          {user.role === 'company' && (
            <Button variant="success" onClick={() => navigate('/projects/new')}>
              Создать проект
            </Button>
          )}
        </>
      );
    }
  };

  return (
    <Container className="mt-4">
      {renderContent()}
    </Container>
  );
};

export default Projects;
