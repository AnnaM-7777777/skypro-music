import styles from './page.module.css';
import Header from '@/components/Header/Header';
import NavMenu from '@/components/NavMenu/NavMenu';
import CenterBlock from '@/components/CenterBlock/CenterBlock';
import Sidebar from '@/components/Sidebar/Sidebar';
import PlayerBar from '@/components/PlayerBar/PlayerBar';

export default function Home() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <Header />
                <main className={styles.main}>
                    <NavMenu />
                    <CenterBlock />
                    <Sidebar />
                </main>
                <PlayerBar />
            </div>
        </div>
    );
}
