'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/PageLayout/PageLayout';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setFavorites, setLoading, selectFavoriteTracks } from '@/store/features/favoritesSlice';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { getSafeTrackUrl } from '@/utils/testTracks';
import { withReauth } from '@/utils/withReauth';

const API_URL = 'https://webdev-music-003b5b991590.herokuapp.com';

export default function PlaylistPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const favoriteTracks = useAppSelector(selectFavoriteTracks);
    const isLoading = useAppSelector(state => state.favorites.isLoading);

    useEffect(() => {
        const loadFavorites = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/signin');
                return;
            }

            dispatch(setLoading(true));

            try {
                // Запрос к бэкенду
                const data = await withReauth(async (accessToken: string) => {
                    const response = await fetch(`${API_URL}/catalog/track/favorite/all/`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        const error: any = new Error(`Error: ${response.status}`);
                        error.status = response.status;
                        throw error;
                    }
                    return response.json();
                });

                // Обработка ответа с сервера
                const tracks: TrackType[] = data.data || data.tracks || data || [];
                const safeTracks = tracks.map((track: TrackType) => ({
                    ...track,
                    track_file: getSafeTrackUrl(track.track_file),
                }));

                dispatch(
                    setFavorites({
                        trackIds: safeTracks.map(t => t._id),
                        tracks: safeTracks,
                    })
                );
            } catch (err) {
                // Фоллбэк: если сервер упал, пробуем localStorage
                const saved = localStorage.getItem('favorites');
                if (saved) {
                    try {
                        const savedTracks: TrackType[] = JSON.parse(saved);
                        dispatch(
                            setFavorites({
                                trackIds: savedTracks.map(t => t._id),
                                tracks: savedTracks,
                            })
                        );
                    } catch (e) {}
                }
            } finally {
                dispatch(setLoading(false));
            }
        };
        loadFavorites();
    }, [dispatch, router]);

    const isClient = typeof window !== 'undefined';
    const hasToken = isClient ? !!localStorage.getItem('token') : false;
    if (!hasToken && isClient) {
        router.replace('/auth/signin');
        return (
            <PageLayout tracks={[]} title='Мой плейлист' isLoading={true} showEmptyState={true} />
        );
    }

    // Если треков нет — передаём пустой массив, CenterBlock покажет пустое состояние
    return (
        <PageLayout
            tracks={favoriteTracks}
            title='Мой плейлист'
            isLoading={isLoading}
            showEmptyState={true}
        />
    );
}
