'use client';

import { useEffect, useState } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
    message: string;
    duration?: number;
    type?: 'error' | 'success';
    onClose: () => void;
}

export default function Toast({ message, duration = 3000, type = 'error', onClose }: ToastProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const showTimer = setTimeout(() => setVisible(true), 10);
        const hideTimer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300);
        }, duration);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [duration, onClose]);

    // Иконка в зависимости от типа
    const icon = type === 'error' ? '⚠️' : '✅';

    return (
        <div
            className={`${styles.toast} ${visible ? styles.toastVisible : ''} ${type === 'success' ? styles.toast_success : styles.toast_error}`}
        >
            <div className={styles.toast__content}>
                <span className={styles.toast__icon}>{icon}</span>
                <span className={styles.toast__message}>{message}</span>
            </div>
        </div>
    );
}
