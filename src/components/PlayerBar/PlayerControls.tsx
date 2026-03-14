'use client';

import { useAppSelector } from '@/store/store';
import { getSafeTrackUrl } from '@/utils/testTracks';
import styles from './PlayerControls.module.css';
import classNames from 'classnames';
import { useRef, useEffect } from 'react';

export default function PlayerControls() {
    const currentTrack = useAppSelector(state => state.tracks.currentTrack);
    const audioRef = useRef<HTMLAudioElement>(null);
    const audioSrc = getSafeTrackUrl(currentTrack?.track_file);

    // Автозагрузка и автовоспроизведение при смене трека
    useEffect(() => {
        if (audioRef.current && audioSrc) {
            audioRef.current.src = audioSrc;
            audioRef.current.load();
            audioRef.current.play().catch(e => {
                console.log('Autoplay blocked (normal):', e.message);
            });
        }
    }, [audioSrc]);

    if (!currentTrack || !audioSrc) return null;

    return (
        <div className={styles.playerControls}>
            <div className={styles.playerAudio}>
                <audio
                    ref={audioRef}
                    controls
                    src={audioSrc}
                    key={audioSrc}
                    onError={e => console.error('🔊 Audio error:', e)}
                ></audio>
            </div>

            <div className={styles.playerBtnPrev}>
                <svg className={styles.playerBtnPrevSvg}>
                    <use href='/img/icon/sprite.svg#icon-prev'></use>
                </svg>
            </div>

            <div className={classNames(styles.playerBtnPlay, styles.btn)}>
                <svg className={styles.playerBtnPlaySvg}>
                    <use href='/img/icon/sprite.svg#icon-play'></use>
                </svg>
            </div>

            <div className={styles.playerBtnNext}>
                <svg className={styles.playerBtnNextSvg}>
                    <use href='/img/icon/sprite.svg#icon-next'></use>
                </svg>
            </div>

            <div className={classNames(styles.playerBtnRepeat, styles.btnIcon)}>
                <svg className={styles.playerBtnRepeatSvg}>
                    <use href='/img/icon/sprite.svg#icon-repeat'></use>
                </svg>
            </div>

            <div className={classNames(styles.playerBtnShuffle, styles.btnIcon)}>
                <svg className={styles.playerBtnShuffleSvg}>
                    <use href='/img/icon/sprite.svg#icon-shuffle'></use>
                </svg>
            </div>
        </div>
    );
}
