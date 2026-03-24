'use client';

import { IconLike } from '@/components/Icons';
import { setPlaying } from '@/store/features/trackSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getSafeTrackUrl } from '@/utils/testTracks';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import styles from './Bar.module.css';

export default function Bar() {
    const currentTrackItem = useAppSelector(state => state.tracks.currentTrack);
    const isPlayingRedux = useAppSelector(state => state.tracks.isPlaying);
    const dispatch = useAppDispatch();
    const audioRef = useRef<HTMLAudioElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    const audioSrc = getSafeTrackUrl(currentTrackItem?.track_file);

    // Синхронизация локального состояния с Redux
    useEffect(() => {
        setIsPlaying(isPlayingRedux);
    }, [isPlayingRedux]);

    // Применение громкости к аудиоэлементу
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Загрузка трека при смене источника
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !audioSrc) return;

        setCurrentTime(0);
        setDuration(0);
        audio.src = audioSrc;
        audio.preload = 'auto';
        audio.load();
    }, [audioSrc]);

    // Инициализация градиента при первом рендере
    useEffect(() => {
        const progressLine = document.querySelector(
            `.${styles.volume__progressLine}`
        ) as HTMLElement;
        if (progressLine) {
            progressLine.style.setProperty('--volume-percent', `${volume * 100}%`);
        }
    }, []);

    // Play/Pause
    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(err => {
                if (err.name === 'NotAllowedError') {
                    console.warn('🔊 Требуется взаимодействие пользователя для воспроизведения');
                }
            });
        }
    };

    // Like — параметр e необязательный для совместимости типов
    const toggleLike = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setIsLiked(!isLiked);
    };

    // Обновление прогресса
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    // Громкость
    const volumeRef = useRef<HTMLInputElement>(null);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);

        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }

        if (volumeRef.current) {
            volumeRef.current.style.setProperty('--volume-percent', `${newVolume * 100}%`);
        }
    };

    // Инициализация при монтировании
    useEffect(() => {
        if (volumeRef.current) {
            volumeRef.current.style.setProperty('--volume-percent', `${volume * 100}%`);
        }
    }, []);

    // Перемотка
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    // Форматирование времени
    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Обработчики событий аудио
    const handlePlay = () => {
        setIsPlaying(true);
        dispatch(setPlaying(true));
    };

    const handlePause = () => {
        setIsPlaying(false);
        dispatch(setPlaying(false));
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        dispatch(setPlaying(false));
    };

    const handleCanPlay = () => {
        if (audioRef.current && isPlayingRedux) {
            audioRef.current.play().catch(err => {
                if (err.name === 'NotAllowedError') {
                    dispatch(setPlaying(false));
                }
            });
        }
    };

    const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
        console.error('🔊 Audio error:', e);
    };

    if (!currentTrackItem || !audioSrc) return null;

    return (
        <div className={styles.bar}>
            <audio
                ref={audioRef}
                src={audioSrc || undefined}
                key={audioSrc || 'no-track'}
                preload='auto'
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
                onTimeUpdate={handleTimeUpdate}
                onCanPlay={handleCanPlay}
                onError={handleError}
            />

            <div className={styles.bar__btn}>
                <div className={styles.btn__prev} onClick={() => console.log('Prev')}>
                    <svg className={styles.btn__prevSvg}>
                        <use href='/img/icon/sprite.svg#icon-prev'></use>
                    </svg>
                </div>

                <div className={classNames(styles.btn__play, styles.btn)} onClick={togglePlay}>
                    <svg className={styles.btn__playSvg}>
                        <use
                            href={`/img/icon/sprite.svg#icon-${isPlaying ? 'pause' : 'play'}`}
                        ></use>
                    </svg>
                </div>

                <div className={styles.btn__next} onClick={() => console.log('Next')}>
                    <svg className={styles.btn__nextSvg}>
                        <use href='/img/icon/sprite.svg#icon-next'></use>
                    </svg>
                </div>

                <div
                    className={classNames(styles.btn__repeat, styles.btnIcon)}
                    onClick={() => console.log('Repeat')}
                >
                    <svg className={styles.btn__repeatSvg}>
                        <use href='/img/icon/sprite.svg#icon-repeat'></use>
                    </svg>
                </div>

                <div
                    className={classNames(styles.btn__shuffle, styles.btnIcon)}
                    onClick={() => console.log('Shuffle')}
                >
                    <svg className={styles.btn__nextSvg}>
                        <use href='/img/icon/sprite.svg#icon-shuffle'></use>
                    </svg>
                </div>
            </div>

            <div className={styles.bar__trackPlay}>
                <div className={styles.trackPlay__image}>
                    <svg className={styles.trackPlay__svg}>
                        <use href='/img/icon/sprite.svg#icon-note'></use>
                    </svg>
                </div>

                <div className={styles.trackPlay__info}>
                    <div className={styles.trackPlay__title}>{currentTrackItem.name}</div>
                    <div className={styles.trackPlay__author}>{currentTrackItem.author}</div>
                </div>

                <div className={styles.trackPlay__like}>
                    <IconLike
                        className={styles.trackPlay__iconLike}
                        isFilled={isLiked}
                        isHovered={isHovered}
                        onClick={toggleLike}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    />
                </div>
            </div>

            <div className={styles.bar__volume}>
                <div className={styles.volume__content}>
                    <svg className={styles.volume__svg}>
                        <use xlinkHref='/img/icon/sprite.svg#icon-volume'></use>
                    </svg>

                    <div className={styles.volume__progress}>
                        <input
                            ref={volumeRef}
                            className={styles.volume__progressLine}
                            type='range'
                            min={0}
                            max={1}
                            step={0.01}
                            value={volume}
                            onChange={handleVolumeChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
