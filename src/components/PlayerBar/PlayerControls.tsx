'use client';

import { useRef, useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { getSafeTrackUrl } from '@/utils/testTracks';
import { setPlaying } from '@/store/features/trackSlice';
import { IconLike } from '@/components/Icons';
import styles from './PlayerControls.module.css';
import classNames from 'classnames';

export default function PlayerControls() {
    const currentTrack = useAppSelector(state => state.tracks.currentTrack);
    const isPlayingRedux = useAppSelector(state => state.tracks.isPlaying);
    const dispatch = useAppDispatch();
    const audioRef = useRef<HTMLAudioElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    const audioSrc = getSafeTrackUrl(currentTrack?.track_file);

    // Синхронизация локального состояния с Redux
    useEffect(() => {
        setIsPlaying(isPlayingRedux);
    }, [isPlayingRedux]);

    // Загрузка и автовоспроизведение при смене трека
    useEffect(() => {
        if (audioRef.current && audioSrc) {
            audioRef.current.src = audioSrc;
            audioRef.current.load();
            setIsPlaying(false);
            setCurrentTime(0);

            audioRef.current
                .play()
                .then(() => {
                    setIsPlaying(true);
                    dispatch(setPlaying(true)); // Синхронизация с Redux
                })
                .catch(e => console.log('▶️ Autoplay:', e.message));
        }
    }, [audioSrc, dispatch]);

    // Play/Pause
    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            dispatch(setPlaying(false)); // Синхронизация с Redux
        } else {
            audioRef.current.play();
            setIsPlaying(true);
            dispatch(setPlaying(true)); // Синхронизация с Redux
        }
    };

    // Like в плеере (локально)
    const toggleLike = () => {
        setIsLiked(!isLiked);
        console.log(`Player like toggled: ${!isLiked}`);
    };

    // Обновление прогресса
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    // Громкость
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    // Перемотка
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    // Форматирование времени мм:сс
    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // События аудио
    const handlePlay = () => {
        setIsPlaying(true);
        dispatch(setPlaying(true)); // Синхронизация с Redux
    };

    const handlePause = () => {
        setIsPlaying(false);
        dispatch(setPlaying(false)); // Синхронизация с Redux
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        dispatch(setPlaying(false)); // Синхронизация с Redux
    };

    // Если нет трека - плеер не рендерится
    if (!currentTrack || !audioSrc) return null;

    return (
        <div className={styles.playerControls}>
            {/* Скрытый audio */}
            <audio
                ref={audioRef}
                src={audioSrc || undefined}
                key={audioSrc || 'no-track'}
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
                onTimeUpdate={handleTimeUpdate}
                onError={e => console.error('🔊 Audio error:', e)}
            />

            <div className={styles.playerBtn}>
                {/* Кнопка Prev */}
                <div className={styles.playerBtnPrev} onClick={() => console.log('⏮ Prev')}>
                    <svg className={styles.playerBtnSvg}>
                        <use href='/img/icon/sprite.svg#icon-prev'></use>
                    </svg>
                </div>

                {/* Кнопка Play/Pause */}
                <div className={classNames(styles.playerBtnPlay, styles.btn)} onClick={togglePlay}>
                    <svg className={styles.playerBtnPlaySvg}>
                        <use
                            href={`/img/icon/sprite.svg#icon-${isPlaying ? 'pause' : 'play'}`}
                        ></use>
                    </svg>
                </div>

                {/* Кнопка Next */}
                <div className={styles.playerBtnNext} onClick={() => console.log('⏭ Next')}>
                    <svg className={styles.playerBtnSvg}>
                        <use href='/img/icon/sprite.svg#icon-next'></use>
                    </svg>
                </div>

                {/* Repeat */}
                <div
                    className={classNames(styles.playerBtnRepeat, styles.btnIcon)}
                    onClick={() => console.log('🔁 Repeat')}
                >
                    <svg className={styles.playerBtnSvg}>
                        <use href='/img/icon/sprite.svg#icon-repeat'></use>
                    </svg>
                </div>

                {/* Shuffle */}
                <div
                    className={classNames(styles.playerBtnShuffle, styles.btnIcon)}
                    onClick={() => console.log('🔀 Shuffle')}
                >
                    <svg className={styles.playerBtnSvg}>
                        <use href='/img/icon/sprite.svg#icon-shuffle'></use>
                    </svg>
                </div>
            </div>

            <div className={styles.playerTrack}>
                {/* Картинка трека */}
                <div className={styles.playerTrackImage}>
                    <svg className={styles.playerTrackSvg}>
                        <use href='/img/icon/sprite.svg#icon-note'></use>
                    </svg>
                </div>

                {/* Информация о треке */}
                <div className={styles.playerTrackInfo}>
                    <div className={styles.playerTrackTitle}>{currentTrack.name}</div>
                    <div className={styles.playerTrackAuthor}>{currentTrack.author}</div>
                </div>

                {/* Лайк в плеере */}
                <div className={styles.playerTrackBtnLike} onClick={toggleLike}>
                    <IconLike className={styles.playerLikeSvg} isFilled={isLiked} />
                </div>
            </div>

            {/* Громкость */}
            <div className={styles.playerVolume}>
                <svg className={styles.playerVolumeSvg}>
                    <use href='/img/icon/sprite.svg#icon-volume'></use>
                </svg>

                <input
                    type='range'
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={handleVolumeChange}
                    className={styles.playerVolumeSeek}
                />
            </div>
        </div>
    );
}
