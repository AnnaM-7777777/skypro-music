'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Sidebar.module.css';
import '../../../skeleton.css';
import IconLogout from '@/components/IconLogout/IconLogout';

interface SidebarProps {
    isLoading?: boolean;
}

// Skeleton для плейлистов
function PlaylistSkeleton() {
    return (
        <div className={styles.sidebar__list}>
            {[...Array(3)].map((_, index) => (
                <div key={index} className={styles.sidebar__link}>
                    <div className='skeleton skeleton__playList' />
                </div>
            ))}
        </div>
    );
}

export default function Sidebar({ isLoading = false }: SidebarProps) {
    const [username, setUsername] = useState<string>(''); // Состояние для имени пользователя

    // Эффект для чтения имени из localStorage при загрузке
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    if (isLoading) {
        return (
            <div className={styles.sidebar}>
                <div className={styles.sidebar__personal}>
                    <div className={styles.sidebar__icon} style={{ cursor: 'default' }}>
                        <svg>
                            <use xlinkHref='/img/icon/sprite.svg#logout'></use>
                        </svg>
                    </div>
                </div>
                <div className={styles.sidebar__block} style={{ marginTop: '240px' }}>
                    <PlaylistSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebar__personal}>
                <p className={styles.sidebar__personalName}>{username || 'Гость'}</p>

                <IconLogout />
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
