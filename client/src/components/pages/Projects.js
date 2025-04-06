import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../App';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjects, getApplications } from '../services/api';
import StudentProjects from '../Student/StudentProjects';
import CompanyProjects from '../Company/CompanyProjects';
import HeadOfDepartmentProjects from '../Department/HeadOfDepartmentProjects';
import { Container } from 'react-bootstrap';
import '../pages/Projects.css';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams(); // ID проекта из URL
  const navigate = useNavigate();
  const [myProjects, setMyProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [project, setProject] = useState(null);
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
          case 'head_of_department':
            await fetchHeadOfDepartmentData();
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

  const fetchStudentData = async () => {
    if (id) {
      const response = await getProjects({ id });
      setProject(response.data[0]);
    } else {
      const applicationsResponse = await getApplications({ userId: user.id });
      const myProjectsResponse = await getProjects({ userId: user.id });
      const allProjectsResponse = await getProjects({ departmentId: user.department_id });
      const initializedProjects = allProjectsResponse.data.filter(
        (proj) => proj.status === 'initialized'
      );
      setApplications(applicationsResponse.data);
      setMyProjects(myProjectsResponse.data);
      setAvailableProjects(initializedProjects);
    }
  };

  const fetchCompanyData = async () => {
    if (id) {
      const response = await getProjects({ id });
      setProject(response.data[0]);
    } else {
      const myProjectsResponse = await getProjects({ companyId: user.id });
      setMyProjects(myProjectsResponse.data);
      setAvailableProjects([]);
    }
  };

  const fetchHeadOfDepartmentData = async () => {
    if (id) {
      const response = await getProjects({ id });
      setProject(response.data[0]);
    } else {
      const allProjectsResponse = await getProjects({ departmentId: user.department_id });
      setAvailableProjects(allProjectsResponse.data);
    }
  };

  const renderContent = () => {
    if (!user) return null;
    if (loading) return <p>Загрузка...</p>;

    switch (user.role) {
      case 'student':
        return (
          <StudentProjects
            project={project}
            applications={applications}
            myProjects={myProjects}
            availableProjects={availableProjects}
            user={user}
            navigate={navigate}
            setProject={setProject}
          />
        );
      case 'company':
        return (
          <CompanyProjects
            project={project}
            myProjects={myProjects}
            user={user}
            navigate={navigate}
            setProject={setProject}
          />
        );
      case 'head_of_department':
        return (
          <HeadOfDepartmentProjects
            project={project}
            availableProjects={availableProjects}
            user={user}
            navigate={navigate}
            setProject={setProject}
          />
        );
      default:
        return <p>Ваша роль не поддерживается.</p>;
    }
  };

  return <Container className="mt-4">{renderContent()}</Container>;
};

export default Projects;
