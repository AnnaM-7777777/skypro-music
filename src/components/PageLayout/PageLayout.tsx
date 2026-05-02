import type { ReactNode } from 'react';
import Navigation from '@/components/Navigation/Navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import CenterBlock from '@/components/CenterBlock/CenterBlock';
import { TrackType } from '@/sharedTypes/sharedTypes';
import styles from '@/app/music/main/page.module.css';

interface PageLayoutProps {
    tracks: TrackType[];
    title?: string;
    isLoading?: boolean;
    showEmptyState?: boolean;
    children?: React.ReactNode;
    emptyMessage?: string;
    emptyDescription?: ReactNode;
}

export default function PageLayout({
    tracks,
    title,
    isLoading = false,
    showEmptyState = true,
    children,
    emptyMessage,
    emptyDescription,
}: PageLayoutProps) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <main className={styles.main}>
                    <Navigation />
                    <CenterBlock
                        tracks={tracks}
                        title={title}
                        isLoading={isLoading}
                        showEmptyState={showEmptyState}
                        emptyMessage={emptyMessage}
                        emptyDescription={emptyDescription}
                    />
                    <Sidebar isLoading={isLoading} />
                    {children}
                </main>
            </div>
        </div>
    );
}
