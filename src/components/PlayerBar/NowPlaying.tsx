import styles from './NowPlaying.module.css';

export default function NowPlaying() {
  return (
    <div className={styles.playerTrackPlay}>
      <div className={styles.trackPlayContain}>
        <div className={styles.trackPlayImage}>
          <svg className={styles.trackPlaySvg}>
            <use href="/img/icon/sprite.svg#icon-note"></use>
          </svg>
        </div>
        <div className={styles.trackPlayAuthor}>
          <a className={styles.trackPlayAuthorLink} href="">
            Ты та...
          </a>
        </div>
        <div className={styles.trackPlayAlbum}>
          <a className={styles.trackPlayAlbumLink} href="">
            Баста
          </a>
        </div>
      </div>

      <div className={styles.trackPlayDislike}>
        <div className={styles.playerBtnShuffle}>
          <svg className={styles.trackPlayLikeSvg}>
            <use href="/img/icon/sprite.svg#icon-like"></use>
          </svg>
        </div>
        <div className={styles.trackPlayDislike}>
          <svg className={styles.trackPlayDislikeSvg}>
            <use href="/img/icon/sprite.svg#icon-dislike"></use>
          </svg>
        </div>
      </div>
    </div>
  );
}