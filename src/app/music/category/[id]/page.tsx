import PageLayout from '@/components/PageLayout/PageLayout';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { getSafeTrackUrl } from '@/utils/testTracks';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

const API_URL = 'https://webdev-music-003b5b991590.herokuapp.com';

interface Collection {
    _id: number;
    name: string;
    description?: string;
    items: TrackType[];
}

async function getCategory(id: string, token?: string): Promise<Collection | null> {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        // 1. Получаем подборку (список ID треков)
        const res = await fetch(`${API_URL}/catalog/selection/${id}/`, {
            method: 'GET',
            headers,
            cache: 'no-store',
        });

        if (!res.ok) {
            if (res.status === 401) redirect('/auth/signin');
            if (res.status === 404) return null;
            return null;
        }

        const response = await res.json();
        const categoryData = response?.data;

        if (!categoryData || !Array.isArray(categoryData.items)) {
            return null;
        }

        const trackIds = categoryData.items; // [12, 17, 24, ...]

        // 2. Загружаем каждый трек по ID
        const trackPromises = trackIds.map(async (trackId: number) => {
            try {
                const trackRes = await fetch(`${API_URL}/catalog/track/${trackId}/`, {
                    method: 'GET',
                    headers,
                });

                if (trackRes.ok) {
                    const trackResponse = await trackRes.json();
                    // API может вернуть { success: true,  track } или просто track
                    const trackData = trackResponse.data || trackResponse.track || trackResponse;
                    return trackData;
                }
                return null;
            } catch (err) {
                return null;
            }
        });

        const tracksResults = await Promise.all(trackPromises);
        const validTracks = tracksResults.filter((track): track is TrackType => track !== null);

        // 3. Подменяем ссылки на аудио
        const tracksWithSafeUrls = validTracks.map((track: TrackType) => ({
            ...track,
            track_file: getSafeTrackUrl(track.track_file),
        }));

        return {
            _id: categoryData._id,
            name: categoryData.name,
            description: categoryData.description,
            items: tracksWithSafeUrls,
        };
    } catch (err) {
        return null;
    }
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const category = await getCategory(id, token);
    if (!category) notFound();

    return <PageLayout tracks={category.items} title={category.name} showEmptyState={false} />;
}
