'use client';

import { useState, useMemo } from 'react';
import Filter from '@/components/Filter/Filter';
import Search from '@/components/Search/Search';
import TrackList from '@/components/Track/Track';
import styles from './CenterBlock.module.css';
import { TrackType } from '@/sharedTypes/sharedTypes';
import Bar from '@/components/Bar/Bar';

interface CenterBlockProps {
    tracks: TrackType[];
    title?: string;
    isLoading?: boolean;
    showEmptyState?: boolean;
}

type SortType = 'Сначала новые' | 'Сначала старые' | 'По умолчанию';

export default function CenterBlock({
    tracks,
    title = 'Треки',
    isLoading = false,
    showEmptyState = true,
}: CenterBlockProps) {
    const [searchQuery, setSearchQuery] = useState('');
    // Массивы для мультивыбора
    const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [sortType, setSortType] = useState<SortType>('По умолчанию');

    // Данные для фильтров
    const allGenres = tracks.flatMap(t => t.genre || []);
    const uniqueGenres = [...new Set(allGenres)].sort();
    const uniqueAuthors = [...new Set(tracks.map(t => t.author))].sort();

    // Обработчики с логикой тоггла (добавить/удалить)
    const handleGenreSelect = (genre: string) => {
        setSelectedGenres(prev =>
            prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
        );
    };

    const handleAuthorSelect = (author: string) => {
        setSelectedAuthors(prev =>
            prev.includes(author) ? prev.filter(a => a !== author) : [...prev, author]
        );
    };

    const handleSortSelect = (sort: SortType) => {
        setSortType(prev => (prev === sort ? 'По умолчанию' : sort));
    };

    // Комбинированная логика: Поиск → Фильтр → Сортировка
    const filteredTracks = useMemo(() => {
        let result = [...tracks];

        // Поиск
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                t => t.name.toLowerCase().includes(query) || t.author.toLowerCase().includes(query)
            );
        }

        // Фильтр по авторам (если выбраны)
        if (selectedAuthors.length > 0) {
            result = result.filter(t => selectedAuthors.includes(t.author));
        }

        // Фильтр по жанрам (если выбраны)
        if (selectedGenres.length > 0) {
            result = result.filter(t => t.genre?.some(g => selectedGenres.includes(g)));
        }

        // Сортировка
        if (sortType !== 'По умолчанию') {
            result.sort((a, b) => {
                const yearA = parseInt(a.release_date?.slice(0, 4) || '0');
                const yearB = parseInt(b.release_date?.slice(0, 4) || '0');
                return sortType === 'Сначала новые' ? yearB - yearA : yearA - yearB;
            });
        }

        return result;
    }, [tracks, searchQuery, selectedAuthors, selectedGenres, sortType]);

    // Пустое состояние
    if (!isLoading && filteredTracks.length === 0 && showEmptyState) {
        return (
            <>
                <div className={styles.centerblock}>
                    <Search onSearch={setSearchQuery} />
                    <h2 className={styles.centerblock__h2}>{title}</h2>
                    <Filter
                        genres={uniqueGenres}
                        authors={uniqueAuthors}
                        onAuthorSelect={handleAuthorSelect}
                        onGenreSelect={handleGenreSelect}
                        onSortSelect={handleSortSelect}
                        selectedAuthors={selectedAuthors}
                        selectedGenres={selectedGenres}
                        sortType={sortType}
                    />
                    <div className={styles.centerBlock__empty}>
                        <p className={styles.empty__title}>Ничего не найдено</p>
                        <p className={styles.empty__text}>
                            Попробуй изменить параметры поиска или фильтров
                        </p>
                    </div>
                </div>
                <Bar tracks={filteredTracks} />
            </>
        );
    }

    // Основной рендер
    return (
        <>
            <div className={styles.centerblock}>
                <Search onSearch={setSearchQuery} />
                <h2 className={styles.centerblock__h2}>{title}</h2>
                <Filter
                    genres={uniqueGenres}
                    authors={uniqueAuthors}
                    onAuthorSelect={handleAuthorSelect}
                    onGenreSelect={handleGenreSelect}
                    onSortSelect={handleSortSelect}
                    selectedAuthors={selectedAuthors}
                    selectedGenres={selectedGenres}
                    sortType={sortType}
                />
                <TrackList tracks={filteredTracks} isLoading={isLoading} />
            </div>
            <Bar tracks={filteredTracks} />
        </>
    );
}
