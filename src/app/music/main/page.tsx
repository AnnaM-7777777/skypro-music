import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import styles from './page.module.css';
import Navigation from '@/components/Navigation/Navigation';
import CenterBlock from '@/components/CenterBlock/CenterBlock';
import Sidebar from '@/components/Sidebar/Sidebar';

import { getSafeTrackUrl } from '@/utils/testTracks';
import { data } from '@/app/data';
import { TrackType } from '@/sharedTypes/sharedTypes';

const API_URL = 'https://webdev-music-003b5b991590.herokuapp.com';

async function getTracks(token?: string): Promise<TrackType[]> {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const res = await fetch(`${API_URL}/catalog/track/all/`, {
            method: 'GET',
            headers,
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            if (res.status === 401) redirect('/auth/signin');
            console.error('API error:', res.status);
            return data; // Фоллбэк на моковые данные
        }

        const response = await res.json();
        console.log('API response type:', typeof response);
        console.log('API response:', response);

        // Обрабатываем разные форматы ответа
        let tracks: TrackType[] = [];

        if (Array.isArray(response)) {
            // Если пришёл сразу массив
            tracks = response;
        } else if (response?.results && Array.isArray(response.results)) {
            // Если пришёл объект { results: [...] }
            tracks = response.results;
        } else if (response?.data && Array.isArray(response.data)) {
            // Если пришёл объект { data: [...] }
            tracks = response.data;
        } else if (response?.tracks && Array.isArray(response.tracks)) {
            // Если пришёл объект { tracks: [...] }
            tracks = response.tracks;
        } else {
            console.warn('Unexpected API response format, using mock data');
            return data;
        }

        console.log('🎵 Parsed tracks count:', tracks.length);

        // Подменяем ссылки через вашу функцию
        return tracks.map(track => ({
            ...track,
            track_file: getSafeTrackUrl(track.track_file),
        }));
    } catch (err) {
        console.error('Fetch error:', err);
        return data;
    }
}

export default async function MusicMain() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const tracks = await getTracks(token);

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <main className={styles.main}>
                    <Navigation />
                    <CenterBlock tracks={tracks} />
                    <Sidebar />
                </main>
                <footer className='footer'></footer>
            </div>
        </div>
    );
}
