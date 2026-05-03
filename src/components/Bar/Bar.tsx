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
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import styles from './Bar.module.css';
import { withReauth } from '@/utils/withReauth';
import '../../../skeleton.css';

const API_URL = 'https://webdev-music-003b5b991590.herokuapp.com';

interface BarProps {
    tracks: TrackType[];
}

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
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [showAuthToast, setShowAuthToast] = useState(false);
    const [showApiErrorToast, setShowApiErrorToast] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
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

    const isLiked = useAppSelector(state =>
        currentTrackItem ? selectIsFavorite(state, currentTrackItem._id) : false
    );

    const isLikedRef = useRef(isLiked);
    useEffect(() => {
        isLikedRef.current = isLiked;
    }, [isLiked]);

    // useMemo: кэшируем результат вычисления URL
    const audioSrc = useMemo(
        () => (currentTrackItem ? getSafeTrackUrl(currentTrackItem.track_file) : null),
        [currentTrackItem?.track_file]
    );

    // useCallback: кэшируем функцию получения случайного трека
    const getRandomTrack = useCallback(
        (excludeId?: number): TrackType | undefined => {
            const availableTracks = tracks.filter(t => t._id !== excludeId);
            if (availableTracks.length === 0) return undefined;
            const randomIndex = Math.floor(Math.random() * availableTracks.length);
            return availableTracks[randomIndex];
        },
        [tracks]
    );

    // Вычисляем индексы один раз и используем в хендлерах
    const trackIndices = useMemo(() => {
        if (!currentTrackItem) return { currentIndex: -1, isFirstTrack: true, isLastTrack: true };
        const currentIndex = tracks.findIndex(track => track._id === currentTrackItem._id);
        return {
            currentIndex,
            isFirstTrack: currentIndex === 0,
            isLastTrack: currentIndex === tracks.length - 1,
        };
    }, [tracks, currentTrackItem]);

    const handleNext = useCallback(() => {
        if (!currentTrackItem || tracks.length === 0) return;

        // Блокируем, если последний трек и нет перемешивания
        if (!isShuffle && trackIndices.isLastTrack) return;

        if (isShuffle) {
            const randomTrack = getRandomTrack(currentTrackItem._id);
            if (randomTrack) {
                dispatch(setCurrentTrack(randomTrack));
                dispatch(setPlaying(true));
            }
            return;
        }

        const nextIndex =
            trackIndices.currentIndex === tracks.length - 1 ? 0 : trackIndices.currentIndex + 1;
        const nextTrack = tracks[nextIndex];

        if (nextTrack) {
            dispatch(setCurrentTrack(nextTrack));
            dispatch(setPlaying(true));
        }
    }, [currentTrackItem, tracks, isShuffle, dispatch, getRandomTrack, trackIndices]);

    const handlePrev = useCallback(() => {
        if (!currentTrackItem || tracks.length === 0) return;

        // Блокируем, если первый трек и нет перемешивания
        if (!isShuffle && trackIndices.isFirstTrack) return;

        if (isShuffle) {
            const randomTrack = getRandomTrack(currentTrackItem._id);
            if (randomTrack) {
                dispatch(setCurrentTrack(randomTrack));
                dispatch(setPlaying(true));
            }
            return;
        }

        const prevIndex =
            trackIndices.currentIndex === 0 ? tracks.length - 1 : trackIndices.currentIndex - 1;
        const prevTrack = tracks[prevIndex];

        if (prevTrack) {
            dispatch(setCurrentTrack(prevTrack));
            dispatch(setPlaying(true));
        }
    }, [currentTrackItem, tracks, isShuffle, dispatch, getRandomTrack, trackIndices]);

    useEffect(() => {
        setIsPlaying(isPlayingRedux);
    }, [isPlayingRedux]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Простой эффект: сбрасываем состояние при смене трека
    useEffect(() => {
        if (!audioSrc) return;
        setIsLoading(true);
        setCurrentTime(0);
        // duration обновится через onLoadedMetadata на <audio>
    }, [audioSrc]);

    useEffect(() => {
        const progressLine = document.querySelector(
            `.${styles.volume__progressLine}`
        ) as HTMLElement;
        if (progressLine) {
            progressLine.style.setProperty('--volume-percent', `${volume * 100}%`);
        }
    }, [volume]);

    // useCallback: кэшируем обработчики плеера
    const togglePlay = useCallback(() => {
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
    }, [isPlaying]);

    // useCallback: кэшируем функцию лайка
    const toggleLike = useCallback(async () => {
        if (isLikeLoading || !currentTrackItem) return;
        setIsLikeLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
            setShowAuthToast(true);
            setIsLikeLoading(false);
            return;
        }

        const wasLiked = isLikedRef.current;
        dispatch(toggleFavorite(currentTrackItem));

        try {
            const method = wasLiked ? 'DELETE' : 'POST';
            await withReauth(async (accessToken: string) => {
                const response = await fetch(
                    `${API_URL}/catalog/track/${currentTrackItem._id}/favorite/`,
                    {
                        method,
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response;
            });

            setSuccessMessage(wasLiked ? 'Трек удалён из плейлиста' : 'Трек добавлен в плейлист');
            setShowSuccessToast(true);
        } catch (error) {
            dispatch(toggleFavorite(currentTrackItem));
            setShowApiErrorToast(true);
            console.error('Like error:', error);
        } finally {
            setIsLikeLoading(false);
        }
    }, [dispatch, currentTrackItem, isLikeLoading]);

    const handleTimeUpdate = useCallback(() => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    }, []);

    const volumeRef = useRef<HTMLInputElement>(null);
    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
        if (volumeRef.current) {
            volumeRef.current.style.setProperty('--volume-percent', `${newVolume * 100}%`);
        }
    }, []);

    const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    }, []);

    const handlePlay = useCallback(() => {
        setIsPlaying(true);
        dispatch(setPlaying(true));
    }, [dispatch]);

    const handlePause = useCallback(() => {
        setIsPlaying(false);
        dispatch(setPlaying(false));
    }, [dispatch]);

    // Полная логика автопереключения
    const handleEnded = useCallback(() => {
        if (!currentTrackItem) return;

        if (isRepeat) {
            // 🔁 Режим повтора: перезапускаем текущий трек
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(err => {
                    if (err.name === 'NotAllowedError') {
                        console.warn('Требуется взаимодействие пользователя');
                        dispatch(setPlaying(false));
                    }
                });
            }
        } else if (isShuffle) {
            // 🔀 Режим перемешивания: выбираем случайный трек
            const randomTrack = getRandomTrack(currentTrackItem._id);
            if (randomTrack) {
                dispatch(setCurrentTrack(randomTrack));
                dispatch(setPlaying(true));
            } else {
                // Нет других треков — останавливаем
                dispatch(setPlaying(false));
            }
        } else {
            // ▶️ Обычный режим
            if (!trackIndices.isLastTrack) {
                // Есть следующий трек — включаем его
                const nextIndex = trackIndices.currentIndex + 1;
                const nextTrack = tracks[nextIndex];
                if (nextTrack) {
                    dispatch(setCurrentTrack(nextTrack));
                    dispatch(setPlaying(true));
                }
            } else {
                // 🔚 Последний трек — останавливаем воспроизведение
                dispatch(setPlaying(false));
            }
        }
    }, [currentTrackItem, tracks, isRepeat, isShuffle, dispatch, getRandomTrack, trackIndices]);

    const handleError = useCallback((e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
        console.error('Audio error:', e);
        setIsLoading(false);
    }, []);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    const handleLikeClick = useCallback(
        (e?: React.MouseEvent) => {
            e?.stopPropagation();
            toggleLike();
        },
        [toggleLike]
    );

    if (!currentTrackItem || !audioSrc) {
        if (isLoading) return <BarSkeleton />;
        return null;
    }

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
                    onLoadedMetadata={e => {
                        const audio = e.currentTarget;
                        setDuration(audio.duration || 0);
                        if (isPlayingRedux && audio.readyState >= 2) {
                            audio.play().catch(err => {
                                if (err.name === 'NotAllowedError') {
                                    console.warn('Требуется взаимодействие пользователя');
                                    dispatch(setPlaying(false));
                                }
                            });
                        }
                    }}
                    onCanPlay={e => {
                        setIsLoading(false);
                        const audio = e.currentTarget;
                        if (isPlayingRedux) {
                            audio.play().catch(err => {
                                if (err.name === 'NotAllowedError') {
                                    console.warn('Требуется взаимодействие пользователя');
                                    dispatch(setPlaying(false));
                                }
                            });
                        }
                    }}
                />
                <div className={styles.bar__btn}>
                    <div
                        className={`${styles.btn__prev} ${trackIndices.isFirstTrack && !isShuffle ? styles.btn__disabled : ''}`}
                        onClick={handlePrev}
                        style={{
                            cursor:
                                trackIndices.isFirstTrack && !isShuffle ? 'not-allowed' : 'pointer',
                            opacity: trackIndices.isFirstTrack && !isShuffle ? 0.3 : 1,
                            pointerEvents:
                                trackIndices.isFirstTrack && !isShuffle ? 'none' : 'auto',
                        }}
                    >
                        <svg className={styles.btn__prevSvg}>
                            <use href='/img/icon/sprite.svg#icon-prev' />
                        </svg>
                    </div>
                    <div className={classNames(styles.btn__play, styles.btn)} onClick={togglePlay}>
                        <svg className={styles.btn__playSvg}>
                            <use
                                href={`/img/icon/sprite.svg#icon-${isPlaying ? 'pause' : 'play'}`}
                            />
                        </svg>
                    </div>
                    <div
                        className={`${styles.btn__next} ${trackIndices.isLastTrack && !isShuffle ? styles.btn__disabled : ''}`}
                        onClick={handleNext}
                        style={{
                            cursor:
                                trackIndices.isLastTrack && !isShuffle ? 'not-allowed' : 'pointer',
                            opacity: trackIndices.isLastTrack && !isShuffle ? 0.3 : 1,
                            pointerEvents: trackIndices.isLastTrack && !isShuffle ? 'none' : 'auto',
                        }}
                    >
                        <svg className={styles.btn__nextSvg}>
                            <use href='/img/icon/sprite.svg#icon-next' />
                        </svg>
                    </div>
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
                            className={classNames(styles.trackPlay__iconLike, {
                                [styles['liked-animation']]: isLiked,
                            })}
                            isFilled={isLiked}
                            isHovered={isHovered}
                            onClick={handleLikeClick}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        />
                    </div>
                </div>
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
                    icon='⚠️'
                    onClose={() => setShowAuthToast(false)}
                />
            )}
            {showApiErrorToast && (
                <Toast
                    message='Не удалось обновить лайк. Попробуйте позже.'
                    icon='❗'
                    onClose={() => setShowApiErrorToast(false)}
                />
            )}
            {showSuccessToast && (
                <Toast
                    message={successMessage}
                    icon={successMessage.includes('удалён') ? '❌' : '✔️'}
                    onClose={() => setShowSuccessToast(false)}
                />
            )}
        </div>
    );
}
