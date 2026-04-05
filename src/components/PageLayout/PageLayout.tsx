import Navigation from '@/components/Navigation/Navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import CenterBlock from '@/components/CenterBlock/CenterBlock';
import { TrackType } from '@/sharedTypes/sharedTypes';
import styles from '@/app/music/main/page.module.css';

interface PageLayoutProps {
    tracks: TrackType[];
    title?: string;
    children?: React.ReactNode; // если в будущем понадобятся дополнительные блоки
}

export default function PageLayout({ tracks, title, children }: PageLayoutProps) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <main className={styles.main}>
                    <Navigation />
                    <CenterBlock tracks={tracks} title={title} />
                    <Sidebar />
                    {children}
                </main>
            </div>
        </div>
    );
}
