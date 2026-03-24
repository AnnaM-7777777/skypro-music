'use client';

import { data } from '@/app/data';
import { IconLike } from '@/components/Icons';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { setCurrentTrack } from '@/store/features/trackSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { formatDuration } from '@/utils/helpers';
import classNames from 'classnames';
import Link from 'next/link';
import { useState } from 'react';
import styles from './Track.module.css';

// Внутренний компонент TrackItem: одна строка трека (рендерится в map)
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
                    <Link className={styles.name__link} href=''>
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

// Основной компонент TrackList: список всех треков с заголовком
export default function TrackList() {
    const currentTrack = useAppSelector(state => state.tracks.currentTrack);
    const isPlayingGlobal = useAppSelector(state => state.tracks.isPlaying);

    return (
        <div className={styles.trackItemList}>
            {/* Заголовок таблицы */}
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

            {/* Список треков */}
            {data.map(track => (
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
