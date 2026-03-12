import SidebarPlaylistItem from './SidebarPlaylistItem';

export default function Sidebar() {
  return (
    <div className={'main__sidebar'}>
      <div className={'sidebar__personal'}>
        <p className={'sidebar__personalName'}>Sergey.Ivanov</p>
        <div className={'sidebar__icon'}>
          <svg>
            <use href="/img/icon/sprite.svg#logout"></use>
          </svg>
        </div>
      </div>
      <div className={'sidebar__block'}>
        <div className={'sidebar__list'}>
          <SidebarPlaylistItem
            src="/img/playlist01.png"
            alt="day's playlist"
          />
          <SidebarPlaylistItem
            src="/img/playlist02.png"
            alt="day's playlist"
          />
          <SidebarPlaylistItem
            src="/img/playlist03.png"
            alt="day's playlist"
          />
        </div>
      </div>
    </div>
  );
}