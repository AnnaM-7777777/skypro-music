import styles from './page.module.css';
import Navigation from '@/components/Navigation/Navigation';
import CenterBlock from '@/components/CenterBlock/CenterBlock';
import Sidebar from '@/components/Sidebar/Sidebar';
import Bar from '@/components/Bar/Bar';
import { redirect } from 'next/navigation';

export default function Home() {
    redirect('/auth/signin');

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <main className={styles.main}>
                    <Navigation />
                    <CenterBlock />
                    <Sidebar />
                </main>

                <Bar />

                <footer className='footer'></footer>
            </div>
        </div>
    );
}
