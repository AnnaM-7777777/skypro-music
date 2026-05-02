'use client';

import { useEffect, useState } from 'react';
import Toast from '../Toast/Toast';

export default function NetworkToast() {
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const handleOffline = () => setMessage('Нет подключения к интернету');
        const handleOnline = () => {
            setMessage('Подключение восстановлено');
            setTimeout(() => setMessage(null), 2000);
        };

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    if (!message) return null;

    const icon = message.includes('Нет подключения') ? '🔴' : '🟢';

    return <Toast message={message} icon={icon} onClose={() => setMessage(null)} />;
}
