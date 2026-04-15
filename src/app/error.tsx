'use client';

import Navigation from '@/components/Navigation/Navigation';
import Search from '@/components/Search/Search';
import IconLogout from '@/components/IconLogout/IconLogout';
import styles from './error.module.css';
import Image from 'next/image';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const handleLogout = () => {
        // 1. Удаляем токен
        document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
        console.log('Token cleared');

        // 2. Перенаправляем на страницу входа
        window.location.href = '/auth/signin';
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <main className={styles.main}>
                    <Navigation />

                    <div className={styles.errorPage}>
                        <Search />

                        <div className={styles.errorPage__info}>
                            <Image
                                width={120}
                                height={120}
                                src='/img/smile_sad.png'
                                alt='smile_sad'
                            />

                            <h2 className={styles.errorPage__h2}>Ошибка загрузки</h2>

                            <p className={styles.errorPage__p}>
                                Проверьте подключение к сети <br /> и повторите попытку
                            </p>

                            <button className={styles.errorPage__btnRetry} onClick={() => reset()}>
                                Повторить
                            </button>
                        </div>
                    </div>

                    <div className={styles.errorPageSidebar}>
                        <IconLogout onClick={handleLogout} />
                    </div>
                </main>
            </div>
        </div>
    );
}
