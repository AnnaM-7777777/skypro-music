'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/PageLayout/PageLayout';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setFavorites, setLoading, selectFavoriteTracks } from '@/store/features/favoritesSlice';

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
                /* const response = await fetch(`${API_URL}/users/me/favorites/`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 401) {
                    localStorage.removeItem('token');
                    router.push('/auth/signin');
                    return;
                }

                if (!response.ok) throw new Error(`Error: ${response.status}`);

                const data = await response.json();
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
                ); */

                // Временное решение: читаем избранное из localStorage
                const saved = localStorage.getItem('favorites');
                if (saved) {
                    const savedIds: number[] = JSON.parse(saved);
                    dispatch(setFavorites({ trackIds: savedIds, tracks: [] }));
                }
            } catch (err) {
            } finally {
                dispatch(setLoading(false));
            }
        };

        loadFavorites();
    }, [dispatch, router]);

    return <PageLayout tracks={favoriteTracks} title='Мой плейлист' isLoading={isLoading} />;
}
