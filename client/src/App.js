import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom'; // Импорт BrowserRouter
import Header from './components/common/Header';   // Импорт Header
import AppRoutes from './routes';                   // Импорт AppRoutes
import { getUser } from './components/services/authService';   // Импорт сервиса для получения профиля

export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (localStorage.getItem('token')) {
        try {
          const userData = await getUser();
          setUser(userData);
        } catch (error) {
          console.error('Ошибка загрузки профиля:', error);
          localStorage.removeItem('token');
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
          <AppRoutes />
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
