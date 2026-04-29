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
    const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [sortType, setSortType] = useState<SortType>('По умолчанию');

    const allGenres = tracks.flatMap(t => t.genre || []);
    const genres = [...new Set(allGenres)].sort();
    const authors = [...new Set(tracks.map(t => t.author))].sort();

    // Комбинированная логика: Поиск → Фильтр → Сортировка
    const filteredTracks = useMemo(() => {
        let result = [...tracks];

        // Поиск по названию или исполнителю
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                t => t.name.toLowerCase().includes(query) || t.author.toLowerCase().includes(query)
            );
        }

        // Фильтрация по исполнителю
        if (selectedAuthor) {
            result = result.filter(t => t.author === selectedAuthor);
        }

        // Фильтрация по жанру
        if (selectedGenre) {
            result = result.filter(t => t.genre?.includes(selectedGenre));
        }

        // Сортировка по году
        if (sortType !== 'По умолчанию') {
            result.sort((a, b) => {
                const yearA = parseInt(a.release_date?.slice(0, 4) || '0');
                const yearB = parseInt(b.release_date?.slice(0, 4) || '0');
                return sortType === 'Сначала новые' ? yearB - yearA : yearA - yearB;
            });
        }

        return result;
    }, [tracks, searchQuery, selectedAuthor, selectedGenre, sortType]);

    // Пустое состояние
    if (!isLoading && filteredTracks.length === 0 && showEmptyState) {
        return (
            <>
                <div className={styles.centerblock}>
                    <Search onSearch={setSearchQuery} />
                    <h2 className={styles.centerblock__h2}>{title}</h2>
                    <Filter
                        genres={genres}
                        authors={authors}
                        onAuthorSelect={setSelectedAuthor}
                        onGenreSelect={setSelectedGenre}
                        onSortSelect={setSortType}
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
                    genres={genres}
                    authors={authors}
                    onAuthorSelect={setSelectedAuthor}
                    onGenreSelect={setSelectedGenre}
                    onSortSelect={setSortType}
                />
                <TrackList tracks={filteredTracks} isLoading={isLoading} />
            </div>
            <Bar tracks={filteredTracks} />
        </>
    );
}
