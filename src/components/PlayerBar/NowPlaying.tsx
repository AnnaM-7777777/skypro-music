export default function NowPlaying() {
  return (
    <div className={'player__trackPlay'}>
      <div className={'trackPlay__contain'}>
        <div className={'trackPlay__image'}>
          <svg className={'trackPlay__svg'}>
            <use href="/img/icon/sprite.svg#icon-note"></use>
          </svg>
        </div>
        <div className={'trackPlay__author'}>
          <a className={'trackPlay__authorLink'} href="">
            Ты та...
          </a>
        </div>
        <div className={'trackPlay__album'}>
          <a className={'trackPlay__albumLink'} href="">
            Баста
          </a>
        </div>
      </div>

      <div className={'trackPlay__dislike'}>
        <div className={'player__btnShuffle btnIcon'}>
          <svg className={'trackPlay__likeSvg'}>
            <use href="/img/icon/sprite.svg#icon-like"></use>
          </svg>
        </div>
        <div className={'trackPlay__dislike btnIcon'}>
          <svg className={'trackPlay__dislikeSvg'}>
            <use href="/img/icon/sprite.svg#icon-dislike"></use>
          </svg>
        </div>
      </div>
    </div>
  );
}