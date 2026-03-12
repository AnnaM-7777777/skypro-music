export default function PlaylistHeader() {
  return (
    <div className={'content__title'}>
      <div className={'playlistTitle__col col01'}>Трек</div>
      <div className={'playlistTitle__col col02'}>Исполнитель</div>
      <div className={'playlistTitle__col col03'}>Альбом</div>
      <div className={'playlistTitle__col col04'}>
        <svg className={'playlistTitle__svg'}>
          <use href="/img/icon/sprite.svg#icon-watch"></use>
        </svg>
      </div>
    </div>
  );
}