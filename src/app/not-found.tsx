import Navigation from '@/components/Navigation/Navigation';
import Search from '@/components/Search/Search';
import IconLogout from '@/components/IconLogout/IconLogout';
import styles from '@/app/music/main/page.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <main className={styles.main}>
                    <Navigation />

                    <div className={styles.notFoundPage}>
                        <Search />

                        <div className={styles.notFoundPage__info}>
                            <h1 className={styles.notFoundPage__h1}>404</h1>
                            <div className={styles.notFoundPage__text}>
                                <h2 className={styles.notFoundPage__h2}>Страница не найдена</h2>

                                <Image
                                    width={52}
                                    height={52}
                                    src='/img/smile_crying.png'
                                    alt='smile_crying'
                                />
                            </div>
                            <p className={styles.notFoundPage__p}>
                                Возможно, она была удалена или перенесена на другой адрес
                            </p>
                            <Link className={styles.notFoundPage__btnLink} href={'./music/main'}>
                                Вернуться на главную
                            </Link>
                            ;
                        </div>
                    </div>

                    <IconLogout />
                </main>
            </div>
        </div>
    );
}
