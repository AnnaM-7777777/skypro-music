'use client';

import { useEffect, useState } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
    message: string;
    duration?: number;
    onClose: () => void;
}

export default function Toast({ message, duration = 3000, onClose }: ToastProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Показываем с небольшой задержкой для анимации
        const showTimer = setTimeout(() => setVisible(true), 10);

        // Автоматическое закрытие
        const hideTimer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // Ждём завершения анимации
        }, duration);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [duration, onClose]);

    return (
        <div className={`${styles.toast} ${visible ? styles.toastVisible : ''}`}>
            <div className={styles.toast__content}>
                <span className={styles.toast__icon}>⚠️</span>
                <span className={styles.toast__message}>{message}</span>
            </div>
        </div>
    );
}
