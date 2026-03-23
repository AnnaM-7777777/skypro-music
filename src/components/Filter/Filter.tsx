/* import styles from './Filter.module.css';

export default function Filter() {
    return (
        <div className={styles.centerblock__filter}>
            <div className={styles.filter__title}>Искать по:</div>
            <div className={styles.filter__button}>исполнителю</div>
            <div className={styles.filter__button}>году выпуска</div>
            <div className={styles.filter__button}>жанру</div>
        </div>
    );
}
 */

'use client';

import { data } from '@/app/data';
import { useEffect, useRef, useState } from 'react';
import FilterItem from '../FilterItem/FilterItem';
import styles from './Filter.module.css';

type FilterType = 'author' | 'year' | 'genre' | null;

export default function Filter() {
    const [activeFilter, setActiveFilter] = useState<FilterType>(null);
    const filterRef = useRef<HTMLDivElement>(null);

    // Уникальные значения из данных
    const uniqueAuthors = [...new Set(data.map(track => track.author))].sort();
    const uniqueYears = [...new Set(data.map(track => track.release_date?.slice(0, 4)))]
        .filter(Boolean)
        .sort()
        .reverse();
    const uniqueGenres = [...new Set(data.flatMap(track => track.genre))].sort();

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

            {/* Год */}
            <div className={styles.filter__wrapper}>
                <button
                    className={`${styles.filter__button} ${activeFilter === 'year' ? styles.active : ''}`}
                    onClick={() => toggleFilter('year')}
                >
                    году выпуска
                </button>
                {activeFilter === 'year' && (
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
