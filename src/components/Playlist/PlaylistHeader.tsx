import styles from './PlaylistHeader.module.css';

export default function PlaylistHeader() {
    return (
        <div className={styles.contentTitle}>
            <div className={`${styles.playlistTitleCol} ${styles.col01}`}>ТРЕК</div>
            <div className={`${styles.playlistTitleCol} ${styles.col02}`}>ИСПОЛНИТЕЛЬ</div>
            <div className={`${styles.playlistTitleCol} ${styles.col03}`}>АЛЬБОМ</div>
            <div className={`${styles.playlistTitleCol} ${styles.col04}`}>
                <svg className={styles.playlistTitleSvg}>
                    <use href='/img/icon/sprite.svg#icon-watch'></use>
                </svg>
            </div>
        </div>
    );
}
