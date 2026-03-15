'use client';

import TrackItem from './TrackItem';
import { data } from '@/app/data';
import { useAppSelector } from '../../store/store';
import styles from './Playlist.module.css';

const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function Playlist() {
    const currentTrack = useAppSelector(state => state.tracks.currentTrack);
    const isPlayingGlobal = useAppSelector(state => state.tracks.isPlaying);

    return (
        <div className={styles.contentPlaylist}>
            {data.map(track => (
                <TrackItem
                    key={track._id}
                    track={track}
                    title={track.name}
                    author={track.author}
                    album={track.album}
                    duration={formatDuration(track.duration_in_seconds)}
                    authorLink='#'
                    albumLink='#'
                    isCurrent={currentTrack?._id === track._id}
                    // Точка пульсирует ТОЛЬКО если: трек текущий И идёт воспроизведение
                    isPlaying={isPlayingGlobal && currentTrack?._id === track._id}
                />
            ))}
        </div>
    );
}
