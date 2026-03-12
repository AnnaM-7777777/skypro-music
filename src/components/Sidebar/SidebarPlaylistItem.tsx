import Image from 'next/image';
import styles from './SidebarPlaylistItem.module.css';

interface SidebarPlaylistItemProps {
  src: string;
  alt: string;
  href?: string;
}

export default function SidebarPlaylistItem({
  src,
  alt,
  href = '#',
}: SidebarPlaylistItemProps) {
  return (
    <div className={styles.sidebarItem}>
      <a className={styles.sidebarLink} href={href}>
        <Image
          className={styles.sidebarImg}
          src={src}
          alt={alt}
          width={250}
          height={170}
          style={{ objectFit: 'cover', width: 'auto', height: 'auto' }}
          sizes="(max-width: 768px) 100vw, 250px"
        />
      </a>
    </div>
  );
}