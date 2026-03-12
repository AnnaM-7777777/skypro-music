export default function VolumeControl() {
  return (
    <div className={'bar__volumeBlock'}>
      <div className={'volume__content'}>
        <div className={'volume__image'}>
          <svg className={'volume__svg'}>
            <use href="/img/icon/sprite.svg#icon-volume"></use>
          </svg>
        </div>
        <div className={'volume__progress btn'}>
          <input
            className={'volume__progressLine btn'}
            type="range"
            name="range"
          />
        </div>
      </div>
    </div>
  );
}