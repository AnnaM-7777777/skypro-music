import Filter from '@/components/Filter/Filter';
import Search from '@/components/Search/Search';
import TrackList from '@/components/Track/Track';
import styles from './CenterBlock.module.css';
import { TrackType } from '@/sharedTypes/sharedTypes';
import Bar from '@/components/Bar/Bar';

interface CenterBlockProps {
    tracks: TrackType[];
    title?: string;
    isLoading?: boolean;
    showEmptyState?: boolean;
}

export default function CenterBlock({
    tracks,
    title = 'Треки',
    isLoading = false,
    showEmptyState = true, // По умолчанию показываем, но можно отключить
}: CenterBlockProps) {
    const allGenres = tracks.flatMap(t => t.genre || []);
    const genres = [...new Set(allGenres)];
    const artists = [...new Set(tracks.map(t => t.author))];

    if (!isLoading && tracks.length === 0 && showEmptyState) {
        return (
            <>
                <div className={styles.centerblock}>
                    <Search />

                    <h2 className={styles.centerblock__h2}>{title}</h2>

                    <Filter genres={[]} artists={[]} />

                    <div className={styles.centerBlock__empty}>
                        <p className={styles.empty__title}>Ваш плейлист пуст</p>
                        <p className={styles.empty__text}>
                            Нажмите на <span className={styles.empty__heart}>&#10084;</span> рядом с
                            треками, чтобы добавить их сюда
                        </p>
                    </div>
                </div>

                <Bar tracks={tracks} />
            </>
        );
    }

    return (
        <>
            <div className={styles.centerblock}>
                <Search />

                <h2 className={styles.centerblock__h2}>{title}</h2>

                <Filter genres={genres} artists={artists} />
                <TrackList tracks={tracks} isLoading={isLoading} />
            </div>

            <Bar tracks={tracks} />
        </>
    );
}
