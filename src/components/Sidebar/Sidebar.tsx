import SidebarPlaylistItem from './SidebarPlaylistItem';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  return (
    <div className={styles.mainSidebar}>
      <div className={styles.sidebarPersonal}>
        <p className={styles.sidebarPersonalName}>Sergey.Ivanov</p>
        <div className={styles.sidebarIcon}>
          <svg>
            <use href="/img/icon/sprite.svg#logout"></use>
          </svg>
        </div>
      </div>
      <div className={styles.sidebarBlock}>
        <div className={styles.sidebarList}>
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