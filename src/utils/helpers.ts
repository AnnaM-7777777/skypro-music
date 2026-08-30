// Форматирует длительность в секундах в строку "мм:сс"
export const formatDuration = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Панель времени: текущее / общее (использует formatDuration из хелпера)
export const getTimePanel = (current: number, total: number | undefined): string => {
    if (!total || isNaN(total)) return `${formatDuration(current)} / 0:00`;
    return `${formatDuration(current)} / ${formatDuration(total)}`;
};
