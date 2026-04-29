'use client';

import { FilterType } from '@/utils/filter';
import { useEffect, useRef, useState } from 'react';
import FilterItem from '../FilterItem/FilterItem';
import styles from './Filter.module.css';

interface FilterProps {
    genres: string[];
    authors: string[];
    onAuthorSelect: (author: string | null) => void;
    onGenreSelect: (genre: string | null) => void;
    onSortSelect: (sort: 'По умолчанию' | 'Сначала новые' | 'Сначала старые') => void;
}

const YEAR_SORT_OPTIONS = ['Сначала новые', 'Сначала старые', 'По умолчанию'] as const;

export default function Filter({
    genres,
    authors,
    onAuthorSelect,
    onGenreSelect,
    onSortSelect,
}: FilterProps) {
    const [activeFilter, setActiveFilter] = useState<FilterType>(null);
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
                setActiveFilter(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const uniqueAuthors = [...authors].sort();
    const uniqueGenres = [...genres].sort();

    // Универсальный обработчик выбора
    const handleSelect = (nameFilter: FilterType, value: string) => {
        if (nameFilter === 'author') onAuthorSelect(value);
        if (nameFilter === 'genre') onGenreSelect(value);
        if (nameFilter === 'year') onSortSelect(value as any);
    };

    return (
        <div className={styles.centerblock__filter} ref={filterRef}>
            <div className={styles.filter__title}>Искать по:</div>

            <FilterItem
                titleFilter='исполнителю'
                list={uniqueAuthors}
                nameFilter='author'
                activeFilter={activeFilter}
                onChangeActiveFilter={setActiveFilter}
                onSelect={val => handleSelect('author', val)}
            />

            <FilterItem
                titleFilter='году выпуска'
                list={[...YEAR_SORT_OPTIONS]}
                nameFilter='year'
                activeFilter={activeFilter}
                onChangeActiveFilter={setActiveFilter}
                onSelect={val => handleSelect('year', val)}
            />

            <FilterItem
                titleFilter='жанру'
                list={uniqueGenres}
                nameFilter='genre'
                activeFilter={activeFilter}
                onChangeActiveFilter={setActiveFilter}
                onSelect={val => handleSelect('genre', val)}
            />
        </div>
    );
}
