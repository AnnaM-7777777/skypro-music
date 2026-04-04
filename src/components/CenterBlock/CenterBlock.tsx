import Filter from '@/components/Filter/Filter';
import Search from '@/components/Search/Search';
import TrackList from '@/components/Track/Track';
import styles from './CenterBlock.module.css';
import { TrackType } from '@/sharedTypes/sharedTypes';
import Bar from '@/components/Bar/Bar';

interface CenterBlockProps {
    tracks: TrackType[];
}

export default function CenterBlock({ tracks }: CenterBlockProps) {
    return (
        <>
            <div className={styles.centerblock}>
                <Search />
                <h2 className={styles.centerblock__h2}>Треки</h2>
                <Filter />
                <TrackList tracks={tracks} />
            </div>

            <Bar tracks={tracks} />
        </>
    );
}
