import SearchBar from '@/components/SearchBar/SearchBar';
import FilterBar from '@/components/FilterBar/FilterBar';
import PlaylistHeader from '@/components/Playlist/PlaylistHeader';
import Playlist from '@/components/Playlist/Playlist';
import styles from './CenterBlock.module.css';

export default function CenterBlock() {
  return (
    <div className={styles.centerblock}>
      <SearchBar />
      <h2 className={styles.centerblockH2}>Треки</h2>
      <FilterBar />
      <div className={styles.centerblockContent}>
        <PlaylistHeader />
        <Playlist />
      </div>
    </div>
  );
}