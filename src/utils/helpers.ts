/**
 * Форматирует длительность в секундах в строку "мм:сс"
 * @param seconds - количество секунд
 * @returns строка в формате "м:сс" (например, "3:45")
 */
export const formatDuration = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};