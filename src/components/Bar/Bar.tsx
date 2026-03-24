'use client';

import { data } from '@/app/data';
import { IconLike } from '@/components/Icons';
import ProgressBar from '@/components/Bar/ProgressBar';
import { setCurrentTrack, setPlaying } from '@/store/features/trackSlice';
import { formatDuration, getTimePanel } from '@/utils/helpers';
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

    // ФУНКЦИИ: Переключение треков
    const handleNext = () => {
        if (!currentTrackItem) return;

        const currentIndex = data.findIndex(track => track._id === currentTrackItem._id);
        const isLastTrack = currentIndex === data.length - 1;

        // Если последний трек — не переключаем (или можно зациклить)
        if (isLastTrack) return;

        const nextTrack = data[currentIndex + 1];
        if (nextTrack) {
            dispatch(setCurrentTrack(nextTrack));
            dispatch(setPlaying(true));
        }
    };

    const handlePrev = () => {
        if (!currentTrackItem) return;

        const currentIndex = data.findIndex(track => track._id === currentTrackItem._id);
        const isFirstTrack = currentIndex === 0;

        // Если первый трек — не переключаем (или можно зациклить)
        if (isFirstTrack) return;

        const prevTrack = data[currentIndex - 1];
        if (prevTrack) {
            dispatch(setCurrentTrack(prevTrack));
            dispatch(setPlaying(true));
        }
    };

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

    // Like
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
        // Автопереключение на следующий трек при завершении
        handleNext();
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

    // ← Определяем, на границе ли мы (для визуального отклика)
    const currentIndex = data.findIndex(track => track._id === currentTrackItem._id);
    const isFirstTrack = currentIndex === 0;
    const isLastTrack = currentIndex === data.length - 1;

    return (
        <div className={styles.bar}>
            {/* Контейнер прогресс-бара и времени трека */}
            <div className={styles.bar__progress}>
                <div className={styles.progress__time}>{getTimePanel(currentTime, duration)}</div>
                <ProgressBar max={duration} value={currentTime} step={0.1} onChange={handleSeek} />
            </div>

            <div className={styles.bar__block}>
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
                    {/* Кнопка Prev — неактивна на первом треке */}
                    <div
                        className={`${styles.btn__prev} ${isFirstTrack ? styles.btn__disabled : ''}`}
                        onClick={handlePrev}
                        style={{
                            cursor: isFirstTrack ? 'not-allowed' : 'pointer',
                            opacity: isFirstTrack ? 0.3 : 1,
                        }}
                    >
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

                    {/* Кнопка Next — неактивна на последнем треке */}
                    <div
                        className={`${styles.btn__next} ${isLastTrack ? styles.btn__disabled : ''}`}
                        onClick={handleNext}
                        style={{
                            cursor: isLastTrack ? 'not-allowed' : 'pointer',
                            opacity: isLastTrack ? 0.3 : 1,
                        }}
                    >
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
                        <svg className={styles.btn__shuffleSvg}>
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
        </div>
    );
}
