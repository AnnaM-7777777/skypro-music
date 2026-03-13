import PlayerControls from './PlayerControls';
import NowPlaying from './NowPlaying';
import VolumeControl from './VolumeControl';
import styles from './PlayerBar.module.css';

export default function PlayerBar() {
    return (
        <div className={styles.playerBar}>
            <div className={styles.playerBarContent}>
                <div className={styles.playerBarProgress}></div>
                <div className={styles.playerBarBlock}>
                    <div className={styles.playerBarPlay}>
                        <PlayerControls />
                        <NowPlaying />
                    </div>
                    <VolumeControl />
                </div>
            </div>
        </div>
    );
}
