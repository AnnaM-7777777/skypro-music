import styles from './PlaylistHeader.module.css';

export default function PlaylistHeader() {
  return (
    <div className={styles.contentTitle}>
      <div className={`${styles.playlistTitleCol} ${styles.col01}`}>Трек</div>
      <div className={`${styles.playlistTitleCol} ${styles.col02}`}>Исполнитель</div>
      <div className={`${styles.playlistTitleCol} ${styles.col03}`}>Альбом</div>
      <div className={`${styles.playlistTitleCol} ${styles.col04}`}>
        <svg className={styles.playlistTitleSvg}>
          <use href="/img/icon/sprite.svg#icon-watch"></use>
        </svg>
      </div>
    </div>
  );
}