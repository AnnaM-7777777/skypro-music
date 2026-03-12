import styles from './VolumeControl.module.css';

export default function VolumeControl() {
  return (
    <div className={styles.barVolumeBlock}>
      <div className={styles.volumeContent}>
        <div className={styles.volumeImage}>
          <svg className={styles.volumeSvg}>
            <use href="/img/icon/sprite.svg#icon-volume"></use>
          </svg>
        </div>
        <div className={styles.volumeProgress}>
          <input
            className={styles.volumeProgressLine}
            type="range"
            name="range"
            min="0"
            max="100"
            defaultValue="50"
          />
        </div>
      </div>
    </div>
  );
}