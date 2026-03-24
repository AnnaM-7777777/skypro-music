import Filter from '@/components/Filter/Filter';
import Search from '@/components/Search/Search';
import TrackList from '@/components/Track/Track';
import styles from './CenterBlock.module.css';

export default function CenterBlock() {
    return (
        <div className={styles.centerblock}>
            <Search />

            <h2 className={styles.centerblock__h2}>Треки</h2>

            <Filter />
            <TrackList />
        </div>
    );
}
