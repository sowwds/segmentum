import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import { logoutUser } from '../services/authService';
import './header.css';

const Header = () => {
  console.log('Компонент Header рендерится'); // Проверка рендера

  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  const renderNavLinks = () => {
    console.log('renderNavLinks вызван, user =', user);
    const commonLinks = (
      <>
        <a href="/dashboard">Главная</a>
        <a href="/projects">Проекты</a>
      </>
    );

    if (!user) return commonLinks;
    switch (user.role) {
      case 'student':
        console.log("ПОЛУЧЕН ЮЗЕР STUDENT");
        return (
          <>
            {commonLinks}
              <a href="/profile">Профиль</a>
              <a href="/notifications">
                Уведомления
                {user.unreadNotifications > 0 && (
                  <span>{user.unreadNotifications}</span>
                )}
              </a>
          </>
        );
      case 'company':
        return commonLinks;
      case 'head_of_department':
        return commonLinks;
      case 'admin':
      default:
        return null;
    }
  };

  const hamburgerBtn = React.useRef();
  const mobileMenu = React.useRef();
  const [HamburgerBtnVisible, setHamburgerBtnVisible] = useState(false)
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false)
  useEffect(() => {
    if (HamburgerBtnVisible && mobileMenuVisible) {
        console.log("hamburger visible", hamburgerBtn.current);
        const hamburger = hamburgerBtn.current;
        const menu = mobileMenu.current;
      const openMenu = () => {
        console.log('Открываем меню');
        menu.classList.add("open");
        hamburger.classList.add("open");
      };

      const closeMenu = () => {
        console.log('Закрываем меню');
        menu.classList.remove("open");
        hamburger.classList.remove("open");
      };

      hamburger.addEventListener("click", openMenu);
      menu.addEventListener("click", closeMenu);

      return () => {
        console.log('Очистка обработчиков событий');
        hamburger.removeEventListener("click", openMenu);
        menu.removeEventListener("click", closeMenu);
      };
    } else {
      console.log('hamburger или menu отсутствуют');
    }
  }, [user, HamburgerBtnVisible, mobileMenuVisible]);

  return (
    <div>
      <div className="header-container">
        <div className="logo">segmentum</div>
        <div className="desktop-nav">{renderNavLinks()}</div>
        {user ? (
          <div className="button-container">
            <span>{user.name}</span>
            <button className="cta-button" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        ) : (
          <div className="button-container">
            <button className="cta-button" onClick={() => navigate('/login')}>
              Войти
            </button>
          </div>
        )}
        <button className="hamburger" ref={el => {hamburgerBtn.current = el; setHamburgerBtnVisible(!!el);}}>
              <span></span>
              <span></span>
              <span></span>
            </button>
      </div>
      <div className="mobile-menu" ref={el => {mobileMenu.current = el; setMobileMenuVisible(!!el);}}>
        {renderNavLinks()}
        {user ? (
          <div className="button-container">
            <span>{user.name}</span>
            <button className="mobile-cta-button" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        ) : (
          <div className="button-container">
            <button className="mobile-cta-button" onClick={() => navigate('/login')}>
              Войти
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
