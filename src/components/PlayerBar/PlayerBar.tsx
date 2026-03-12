import PlayerControls from './PlayerControls';
import NowPlaying from './NowPlaying';
import VolumeControl from './VolumeControl';
import styles from './PlayerBar.module.css';

export default function PlayerBar() {
  return (
    <div className={styles.bar}>
      <div className={styles.barContent}>
        <div className={styles.barPlayerProgress}></div>
        <div className={styles.barPlayerBlock}>
          <div className={styles.barPlayer}>
            <PlayerControls />
            <NowPlaying />
          </div>
          <VolumeControl />
        </div>
      </div>
    </div>
  );
}