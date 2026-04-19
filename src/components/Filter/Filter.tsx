'use client';

import { useEffect, useRef, useState } from 'react';
import FilterItem from '../FilterItem/FilterItem';
import styles from './Filter.module.css';

type FilterType = 'author' | 'year' | 'genre' | null;

// 1. Добавили интерфейс пропсов
interface FilterProps {
    genres: string[];
    artists: string[];
}

// 2. Принимаем пропсы и убираем импорт mock-данных
export default function Filter({ genres, artists }: FilterProps) {
    const [activeFilter, setActiveFilter] = useState<FilterType>(null);
    const filterRef = useRef<HTMLDivElement>(null);

    // 3. Используем данные из пропсов (сортировка для удобства)
    const uniqueGenres = [...genres].sort();
    const uniqueAuthors = [...artists].sort();

    // Годы можно оставить из моков или тоже передавать пропсом, если нужно
    const uniqueYears: string[] = [];

    // Закрытие при клике вне
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
                setActiveFilter(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleFilter = (type: FilterType) => {
        setActiveFilter(prev => (prev === type ? null : type));
    };

    const handleSelect = () => {
        setActiveFilter(null);
    };

    return (
        <div className={styles.centerblock__filter} ref={filterRef}>
            <div className={styles.filter__title}>Искать по:</div>

            {/* Исполнитель */}
            <div className={styles.filter__wrapper}>
                <button
                    className={`${styles.filter__button} ${activeFilter === 'author' ? styles.active : ''}`}
                    onClick={() => toggleFilter('author')}
                >
                    исполнителю
                </button>
                {activeFilter === 'author' && (
                    <FilterItem items={uniqueAuthors} onSelect={handleSelect} />
                )}
            </div>

            {/* Год (пока пустой или можно вернуть моковые данные) */}
            <div className={styles.filter__wrapper}>
                <button
                    className={`${styles.filter__button} ${activeFilter === 'year' ? styles.active : ''}`}
                    onClick={() => toggleFilter('year')}
                >
                    году выпуска
                </button>
                {activeFilter === 'year' && uniqueYears.length > 0 && (
                    <FilterItem items={uniqueYears} onSelect={handleSelect} />
                )}
            </div>

            {/* Жанр */}
            <div className={styles.filter__wrapper}>
                <button
                    className={`${styles.filter__button} ${activeFilter === 'genre' ? styles.active : ''}`}
                    onClick={() => toggleFilter('genre')}
                >
                    жанру
                </button>
                {activeFilter === 'genre' && (
                    <FilterItem items={uniqueGenres} onSelect={handleSelect} />
                )}
            </div>
        </div>
    );
}
