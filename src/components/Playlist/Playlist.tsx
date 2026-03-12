import TrackItem from './TrackItem';
import styles from './Playlist.module.css';

const tracks = [
  {
    id: 1,
    title: 'Guilt',
    author: 'Nero',
    album: 'Welcome Reality',
    duration: '4:44',
  },
  {
    id: 2,
    title: 'Elektro',
    author: 'Dynoro, Outwork, Mr. Gee',
    album: 'Elektro',
    duration: '2:22',
  },
  {
    id: 3,
    title: "I'm Fire",
    author: 'Ali Bakgor',
    album: "I'm Fire",
    duration: '2:22',
  },
  {
    id: 4,
    title: 'Non Stop',
    titleSpan: '(Remix)',
    author: 'Стоункат, Psychopath',
    album: 'Non Stop',
    duration: '4:12',
  },
  {
    id: 5,
    title: 'Run Run',
    titleSpan: '(feat. AR/CO)',
    author: 'Jaded, Will Clarke, AR/CO',
    album: 'Run Run',
    duration: '2:54',
  },
];

export default function Playlist() {
  return (
    <div className={styles.contentPlaylist}>
      {tracks.map((track) => (
        <TrackItem key={track.id} {...track} />
      ))}
    </div>
  );
}