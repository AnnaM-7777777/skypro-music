'use client';

import { FilterType } from '@/utils/filter';
import { useEffect, useRef, useState } from 'react';
import FilterItem from '../FilterItem/FilterItem';
import styles from './Filter.module.css';

type SortType = 'По умолчанию' | 'Сначала новые' | 'Сначала старые';

const YEAR_SORT_OPTIONS = ['Сначала новые', 'Сначала старые', 'По умолчанию'] as const;

interface FilterProps {
    genres: string[];
    authors: string[];
    onAuthorSelect: (author: string) => void;
    onGenreSelect: (genre: string) => void;
    onSortSelect: (sort: SortType) => void;
    // Принимаем массивы (plural)
    selectedAuthors: string[];
    selectedGenres: string[];
    sortType: SortType;
}

export default function Filter({
    genres,
    authors,
    onAuthorSelect,
    onGenreSelect,
    onSortSelect,
    selectedAuthors,
    selectedGenres,
    sortType,
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

    const handleSelect = (nameFilter: FilterType, value: string) => {
        if (nameFilter === 'author') onAuthorSelect(value);
        if (nameFilter === 'genre') onGenreSelect(value);
        if (nameFilter === 'year') onSortSelect(value as SortType);
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
                selectedValues={selectedAuthors}
            />

            <FilterItem
                titleFilter='году выпуска'
                list={[...YEAR_SORT_OPTIONS]}
                nameFilter='year'
                activeFilter={activeFilter}
                onChangeActiveFilter={setActiveFilter}
                onSelect={val => handleSelect('year', val)}
                selectedValue={sortType}
            />

            <FilterItem
                titleFilter='жанру'
                list={uniqueGenres}
                nameFilter='genre'
                activeFilter={activeFilter}
                onChangeActiveFilter={setActiveFilter}
                onSelect={val => handleSelect('genre', val)}
                selectedValues={selectedGenres}
            />
        </div>
    );
}
