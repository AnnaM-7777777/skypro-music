'use client';

import { useEffect, useState } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
    message: string;
    duration?: number;
    icon?: React.ReactNode;
    onClose: () => void;
}

export default function Toast({ message, duration = 2000, icon, onClose }: ToastProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const showTimer = setTimeout(() => setVisible(true), 10);
        const hideTimer =
            duration > 0
                ? setTimeout(() => {
                      setVisible(false);
                      setTimeout(onClose, 200);
                  }, duration)
                : null;

        return () => {
            clearTimeout(showTimer);
            if (hideTimer) clearTimeout(hideTimer);
        };
    }, [duration, onClose]);

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
