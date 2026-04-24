'use client';

import { TrackType } from '@/sharedTypes/sharedTypes';
import { setCurrentTrack } from '@/store/features/trackSlice';
import { toggleFavorite, selectIsFavorite } from '@/store/features/favoritesSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { formatDuration } from '@/utils/helpers';
import classNames from 'classnames';
import Link from 'next/link';
import { useState, useMemo, useCallback } from 'react';
import styles from './Track.module.css';
import { IconLike } from '@/components/Icons';
import Toast from '@/components/Toast/Toast';
import { withReauth } from '@/utils/withReauth';
import '../../../skeleton.css';

const API_URL = 'https://webdev-music-003b5b991590.herokuapp.com';

interface TrackListProps {
    tracks: TrackType[];
    isLoading?: boolean;
}

function TrackItemSkeleton() {
    return (
        <div className={styles.trackItem}>
            <div className={styles.trackItem__name}>
                <div className={styles.name__image}>
                    <div className='skeleton skeleton__square' />
                </div>
                <div className={styles.name__text}>
                    <div
                        className='skeleton skeleton__line skeleton__line--sm'
                        style={{ width: '70%' }}
                    />
                </div>
            </div>
            <div className={styles.trackItem__author}>
                <div
                    className='skeleton skeleton__line skeleton__line--sm'
                    style={{ width: '70%' }}
                />
            </div>
            <div className={styles.trackItem__album}>
                <div
                    className='skeleton skeleton__line skeleton__line--sm'
                    style={{ width: '60%' }}
                />
            </div>
            <div className={styles.trackItem__time}>
                <div
                    className='skeleton skeleton__line skeleton__line--sm'
                    style={{ width: '100%' }}
                />
            </div>
        </div>
    );
}

function TrackListHeaderSkeleton() {
    return (
        <div className={styles.trackItemList__title}>
            <div className={`${styles.title__col} ${styles.col01}`}>
                <div
                    className='skeleton skeleton__line skeleton__line--sm'
                    style={{ width: '70px' }}
                />
            </div>
            <div className={`${styles.title__col} ${styles.col02}`}>
                <div
                    className='skeleton skeleton__line skeleton__line--sm'
                    style={{ width: '140px' }}
                />
            </div>
            <div className={`${styles.title__col} ${styles.col03}`}>
                <div
                    className='skeleton skeleton__line skeleton__line--sm'
                    style={{ width: '60px' }}
                />
            </div>
            <div className={`${styles.title__col} ${styles.col04}`}>
                <div
                    className='skeleton skeleton__line skeleton__line--sm'
                    style={{ width: '30px' }}
                />
            </div>
        </div>
    );
}

