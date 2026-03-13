import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';
import SearchBar from '@/components/SearchBar/SearchBar';

export default function Header() {
    return (
        <div className={styles.header}>
            <div className={styles.headerLogo}>
                <Image
                    width={113}
                    height={17}
                    className={styles.headerLogoImage}
                    src='/img/logo.png'
                    alt='logo'
                    priority
                />
            </div>

            <SearchBar />

            <div className={styles.headerUserIcon}>
                <svg>
                    <use href='/img/icon/sprite.svg#logout'></use>
                </svg>
            </div>
        </div>
    );
}
