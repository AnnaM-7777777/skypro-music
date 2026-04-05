'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Sidebar.module.css';

export default function Sidebar() {
    const handleLogout = () => {
        // 1. Удаляем токен (устанавливаем max-age=0)
        document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
        console.log(' Token cleared');

        // 2. Перенаправляем на страницу входа
        window.location.href = '/auth/signin';
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebar__personal}>
                {/* <p className={styles.sidebar__personalName}>Sergey.Ivanov</p> */}

                <div
                    className={styles.sidebar__icon}
                    onClick={handleLogout}
                    style={{ cursor: 'pointer' }}
                    title='Выйти'
                >
                    <svg>
                        <use xlinkHref='/img/icon/sprite.svg#logout'></use>
                    </svg>
                </div>
            </div>

            <div className={styles.sidebar__block}>
                <div className={styles.sidebar__list}>
                    <Link className={styles.sidebar__link} href='/music/category/2'>
                        <Image
                            src='/img/playlist01.png'
                            alt="day's playlist"
                            width={250}
                            height={150}
                            style={{ objectFit: 'cover' }}
                            sizes='(max-width: 768px) 100vw, 250px'
                        />
                    </Link>

                    <Link className={styles.sidebar__link} href='/music/category/3'>
                        <Image
                            src='/img/playlist02.png'
                            alt="day's playlist"
                            width={250}
                            height={150}
                            style={{ objectFit: 'cover' }}
                            sizes='(max-width: 768px) 100vw, 250px'
                        />
                    </Link>

                    <Link className={styles.sidebar__link} href='/music/category/4'>
                        <Image
                            src='/img/playlist03.png'
                            alt="day's playlist"
                            width={250}
                            height={150}
                            style={{ objectFit: 'cover' }}
                            sizes='(max-width: 768px) 100vw, 250px'
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}