function TrackItem({
    title,
    author,
    album,
    duration,
    track,
    isCurrent = false,
    isPlaying = false,
}: {
    title: string;
    author: string;
    album: string;
    duration: string;
    track: TrackType;
    isCurrent?: boolean;
    isPlaying?: boolean;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const [showAuthToast, setShowAuthToast] = useState(false);
    const [showApiErrorToast, setShowApiErrorToast] = useState(false);
    const dispatch = useAppDispatch();
    const isLiked = useAppSelector(state => selectIsFavorite(state, track._id));

    // useCallback: предотвращает пересоздание функции при каждом рендере
    const toggleLike = useCallback(
        async (e?: React.MouseEvent) => {
            e?.stopPropagation();
            const token = localStorage.getItem('token');

            if (!token) {
                setShowAuthToast(true);
                return;
            }

            dispatch(toggleFavorite(track));

            // Запрос к бэкенду
            try {
                const method = isLiked ? 'DELETE' : 'POST';

                await withReauth(async (accessToken: string) => {
                    const response = await fetch(
                        `${API_URL}/catalog/track/${track._id}/favorite/`,
                        {
                            method,
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    );

                    if (!response.ok) {
                        const error: any = new Error('Failed to update favorites');
                        error.status = response.status;
                        throw error;
                    }
                    return response;
                });
            } catch (error) {
                console.error('Error toggling favorite:', error);
                dispatch(toggleFavorite(track));
                setShowApiErrorToast(true);
            }
        },
        [dispatch, track, isLiked]
    ); // Зависимости

    // useCallback: клик по треку
    const onClickTrack = useCallback(() => {
        dispatch(setCurrentTrack(track));
    }, [dispatch, track]);

    // useCallback: обработчики ховера (опционально, но чисто)
    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    return (
        <div className={styles.trackItem} onClick={onClickTrack}>
            <div className={styles.trackItem__name}>
                <div className={styles.name__image}>
                    {isCurrent && (
                        <span
                            className={classNames(
                                styles.name__dot,
                                isPlaying && styles.name__dotPulsing
                            )}
                        />
                    )}
                    <svg className={styles.name__svg}>
                        <use href='/img/icon/sprite.svg#icon-note' />
                    </svg>
                </div>
                <div className={styles.name__text}>
                    <Link className={styles.name__link} href='#'>
                        {title}
                    </Link>
                </div>
            </div>
            <div className={styles.trackItem__author}>
                <Link className={styles.author__link} href='#'>
                    {author}
                </Link>
            </div>
            <div className={styles.trackItem__album}>
                <Link className={styles.album___link} href='#'>
                    {album}
                </Link>
            </div>
            <div className={styles.trackItem__time}>
                <IconLike
                    className={classNames(styles.time__svg, {
                        [styles['liked-animation']]: isLiked,
                    })}
                    isFilled={isLiked}
                    isHovered={isHovered}
                    onClick={toggleLike}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                />
                <span className={styles.time__text}>{duration}</span>
            </div>
            {showAuthToast && (
                <Toast
                    message='Чтобы ставить лайки, пожалуйста, авторизуйтесь'
                    onClose={() => setShowAuthToast(false)}
                />
            )}
            {showApiErrorToast && (
                <Toast
                    message='Не удалось обновить лайк. Попробуйте позже.'
                    onClose={() => setShowApiErrorToast(false)}
                />
            )}
        </div>
    );
}

export default function TrackList({ tracks, isLoading = false }: TrackListProps) {
    const currentTrack = useAppSelector(state => state.tracks.currentTrack);
    const isPlayingGlobal = useAppSelector(state => state.tracks.isPlaying);

    // useMemo: кэшируем список отрендеренных треков, чтобы не пересоздавать при каждом рендере родителя
    const renderedTracks = useMemo(() => {
        return tracks.map(track => (
            <TrackItem
                key={track._id}
                track={track}
                title={track.name}
                author={track.author}
                album={track.album}
                duration={formatDuration(track.duration_in_seconds)}
                isCurrent={currentTrack?._id === track._id}
                isPlaying={isPlayingGlobal && currentTrack?._id === track._id}
            />
        ));
    }, [tracks, currentTrack?._id, isPlayingGlobal]);

    if (isLoading) {
        return (
            <div className={styles.trackItemList}>
                <TrackListHeaderSkeleton />
                {[...Array(8)].map((_, index) => (
                    <TrackItemSkeleton key={index} />
                ))}
            </div>
        );
    }

    return (
        <div className={styles.trackItemList}>
            <div className={styles.trackItemList__title}>
                <div className={`${styles.title__col} ${styles.col01}`}>Трек</div>
                <div className={`${styles.title__col} ${styles.col02}`}>Исполнитель</div>
                <div className={`${styles.title__col} ${styles.col03}`}>Альбом</div>
                <div className={`${styles.title__col} ${styles.col04}`}>
                    <svg className={styles.title__svgTime}>
                        <use xlinkHref='/img/icon/sprite.svg#icon-watch' />
                    </svg>
                </div>
            </div>
            {renderedTracks}
        </div>
    );
}
