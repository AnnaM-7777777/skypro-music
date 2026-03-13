import Image from 'next/image';
import Link from 'next/link';
import styles from './NavMenu.module.css';

export default function NavMenu() {
    return (
        <nav className={styles.mainNav}>
            <div className={styles.navBurger}>
                <span className={styles.burgerLine}></span>
                <span className={styles.burgerLine}></span>
                <span className={styles.burgerLine}></span>
            </div>

            <div className={styles.navMenu}>
                <ul className={styles.menuList}>
                    <li className={styles.menuItem}>
                        <Link href='/' className={styles.menuLink}>
                            Главное
                        </Link>
                    </li>
                    <li className={styles.menuItem}>
                        <Link href='/playlist' className={styles.menuLink}>
                            Мой плейлист
                        </Link>
                    </li>
                    <li className={styles.menuItem}>
                        <Link href='/auth/signin' className={styles.menuLink}>
                            Войти
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
