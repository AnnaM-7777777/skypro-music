'use client';

import { IconLike } from '@/components/Icons';
import ProgressBar from '@/components/Bar/ProgressBar';
import Toast from '@/components/Toast/Toast';
import { setCurrentTrack, setPlaying } from '@/store/features/trackSlice';
import { toggleFavorite, selectIsFavorite } from '@/store/features/favoritesSlice';
import { getTimePanel } from '@/utils/helpers';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getSafeTrackUrl } from '@/utils/testTracks';
import { TrackType } from '@/sharedTypes/sharedTypes';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import styles from './Bar.module.css';
import '../../../skeleton.css';

const API_URL = 'https://webdev-music-003b5b991590.herokuapp.com';

interface BarProps {
    tracks: TrackType[];
}

// Skeleton для плеера
function BarSkeleton() {
    return (
        <div className={styles.bar}>
            <div className={styles.bar__progress}>
                <div className='skeleton skeleton__line' style={{ height: '4px', width: '100%' }} />
            </div>

            <div className={styles.bar__block}>
                <div className={styles.bar__btn}>
                    <div className={styles.btn__prev}>
                        <svg className={styles.btn__prevSvg}>
                            <use href='/img/icon/sprite.svg#icon-prev' />
                        </svg>
                    </div>

                    <div className={classNames(styles.btn__play, styles.btn)}>
                        <svg className={styles.btn__playSvg}>
                            <use href='/img/icon/sprite.svg#icon-play' />
                        </svg>
                    </div>

                    <div className={styles.btn__next}>
                        <svg className={styles.btn__nextSvg}>
                            <use href='/img/icon/sprite.svg#icon-next' />
                        </svg>
                    </div>
                </div>

                {/* Skeleton для информации о треке */}
                <div className={styles.bar__trackPlay}>
                    <div className={styles.trackPlay__image}>
                        <div
                            className='skeleton skeleton__square'
                            style={{ width: '48px', height: '48px' }}
                        />
                    </div>
                    <div className={styles.trackPlay__info}>
                        <div className='skeleton skeleton__line skeleton__line--md skeleton__line--medium' />
                        <div className='skeleton skeleton__line skeleton__line--sm skeleton__line--short' />
                    </div>
                </div>

                <div className={styles.bar__volume}>
                    <div className={styles.volume__content}>
                        <svg className={styles.volume__svg}>
                            <use xlinkHref='/img/icon/sprite.svg#icon-volume' />
                        </svg>
                        <div className={styles.volume__progress}>
                            <div
                                className='skeleton skeleton__line'
                                style={{ width: '100px', height: '4px' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Bar({ tracks }: BarProps) {
    const [showAuthToast, setShowAuthToast] = useState(false);
    const currentTrackItem = useAppSelector(state => state.tracks.currentTrack);
    const isPlayingRedux = useAppSelector(state => state.tracks.isPlaying);
    const dispatch = useAppDispatch();
    const audioRef = useRef<HTMLAudioElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);

    // isLiked берётся из Redux
    const isLiked = useAppSelector(state =>
        currentTrackItem ? selectIsFavorite(state, currentTrackItem._id) : false
    );

    const audioSrc = getSafeTrackUrl(currentTrackItem?.track_file);

    // Получение случайного трека ИЗ ПЕРЕДАННОГО МАССИВА (не data)
    const getRandomTrack = (excludeId?: number): TrackType | undefined => {
        const availableTracks = tracks.filter(t => t._id !== excludeId);
        if (availableTracks.length === 0) return undefined;
        const randomIndex = Math.floor(Math.random() * availableTracks.length);
        return availableTracks[randomIndex];
    };

    // Переключение на следующий трек (используем tracks, а не data)
    const handleNext = () => {
        if (!currentTrackItem || tracks.length === 0) return;

        if (isShuffle) {
            const randomTrack = getRandomTrack(currentTrackItem._id);
            if (randomTrack) {
                dispatch(setCurrentTrack(randomTrack));
                dispatch(setPlaying(true));
            }
            return;
        }

        const currentIndex = tracks.findIndex(track => track._id === currentTrackItem._id);
        const isLastTrack = currentIndex === tracks.length - 1;
        const nextIndex = isLastTrack ? 0 : currentIndex + 1;
        const nextTrack = tracks[nextIndex];

        if (nextTrack) {
            dispatch(setCurrentTrack(nextTrack));
            dispatch(setPlaying(true));
        }
    };

    // Переключение на предыдущий трек
    const handlePrev = () => {
        if (!currentTrackItem || tracks.length === 0) return;

        if (isShuffle) {
            const randomTrack = getRandomTrack(currentTrackItem._id);
            if (randomTrack) {
                dispatch(setCurrentTrack(randomTrack));
                dispatch(setPlaying(true));
            }
            return;
        }

        const currentIndex = tracks.findIndex(track => track._id === currentTrackItem._id);
        const isFirstTrack = currentIndex === 0;
        const prevIndex = isFirstTrack ? tracks.length - 1 : currentIndex - 1;
        const prevTrack = tracks[prevIndex];

        if (prevTrack) {
            dispatch(setCurrentTrack(prevTrack));
            dispatch(setPlaying(true));
        }
    };

    // Синхронизация локального состояния с Redux
    useEffect(() => {
        setIsPlaying(isPlayingRedux);
    }, [isPlayingRedux]);

    // Применение громкости
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Загрузка трека + остановка старого перед загрузкой нового
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !audioSrc) return;

        // Останавливаем и сбрасываем старое аудио перед загрузкой нового
        audio.pause();
        audio.currentTime = 0;

        setIsLoading(true);
        setCurrentTime(0);
        setDuration(0);
        audio.src = audioSrc;
        audio.preload = 'auto';
        audio.load();

        if (isPlayingRedux) {
            const onCanPlay = () => {
                setIsLoading(false);
                audio.play().catch(err => {
                    if (err.name === 'NotAllowedError') {
                        console.warn('Требуется взаимодействие пользователя');
                        dispatch(setPlaying(false));
                    }
                });
                audio.removeEventListener('canplay', onCanPlay);
            };
            audio.addEventListener('canplay', onCanPlay);
        } else {
            setIsLoading(false);
        }

        // Cleanup: останавливаем аудио при размонтировании
        return () => {
            audio.pause();
        };
    }, [audioSrc, currentTrackItem?._id, dispatch]);

    // Инициализация градиента громкости
    useEffect(() => {
        const progressLine = document.querySelector(
            `.${styles.volume__progressLine}`
        ) as HTMLElement;
        if (progressLine) {
            progressLine.style.setProperty('--volume-percent', `${volume * 100}%`);
        }
    }, [volume]);

    // Play/Pause
    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(err => {
                if (err.name === 'NotAllowedError') {
                    console.warn('Требуется взаимодействие пользователя');
                }
            });
        }
    };

    // Like — с проверкой авторизации
    const toggleLike = async (e?: React.MouseEvent) => {
        e?.stopPropagation();

        if (!currentTrackItem) return;

        const token = localStorage.getItem('token');

        if (!token) {
            setShowAuthToast(true);
            return;
        }

        // Оптимистичное обновление UI через Redux
        dispatch(toggleFavorite(currentTrackItem));

        // Запрос к бэкенду
        /* try {
            const method = isLiked ? 'DELETE' : 'POST';
            const response = await fetch(`${API_URL}/users/me/favorites/${currentTrackItem._id}/`, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                // Откат, если запрос не удался
                dispatch(toggleFavorite(currentTrackItem));
                throw new Error('Failed to update favorites');
            }
        } catch (error) {
            console.error('Error toggling favorite in Bar:', error);
        } */
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

    // Завершение трека: Repeat или переход к следующему
    const handleEnded = () => {
        if (isRepeat) {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(err => {
                    if (err.name === 'NotAllowedError') {
                        console.warn('Требуется взаимодействие пользователя');
                        dispatch(setPlaying(false));
                    }
                });
            }
        } else {
            handleNext();
        }
    };

    const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
        console.error('Audio error:', e);
    };

    if (!currentTrackItem || !audioSrc) {
        // Показываем skeleton когда трек загружается
        if (isLoading) {
            return <BarSkeleton />;
        }
        return null;
    }

    // Индексы считаем из tracks, а не из data
    const currentIndex = tracks.findIndex(track => track._id === currentTrackItem._id);
    const isFirstTrack = currentIndex === 0;
    const isLastTrack = currentIndex === tracks.length - 1;

    return (
        <div className={styles.bar}>
            <div className={styles.bar__progress}>
                {isLoading && (
                    <div className={styles.progress__loading}>
                        <span className={styles.progress__loadingText}>Загрузка трека...</span>
                    </div>
                )}

                <div className={styles.progress__time}>{getTimePanel(currentTime, duration)}</div>
                <ProgressBar max={duration} value={currentTime} step={0.1} onChange={handleSeek} />
            </div>

            <div className={styles.bar__block}>
                <audio
                    ref={audioRef}
                    src={audioSrc || undefined}
                    key={currentTrackItem?._id ?? 'no-track'}
                    preload='auto'
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onEnded={handleEnded}
                    onTimeUpdate={handleTimeUpdate}
                    onError={handleError}
                />

                <div className={styles.bar__btn}>
                    {/* Prev */}
                    <div
                        className={`${styles.btn__prev} ${isFirstTrack && !isShuffle ? styles.btn__disabled : ''}`}
                        onClick={handlePrev}
                        style={{
                            cursor: isFirstTrack && !isShuffle ? 'not-allowed' : 'pointer',
                            opacity: isFirstTrack && !isShuffle ? 0.3 : 1,
                        }}
                    >
                        <svg className={styles.btn__prevSvg}>
                            <use href='/img/icon/sprite.svg#icon-prev' />
                        </svg>
                    </div>

                    {/* Play/Pause */}
                    <div className={classNames(styles.btn__play, styles.btn)} onClick={togglePlay}>
                        <svg className={styles.btn__playSvg}>
                            <use
                                href={`/img/icon/sprite.svg#icon-${isPlaying ? 'pause' : 'play'}`}
                            />
                        </svg>
                    </div>

                    {/* Next */}
                    <div
                        className={`${styles.btn__next} ${isLastTrack && !isShuffle ? styles.btn__disabled : ''}`}
                        onClick={handleNext}
                        style={{
                            cursor: isLastTrack && !isShuffle ? 'not-allowed' : 'pointer',
                            opacity: isLastTrack && !isShuffle ? 0.3 : 1,
                        }}
                    >
                        <svg className={styles.btn__nextSvg}>
                            <use href='/img/icon/sprite.svg#icon-next' />
                        </svg>
                    </div>

                    {/* Repeat */}
                    <div
                        className={classNames(styles.btn__repeat, styles.btnIcon, {
                            [styles.btn__active]: isRepeat,
                        })}
                        onClick={() => setIsRepeat(!isRepeat)}
                        title={isRepeat ? 'Повтор включён' : 'Повтор выключен'}
                    >
                        <svg className={styles.btn__repeatSvg}>
                            <use href='/img/icon/sprite.svg#icon-repeat' />
                        </svg>
                    </div>

                    {/* Shuffle */}
                    <div
                        className={classNames(styles.btn__shuffle, styles.btnIcon, {
                            [styles.btn__active]: isShuffle,
                        })}
                        onClick={() => setIsShuffle(!isShuffle)}
                        title={isShuffle ? 'Перемешивание включено' : 'Перемешивание выключено'}
                    >
                        <svg className={styles.btn__shuffleSvg}>
                            <use href='/img/icon/sprite.svg#icon-shuffle' />
                        </svg>
                    </div>
                </div>

                {/* Блок с информацией о треке */}
                <div className={styles.bar__trackPlay}>
                    <div className={styles.trackPlay__image}>
                        <svg className={styles.trackPlay__svg}>
                            <use href='/img/icon/sprite.svg#icon-note' />
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

                {/* Громкость */}
                <div className={styles.bar__volume}>
                    <div className={styles.volume__content}>
                        <svg className={styles.volume__svg}>
                            <use xlinkHref='/img/icon/sprite.svg#icon-volume' />
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

            {showAuthToast && (
                <Toast
                    message='Чтобы ставить лайки, пожалуйста, авторизуйтесь'
                    onClose={() => setShowAuthToast(false)}
                />
            )}
        </div>
    );
}
