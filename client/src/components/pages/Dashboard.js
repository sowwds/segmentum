import React, { useContext, useEffect} from 'react';
import { AuthContext } from '../../App';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  return (
    <div>
      <h1>Добро пожаловать, {user?.email || 'Гость'}</h1>
    </div>
  );
};

export default Dashboard;
