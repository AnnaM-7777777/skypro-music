'use client';

import { useState, useEffect } from 'react';
import styles from './IconLogout.module.css';

export default function IconLogout() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Проверяем токен при загрузке компонента
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/auth/signin';
    };

    return (
        <div
            className={styles.sidebar__icon}
            style={{ cursor: 'pointer' }}
            onClick={handleLogout}
            title={isAuthenticated ? 'Выйти' : 'Войти'}
        >
            <svg>
                <use xlinkHref='/img/icon/sprite.svg#logout' />
            </svg>
        </div>
    );
}
