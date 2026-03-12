export default function PlayerControls() {
  return (
    <div className={'player__controls'}>
      <div className={'player__btnPrev'}>
        <svg className={'player__btnPrevSvg'}>
          <use href="/img/icon/sprite.svg#icon-prev"></use>
        </svg>
      </div>
      <div className={'player__btnPlay btn'}>
        <svg className={'player__btnPlaySvg'}>
          <use href="/img/icon/sprite.svg#icon-play"></use>
        </svg>
      </div>
      <div className={'player__btnNext'}>
        <svg className={'player__btnNextSvg'}>
          <use href="/img/icon/sprite.svg#icon-next"></use>
        </svg>
      </div>
      <div className={'player__btnRepeat btnIcon'}>
        <svg className={'player__btnRepeatSvg'}>
          <use href="/img/icon/sprite.svg#icon-repeat"></use>
        </svg>
      </div>
      <div className={'player__btnShuffle btnIcon'}>
        <svg className={'player__btnShuffleSvg'}>
          <use href="/img/icon/sprite.svg#icon-shuffle"></use>
        </svg>
      </div>
    </div>
  );
}