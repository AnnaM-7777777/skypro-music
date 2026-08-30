'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // 1. Проверяем localStorage
        const saved = localStorage.getItem('theme') as Theme | null;
        // 2. Проверяем системные настройки
        const system = window.matchMedia('(prefers-color-scheme: light)').matches
            ? 'light'
            : 'dark';
        const initial = saved || system;

        setTheme(initial);
        document.documentElement.setAttribute('data-theme', initial);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    // Предотвращаем гидратацию до определения темы (избегает мерцания)
    if (!mounted) return <>{children}</>;

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used inside ThemeProvider');
    return context;
};
