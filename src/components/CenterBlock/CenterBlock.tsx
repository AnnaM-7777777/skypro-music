import SearchBar from '@/components/SearchBar/SearchBar';
import FilterBar from '@/components/FilterBar/FilterBar';
import PlaylistHeader from '@/components/Playlist/PlaylistHeader';
import Playlist from '@/components/Playlist/Playlist';

export default function CenterBlock() {
  return (
    <div className={'centerblock'}>
      <SearchBar />
      <h2 className={'centerblock__h2'}>Треки</h2>
      <FilterBar />
      <div className={'centerblock__content'}>
        <PlaylistHeader />
        <Playlist />
      </div>
    </div>
  );
}