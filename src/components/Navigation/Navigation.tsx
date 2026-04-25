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

    useEffect(() => {
        setMounted(true);
        checkAuth();
        const handleStorageChange = () => checkAuth();
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        if (isMenuOpen) checkAuth();
    }, [isMenuOpen]);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) setIsDarkTheme(savedTheme === 'dark');
    }, []);

    const toggleTheme = useCallback(() => {
        const newTheme = !isDarkTheme;
        setIsDarkTheme(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
        document.documentElement.classList.toggle('item__lightTheme', !newTheme);
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

    if (!mounted) {
        return (
            <nav className={styles.nav}>
                <Link href='/music/main' className={styles.nav__logo}>
                    <Image width={113} height={17} src='/img/logo.png' alt='logo' />
                </Link>
            </nav>
        );
    }

    return (
        <nav className={styles.nav}>
            <Link href='/music/main' className={styles.nav__logo}>
                <Image width={113} height={17} src='/img/logo.png' alt='logo' />
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
                                    xlinkHref={`/img/icon/sprite.svg#icon-${isDarkTheme ? 'sun' : 'moon'}`}
                                />
                            </svg>
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
