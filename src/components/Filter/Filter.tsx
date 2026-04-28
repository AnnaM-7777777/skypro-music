'use client';

import { useState, useRef, useEffect } from 'react';
import FilterItem from '../FilterItem/FilterItem';
import styles from './Filter.module.css';
import { FilterType } from '@/utils/filter';

// 1. Добавили интерфейс пропсов
interface FilterProps {
    genres: string[];
    artists: string[];
}

// Выносим опции сортировки в константу
const YEAR_SORT_OPTIONS = ['Сначала новые', 'Сначала старые', 'По умолчанию'] as const;

// 2. Принимаем пропсы и убираем импорт mock-данных
export default function Filter({ genres, artists }: FilterProps) {
    const [activeFilter, setActiveFilter] = useState<FilterType>(null);
    const filterRef = useRef<HTMLDivElement>(null);

    // 3. Используем данные из пропсов для сортировки
    const uniqueAuthors = [...artists].sort();
    const uniqueYears = [...YEAR_SORT_OPTIONS];
    const uniqueGenres = [...genres].sort();

    // Закрытие при клике вне всего фильтра
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
                setActiveFilter(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={styles.centerblock__filter} ref={filterRef}>
            <div className={styles.filter__title}>Искать по:</div>

            <FilterItem
                titleFilter='исполнителю'
                list={uniqueAuthors}
                nameFilter='author'
                activeFilter={activeFilter}
                onChangeActiveFilter={setActiveFilter}
            />

            <FilterItem
                titleFilter='году выпуска'
                list={uniqueYears}
                nameFilter='year'
                activeFilter={activeFilter}
                onChangeActiveFilter={setActiveFilter}
            />

            <FilterItem
                titleFilter='жанру'
                list={uniqueGenres}
                nameFilter='genre'
                activeFilter={activeFilter}
                onChangeActiveFilter={setActiveFilter}
            />
        </div>
    );
}
