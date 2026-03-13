'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './NowPlaying.module.css';
import { IconLike } from '@/components/Icons';

export default function NowPlaying() {
    const [isLiked, setIsLiked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const toggleLike = () => {
        setIsLiked(!isLiked);
        console.log(`NowPlaying like toggled: ${!isLiked}`);
    };

    return (
        <div className={styles.playerTrackPlay}>
            <div className={styles.trackPlayContain}>
                <div className={styles.trackPlayImage}>
                    <svg className={styles.trackPlaySvg}>
                        <use href='/img/icon/sprite.svg#icon-note'></use>
                    </svg>
                </div>

                <div className={styles.NowPlayingTrack}>
                    <Link className={styles.NowPlayingTrackAuthorLink} href=''>
                        Ты та...
                    </Link>

                    <Link className={styles.NowPlayingTrackAlbumLink} href=''>
                        Баста
                    </Link>
                </div>
            </div>

            <IconLike
                className={styles.trackTimeSvg}
                isFilled={isLiked || isHovered}
                onClick={toggleLike}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            />
        </div>
    );
}
