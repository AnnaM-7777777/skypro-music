'use client';

import { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout/PageLayout';
import { getSafeTrackUrl } from '@/utils/testTracks';
import { data } from '@/app/data';
import { TrackType } from '@/sharedTypes/sharedTypes';

const API_URL = 'https://webdev-music-003b5b991590.herokuapp.com';

export default function MusicMain() {
    const [tracks, setTracks] = useState<TrackType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true; // Флаг монтирования

        const fetchTracks = async () => {
            // Микро-задержка перед запросом (даём время на синхронизацию токена)
            await new Promise(resolve => setTimeout(resolve, 100));
            if (!isMounted) return; // Если размонтировали — не продолжаем

            try {
                // Токен добавляем только если есть
                const token = localStorage.getItem('token');
                const headers: HeadersInit = { 'Content-Type': 'application/json' };
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const res = await fetch(`${API_URL}/catalog/track/all/`, { headers });
                if (!res.ok) throw new Error('Failed to fetch');

                const response = await res.json();
                const tracksData = Array.isArray(response)
                    ? response
                    : response.data || response.results || [];

                const processed = tracksData.map((t: TrackType) => ({
                    ...t,
                    track_file: getSafeTrackUrl(t.track_file),
                }));

                if (isMounted) setTracks(processed);
            } catch (err) {
                console.error('Error:', err);
                if (isMounted) setTracks(data);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchTracks();

        // Cleanup: сбрасываем флаг при размонтировании
        return () => {
            isMounted = false;
        };
    }, []); // Пустой массив зависимостей = запуск только при монтировании

    // Показываем скелетон пока грузятся данные
    if (loading) {
        return <PageLayout tracks={[]} isLoading={true} />;
    }

    return <PageLayout tracks={tracks} />;
}
