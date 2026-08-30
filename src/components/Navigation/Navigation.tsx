'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './Navigation.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/store';
import { setFavorites } from '@/store/features/favoritesSlice';

export default function Navigation() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [isDarkTheme, setIsDarkTheme] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [mounted, setMounted] = useState(false);

    const checkAuth = () => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    };

    // Инициализация: тема + авторизация
    useEffect(() => {
        setMounted(true);
        checkAuth();

        // Загружаем сохранённую тему или системную настройку
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        const initialDark = savedTheme ? savedTheme === 'dark' : !systemPrefersLight;

        setIsDarkTheme(initialDark);
        document.documentElement.setAttribute('data-theme', initialDark ? 'dark' : 'light');

        const handleStorageChange = () => checkAuth();
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        if (isMenuOpen) checkAuth();
    }, [isMenuOpen]);

    // Переключение темы
    const toggleTheme = useCallback(() => {
        const newDark = !isDarkTheme;
        setIsDarkTheme(newDark);
        localStorage.setItem('theme', newDark ? 'dark' : 'light');
        // Применяем data-theme
        document.documentElement.setAttribute('data-theme', newDark ? 'dark' : 'light');
    }, [isDarkTheme]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = useCallback(() => setIsMenuOpen(false), []);

    const handleAuth = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            closeMenu();

            if (isAuthenticated) {
                localStorage.removeItem('token');
                localStorage.removeItem('favorites');
                localStorage.removeItem('username');
                setIsAuthenticated(false);
                dispatch(setFavorites({ trackIds: [], tracks: [] }));
            }
            router.push('/auth/signin');
        },
        [isAuthenticated, dispatch, router, closeMenu]
    );

    const logoSrc = isDarkTheme ? '/img/logo-light.png' : '/img/logo-dark.png';

    // SSR-защита: не рендерим интерактив до гидратации
    if (!mounted) {
        return (
            <nav className={styles.nav}>
                <Link href='/music/main' className={styles.nav__logo}>
                    <Image width={113} height={17} src='/img/logo-light.png' alt='logo' />
                </Link>
            </nav>
        );
    }

    return (
        <nav className={styles.nav}>
            <Link href='/music/main' className={styles.nav__logo}>
                <Image width={113} height={17} src={logoSrc} alt='logo' priority />
            </Link>

            <div
                className={`${styles.nav__burger} ${isMenuOpen ? styles.nav__burger_active : ''}`}
                onClick={toggleMenu}
            >
                <span className={styles.burger__line}></span>
                <span className={styles.burger__line}></span>
                <span className={styles.burger__line}></span>
            </div>

            <div className={`${styles.nav__menu} ${isMenuOpen ? styles.nav__menuOpen : ''}`}>
                <ul className={styles.menu__list}>
                    <li className={styles.menu__item}>
                        <Link href='/music/main' className={styles.menu__link} onClick={closeMenu}>
                            Главное
                        </Link>
                    </li>

                    {isAuthenticated && (
                        <li className={styles.menu__item}>
                            <Link
                                href='/music/playlist'
                                className={styles.menu__link}
                                onClick={closeMenu}
                            >
                                Мой плейлист
                            </Link>
                        </li>
                    )}

                    <li className={styles.menu__item}>
                        <Link
                            href='/auth/signin'
                            className={styles.menu__link}
                            onClick={handleAuth}
                        >
                            {isAuthenticated ? 'Выйти' : 'Войти'}
                        </Link>
                    </li>

                    {/* Кнопка переключения темы */}
                    <li className={styles.menu__item}>
                        <button
                            className={styles.item__btnToggleTheme}
                            onClick={toggleTheme}
                            aria-label={
                                isDarkTheme ? 'Включить светлую тему' : 'Включить тёмную тему'
                            }
                        >
                            <svg className={styles.item__iconTheme} width='20' height='20'>
                                <use
                                    xlinkHref={`/img/icon/sprite.svg#icon-${isDarkTheme ? 'moon' : 'sun'}`}
                                />
                            </svg>
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
