'use client';

import { ReactNode, useEffect } from 'react';
import styles from './layout.module.css';

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    // Синхронизация темы (на всякий случай, если корневой скрипт не сработал)
    useEffect(() => {
        const theme =
            localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
        document.documentElement.setAttribute('data-theme', theme);
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.containerEnter}>
                <div className={styles.modal__block}>{children}</div>
            </div>
        </div>
    );
}
