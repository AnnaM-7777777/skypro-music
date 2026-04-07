'use client';

import { TrackType } from '@/sharedTypes/sharedTypes';
import { setCurrentTrack } from '@/store/features/trackSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { formatDuration } from '@/utils/helpers';
import classNames from 'classnames';
import Link from 'next/link';
import { useState } from 'react';
import styles from './Track.module.css';
import { IconLike } from '@/components/Icons';
import '../../../skeleton.css';

interface TrackListProps {
    tracks: TrackType[];
    isLoading?: boolean;
}

// Skeleton для одной строки трека
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

            {/* Альбом, лайк и время - ОДНОЙ полосой */}
            <div className={styles.trackItem__time}>
                <div
                    className='skeleton skeleton__line skeleton__line--sm'
                    style={{ width: '100%' }}
                />
            </div>
        </div>
    );
}

// Skeleton для заголовка
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

// Внутренний компонент одной строки трека
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
    const [isLiked, setIsLiked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const dispatch = useAppDispatch();

    const toggleLike = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setIsLiked(!isLiked);
    };

    const onClickTrack = () => {
        dispatch(setCurrentTrack(track));
    };

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
                        <use href='/img/icon/sprite.svg#icon-note'></use>
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
                    className={styles.time__svg}
                    isFilled={isLiked}
                    isHovered={isHovered}
                    onClick={toggleLike}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                />
                <span className={styles.time__text}>{duration}</span>
            </div>
        </div>
    );
}

// Основной компонент списка
export default function TrackList({ tracks, isLoading = false }: TrackListProps) {
    const currentTrack = useAppSelector(state => state.tracks.currentTrack);
    const isPlayingGlobal = useAppSelector(state => state.tracks.isPlaying);

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
                        <use xlinkHref='/img/icon/sprite.svg#icon-watch'></use>
                    </svg>
                </div>
            </div>

            {tracks.map(track => (
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
            ))}
        </div>
    );
}
