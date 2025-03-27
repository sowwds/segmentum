import React, { useContext, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App'; // Предполагаем, что контекст определён в App.js
import { logoutUser } from '../services/authService';
import "./header.css";

const Header = () => {
    const { user, setUser } = useContext(AuthContext); // Данные пользователя из контекста
    const navigate = useNavigate();

    const handleLogout = async () => {
    try {
        await logoutUser(); // Вызов сервиса для выхода
        setUser(null); // Очистка контекста
        navigate('/login'); // Перенаправление на страницу входа
    } catch (error) {
        console.error('Ошибка при выходе:', error);
    }
    };



    // Условная навигация в зависимости от роли
    const renderNavLinks = () => {

        const commonLinks = (
            <>
            <a href="/dashboard">Главная</a>
            <a href="/projects">Проекты</a>
        </>
    );
    if (!user) return (<>{commonLinks}</>);

    switch (user.role) {
        case 'student':
        return (
            <>
            {commonLinks}
            <li className="nav-item">
                <Link className="nav-link" to="/notifications">
                Уведомления
                {/* Предполагается, что у студента есть непрочитанные уведомления */}
                {user.unreadNotifications > 0 && (
                    <span className="badge bg-danger ms-1">{user.unreadNotifications}</span>
                )}
                </Link>
            </li>
            </>
        );
        case 'company':
        case 'head_of_department':
            return commonLinks;
        case 'admin':
            return (
                <>
                    <li className="nav-item">
                        <Link className="nav-link" to="/admin/users">Пользователи</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/admin/projects">Проекты</Link>
                    </li>
                </>
            );
        default:
            return null;
    }
    };

    const hamburgerBtn = React.useRef();
    const mobileMenu = React.useRef();

    useEffect(() => {
        hamburgerBtn.current.addEventListener("click", function () {
            mobileMenu.current.classList.add("open");
            hamburgerBtn.current.classList.add("open");
        });

        mobileMenu.current.addEventListener("click", function () {
            mobileMenu.current.classList.remove("open");
            hamburgerBtn.current.classList.remove("open");
        });
    })


    return (
    <div>
    <div class="header-container">
        <div class="logo">
            segmentum
        </div>
        <div class="desktop-nav">
            {renderNavLinks()}
        </div>
        {user ? (
                <div class="button-container">
                    <span>{user.name}</span>
                    <button class="cta-button" onClick={handleLogout}>Выйти</button>
                </div>
            ) : (
                <div class="button-container">
                    <button class="cta-button">Войти</button>
                    <button class="hamburger" ref={el => {hamburgerBtn.current = el;}}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            )
        }

    </div>
    <div className="mobile-menu" ref={el => {mobileMenu.current = el;}}>
            {renderNavLinks()}
            <div className="button-container">
                <button class="white-cta-button">Войти</button>
            </div>
        </div>
    </div>
    );
};


export default Header;
