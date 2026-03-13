'use client';

import { useState } from 'react';
import styles from './TrackItem.module.css';
import { IconLike } from '@/components/Icons';
import Link from 'next/link';

interface TrackItemProps {
    title: string;
    titleSpan?: string;
    author: string;
    authorLink?: string;
    album: string;
    albumLink?: string;
    duration: string;
    isLiked?: boolean;
}

export default function TrackItem({
    title,
    titleSpan,
    author,
    authorLink = '#',
    album,
    albumLink = '#',
    duration,
    isLiked: initialLiked = false,
}: TrackItemProps) {
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [isHovered, setIsHovered] = useState(false);

    const toggleLike = () => {
        setIsLiked(!isLiked);
        console.log(`Like toggled: ${!isLiked}`);
    };

    return (
        <div className={styles.playlistItem}>
            <div className={styles.playlistTrack}>
                <div className={styles.trackTitle}>
                    <div className={styles.trackTitleImage}>
                        <svg className={styles.trackTitleSvg}>
                            <use href='/img/icon/sprite.svg#icon-note'></use>
                        </svg>
                    </div>
                    <div className={styles.trackTitleText}>
                        <Link className={styles.trackTitleLink} href=''>
                            {title}
                            {titleSpan && (
                                <span className={styles.trackTitleSpan}>{titleSpan}</span>
                            )}
                        </Link>
                    </div>
                </div>
                <div className={styles.trackAuthor}>
                    <Link className={styles.trackAuthorLink} href={authorLink}>
                        {author}
                    </Link>
                </div>
                <div className={styles.trackAlbum}>
                    <Link className={styles.trackAlbumLink} href={albumLink}>
                        {album}
                    </Link>
                </div>

                <div className={styles.trackTime}>
                    <IconLike
                        className={styles.trackTimeSvg}
                        isFilled={isLiked || isHovered}
                        onClick={toggleLike}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    />
                    <span className={styles.trackTimeText}>{duration}</span>
                </div>
            </div>
        </div>
    );
}
