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
        let isActive = true;

        const fetchTracks = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers: HeadersInit = { 'Content-Type': 'application/json' };
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const res = await fetch(`${API_URL}/catalog/track/all/`, { headers });

                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

                const response = await res.json();
                const tracksData = Array.isArray(response)
                    ? response
                    : response.data || response.results || [];

                const processed = tracksData.map((t: TrackType) => ({
                    ...t,
                    track_file: getSafeTrackUrl(t.track_file),
                }));

                if (isActive) {
                    setTracks(processed);
                    console.log('🟢 Данные с СЕРВЕРА (треков:', processed.length, ')');
                }
            } catch (err) {
                console.warn('API unavailable, using fallback data:', err);
                // Фоллбэк на тестовые данные
                if (isActive) {
                    setTracks(data);
                    console.log('🟡 Данные из ФОЛЛБЭКА (треков:', data.length, ')');
                }
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        };

        fetchTracks();

        return () => {
            isActive = false;
        };
    }, []);

    if (loading) {
        return <PageLayout tracks={[]} isLoading={true} />;
    }

    return <PageLayout tracks={tracks} />;
}
