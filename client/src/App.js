import React, { createContext, useState, useEffect, useContext } from 'react'; // Добавлен useContext
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/common/Header';
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import Projects from './components/pages/Projects';
import { getUser } from './components/services/authService';

// Создаем контекст для хранения данных пользователя
export const AuthContext = createContext();

// Компонент для защиты маршрутов
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext); // Теперь useContext определен
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user && !localStorage.getItem('token')) {
      navigate('/login', { state: { from: location } });
    }
  }, [user, navigate, location]);

  return user ? children : null;
};

function App() {
  const [user, setUser] = useState(null);

  // Обработка токена из URL и загрузка профиля пользователя
  useEffect(() => {
    const fetchUser = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (token) {
        localStorage.setItem('token', token); // Сохраняем токен из URL
        window.history.replaceState({}, document.title, window.location.pathname); // Убираем token из URL
      }

      if (localStorage.getItem('token')) {
        try {
          const userData = await getUser(); // Запрос профиля с токеном
          setUser(userData);
        } catch (error) {
          console.error('Ошибка загрузки профиля:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Header />
        <main>
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
            {/* Можно добавить маршрут для админа позже, например /admin/* */}
            <Route path="*" element={<NavigateToLogin />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

// Компонент для редиректа на логин при неизвестных маршрутах
const NavigateToLogin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/login');
  }, [navigate]);
  return null;
};

export default App;
