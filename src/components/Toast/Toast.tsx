'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
    message: string;
    duration?: number;
    icon?: React.ReactNode;
    onClose: () => void;
}

export default function Toast({ message, duration = 2000, icon, onClose }: ToastProps) {
    const [visible, setVisible] = useState(false);

    // Храним onClose в ref — обновляем без перезапуска эффекта
    const onCloseRef = useRef(onClose);
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        const showTimer = setTimeout(() => setVisible(true), 10);
        const hideTimer =
            duration > 0
                ? setTimeout(() => {
                      setVisible(false);
                      // Вызываем актуальный onClose через ref
                      setTimeout(() => onCloseRef.current(), 200);
                  }, duration)
                : null;

        return () => {
            clearTimeout(showTimer);
            if (hideTimer) clearTimeout(hideTimer);
        };
        // Зависимость только от duration — эффект не перезапускается при изменении onClose
    }, [duration]);

    // Дефолтная иконка, если не передали свою
    const displayIcon = icon || 'ℹ️';

    return (
        <div className={`${styles.toast} ${visible ? styles.toastVisible : ''}`}>
            <div className={styles.toast__content}>
                <span className={styles.toast__icon}>{displayIcon}</span>
                <span className={styles.toast__message}>{message}</span>
            </div>
        </div>
    );
}
