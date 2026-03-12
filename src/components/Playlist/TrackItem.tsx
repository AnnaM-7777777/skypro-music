import styles from './TrackItem.module.css';
import classNames from 'classnames';

interface TrackItemProps {
  title: string;
  titleSpan?: string;
  author: string;
  authorLink?: string;
  album: string;
  albumLink?: string;
  duration: string;
}

export default function TrackItem({
  title,
  titleSpan,
  author,
  authorLink = '#',
  album,
  albumLink = '#',
  duration,
}: TrackItemProps) {
  return (
    <div className={styles.playlistItem}>
      <div className={styles.playlistTrack}>
        <div className={styles.trackTitle}>
          <div className={styles.trackTitleImage}>
            <svg className={styles.trackTitleSvg}>
              <use href="/img/icon/sprite.svg#icon-note"></use>
            </svg>
          </div>
          <div className={styles.trackTitleText}>
            <a className={styles.trackTitleLink} href="">
              {title}
              {titleSpan && (
                <span className={styles.trackTitleSpan}>{titleSpan}</span>
              )}
            </a>
          </div>
        </div>
        <div className={styles.trackAuthor}>
          <a className={styles.trackAuthorLink} href={authorLink}>
            {author}
          </a>
        </div>
        <div className={styles.trackAlbum}>
          <a className={styles.trackAlbumLink} href={albumLink}>
            {album}
          </a>
        </div>
        <div className={styles.trackTime}>
          <svg className={styles.trackTimeSvg}>
            <use href="/img/icon/sprite.svg#icon-like"></use>
          </svg>
          <span className={styles.trackTimeText}>{duration}</span>
        </div>
      </div>
    </div>
  );
}