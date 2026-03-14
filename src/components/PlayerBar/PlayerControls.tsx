'use client';

import { useRef, useState, useEffect } from 'react';
import { useAppSelector } from '@/store/store';
import { getSafeTrackUrl } from '@/utils/testTracks';
import styles from './PlayerControls.module.css';
import classNames from 'classnames';

export default function PlayerControls() {
    const currentTrack = useAppSelector(state => state.tracks.currentTrack);
    const audioRef = useRef<HTMLAudioElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const audioSrc = getSafeTrackUrl(currentTrack?.track_file);

    // Загрузка и автовоспроизведение при смене трека
    useEffect(() => {
        if (audioRef.current && audioSrc) {
            audioRef.current.src = audioSrc;
            audioRef.current.load();

            audioRef.current
                .play()
                .then(() => setIsPlaying(true))
                .catch(e => console.log('▶️ Autoplay:', e.message));
        }
    }, [audioSrc]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    // Если нет трека - плеер не рендерится
    if (!currentTrack) return null;

    return (
        <div className={styles.playerControls}>
            <div className={styles.playerAudio}>
                <audio
                    ref={audioRef}
                    src={audioSrc || undefined}
                    key={audioSrc || 'no-track'}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onEnded={handleEnded}
                    onError={e => console.error('🔊 Audio error:', e)}
                />
            </div>

            <div className={styles.playerBtnPrev} onClick={() => console.log('⏮ Prev')}>
                <svg className={styles.playerBtnPrevSvg}>
                    <use href='/img/icon/sprite.svg#icon-prev'></use>
                </svg>
            </div>

            <div className={classNames(styles.playerBtnPlay, styles.btn)} onClick={togglePlay}>
                <svg className={styles.playerBtnPlaySvg}>
                    <use href={`/img/icon/sprite.svg#icon-${isPlaying ? 'pause' : 'play'}`}></use>
                </svg>
            </div>

            <div className={styles.playerBtnNext} onClick={() => console.log('⏭ Next')}>
                <svg className={styles.playerBtnNextSvg}>
                    <use href='/img/icon/sprite.svg#icon-next'></use>
                </svg>
            </div>

            <div
                className={classNames(styles.playerBtnRepeat, styles.btnIcon)}
                onClick={() => console.log('🔁 Repeat')}
            >
                <svg className={styles.playerBtnRepeatSvg}>
                    <use href='/img/icon/sprite.svg#icon-repeat'></use>
                </svg>
            </div>

            <div
                className={classNames(styles.playerBtnShuffle, styles.btnIcon)}
                onClick={() => console.log('🔀 Shuffle')}
            >
                <svg className={styles.playerBtnShuffleSvg}>
                    <use href='/img/icon/sprite.svg#icon-shuffle'></use>
                </svg>
            </div>
        </div>
    );
}
