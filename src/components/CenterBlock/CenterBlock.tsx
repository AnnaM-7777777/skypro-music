import Filter from '@/components/Filter/Filter';
import Search from '@/components/Search/Search';
import TrackList from '@/components/Track/Track';
import styles from './CenterBlock.module.css';
import { TrackType } from '@/sharedTypes/sharedTypes';
import Bar from '@/components/Bar/Bar';

interface CenterBlockProps {
    tracks: TrackType[];
    title?: string;
}

export default function CenterBlock({ tracks, title = 'Треки' }: CenterBlockProps) {
    const allGenres = tracks.flatMap(t => t.genre || []);
    const genres = [...new Set(allGenres)];
    const artists = [...new Set(tracks.map(t => t.author))];

    return (
        <>
            <div className={styles.centerblock}>
                <Search />

                <h2 className={styles.centerblock__h2}>{title}</h2>

                <Filter genres={genres} artists={artists} />
                <TrackList tracks={tracks} />
            </div>

            <Bar tracks={tracks} />
        </>
    );
}
