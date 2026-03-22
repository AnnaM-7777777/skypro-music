export const TEST_TRACKS: Record<string, string> = {
    'Alexander_Nakarada_-_Chase.mp3':
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'Mixkit_-_Secret_Garden.mp3': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'Musiclfiles_-_Epic_Heroic_Conquest.mp3':
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    'Frank_Schroter_-_Open_Sea_epic.mp3':
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    // Добавить треки по мере необходимости
};

// Массив запасных тестовых треков (если основной не найден)
// Все ссылки с soundhelix.com — стабильные, с правильными CORS-заголовками
const FALLBACK_TRACKS = [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
];

export function getSafeTrackUrl(originalUrl: string | null | undefined): string {
    if (!originalUrl) return '';

    // В продакшене всегда используем оригинал
    if (process.env.NODE_ENV === 'production') {
        return originalUrl.trim();
    }

    const cleanUrl = originalUrl.trim();

    // Если это уже тестовая ссылка — возвращаем как есть (защита от рекурсии)
    if (cleanUrl.includes('soundhelix.com')) {
        return cleanUrl;
    }

    const fileName = cleanUrl.split('/').pop();
    if (!fileName) {
        return getRandomFallbackTrack();
    }

    // Ищем точное совпадение в TEST_TRACKS
    if (TEST_TRACKS[fileName]) {
        console.log('Using test track:', fileName);
        return TEST_TRACKS[fileName];
    }

    // Если не нашли — возвращаем случайный трек из FALLBACK_TRACKS
    console.log('TrackItem not found, using random fallback:', fileName);
    return getRandomFallbackTrack();
}

// Вспомогательная функция для получения случайного трека
function getRandomFallbackTrack(): string {
    const randomIndex = Math.floor(Math.random() * FALLBACK_TRACKS.length);
    return FALLBACK_TRACKS[randomIndex];
}
