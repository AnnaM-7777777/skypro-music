import Image from 'next/image';
import Link from 'next/link';
import styles from './SidebarPlaylistItem.module.css';

interface SidebarPlaylistItemProps {
    src: string;
    alt: string;
    href?: string;
    priority?: boolean;
}

export default function SidebarPlaylistItem({
    src,
    alt,
    href = '#',
    priority = false,
}: SidebarPlaylistItemProps) {
    return (
        <div className={styles.sidebarItem}>
            <Link className={styles.sidebarLink} href={href}>
                <Image
                    className={styles.sidebarImg}
                    src={src}
                    alt={alt}
                    width={250}
                    height={150}
                    priority={priority}
                />
            </Link>
        </div>
    );
}
