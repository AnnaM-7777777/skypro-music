const API_URL = 'https://webdev-music-003b5b991590.herokuapp.com';

// Вспомогательная функция для обновления токена
const refreshToken = async (refreshToken: string) => {
    const res = await fetch(`${API_URL}/user/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!res.ok) throw new Error('Failed to refresh token');
    return res.json(); // { access: 'new_token', refresh: 'new_refresh' }
};

export const withReauth = async <T>(
    apiFunction: (accessToken: string) => Promise<T>
): Promise<T> => {
    try {
        const token = localStorage.getItem('token');
        return await apiFunction(token || '');
    } catch (error: any) {
        // Проверяем, что это 401 ошибка
        if (error?.status === 401 || error?.response?.status === 401) {
            const refresh = localStorage.getItem('refresh_token');
            if (!refresh) throw new Error('No refresh token');

            try {
                // Обновляем токен
                const newTokens = await refreshToken(refresh);

                // Сохраняем новые токены
                localStorage.setItem('token', newTokens.access);
                if (newTokens.refresh) {
                    localStorage.setItem('refresh_token', newTokens.refresh);
                }

                // Повторяем исходный запрос с новым токеном
                return await apiFunction(newTokens.access);
            } catch (refreshError) {
                // Если рефреш не удался — чистим сессию и редиректим
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('favorites');
                localStorage.removeItem('username');
                window.location.href = '/auth/signin';
                throw refreshError;
            }
        }
        // Если ошибка не 401 — пробрасываем дальше
        throw error;
    }
};
