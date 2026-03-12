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
    <div className={'playlist__item'}>
      <div className={'playlist__track'}>
        <div className={'track__title'}>
          <div className={'track__titleImage'}>
            <svg className={'track__titleSvg'}>
              <use href="/img/icon/sprite.svg#icon-note"></use>
            </svg>
          </div>
          <div className="track__title-text">
            <a className={'track__titleLink'} href="">
              {title}
              {titleSpan && <span className={'track__titleSpan'}>{titleSpan}</span>}
            </a>
          </div>
        </div>
        <div className={'track__author'}>
          <a className={'track__authorLink'} href={authorLink}>
            {author}
          </a>
        </div>
        <div className={'track__album'}>
          <a className={'track__albumLink'} href={albumLink}>
            {album}
          </a>
        </div>
        <div className="track__time">
          <svg className={'track__timeSvg'}>
            <use href="/img/icon/sprite.svg#icon-like"></use>
          </svg>
          <span className={'track__timeText'}>{duration}</span>
        </div>
      </div>
    </div>
  );
}