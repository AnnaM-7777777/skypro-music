'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navigation.module.css';
import Image from 'next/image';

export default function Navigation() {
    const [isDarkTheme, setIsDarkTheme] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkTheme(savedTheme === 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDarkTheme;
        setIsDarkTheme(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
        document.documentElement.classList.toggle('item__lightTheme', !newTheme);
    };

    // Открытие/закрытие меню
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Закрытие меню при клике на ссылку
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className={styles.nav}>
            <div className={styles.nav__logo}>
                <Image width={113} height={17} src='/img/logo.png' alt='logo' />
            </div>

            {/* Бургер-кнопка */}
            <div
                className={`${styles.nav__burger} ${isMenuOpen ? styles.nav__burger_active : ''}`}
                onClick={toggleMenu}
            >
                <span className={styles.burger__line}></span>
                <span className={styles.burger__line}></span>
                <span className={styles.burger__line}></span>
            </div>

            {/* Меню внутри бургера */}
            <div className={`${styles.nav__menu} ${isMenuOpen ? styles.nav__menuOpen : ''}`}>
                <ul className={styles.menu__list}>
                    <li className={styles.menu__item}>
                        <Link href='/' className={styles.menu__link} onClick={closeMenu}>
                            Главное
                        </Link>
                    </li>

                    <li className={styles.menu__item}>
                        <Link href='/playlist' className={styles.menu__link} onClick={closeMenu}>
                            Мой плейлист
                        </Link>
                    </li>

                    <li className={styles.menu__item}>
                        <Link href='/signup' className={styles.menu__link} onClick={closeMenu}>
                            Выйти
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
