'use client';

import { useState, useEffect } from 'react';
import Toast from '@/components/Toast/Toast';

export default function ApiErrorToast() {
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const handler = (e: Event) => {
            const customEvent = e as CustomEvent<{ message: string }>;
            setMessage(customEvent.detail.message);
            setTimeout(() => setMessage(null), 4000);
        };

        window.addEventListener('showApiErrorToast', handler as EventListener);
        return () => window.removeEventListener('showApiErrorToast', handler as EventListener);
    }, []);

    if (!message) return null;

    return <Toast message={message} onClose={() => setMessage(null)} />;
}
