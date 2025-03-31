import React, { createContext, useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/common/Header';
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import Projects from './components/pages/Projects';
import Profile from './components/pages/Profile';
import { getUser } from './components/services/authService';

export const AuthContext = createContext();

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user && !localStorage.getItem('token')) {
      console.log('PrivateRoute: Нет user и token, перенаправляем на /login');
      navigate('/login', { state: { from: location } });
    }
  }, [user, isLoading, navigate, location]);

  if (isLoading) {
    return <div>Загрузка...</div>; // Показываем индикатор загрузки
  }

  return user ? children : null;
};

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true); // Начало загрузки
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (token) {
        console.log('Токен из URL:', token);
        localStorage.setItem('token', token);
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      if (localStorage.getItem('token')) {
        try {
          console.log('Запрашиваем профиль пользователя с токеном:', localStorage.getItem('token'));
          const userData = await getUser();
          console.log('Профиль получен:', userData);
          setUser(userData);
        } catch (error) {
          console.error('Ошибка в fetchUser:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setIsLoading(false); // Завершение загрузки
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      <BrowserRouter>
        <Header />
        <div className="content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <PrivateRoute>
                  <Projects />
                </PrivateRoute>
              }
            />
            <Route
              path="/projects/new"
              element={
                <PrivateRoute>
                  <Projects />
                </PrivateRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <PrivateRoute>
                  <Projects />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NavigateToLogin />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

const NavigateToLogin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/login');
  }, [navigate]);
  return null;
};

export default App;
