import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import styles from './page.module.css';
import Navigation from '@/components/Navigation/Navigation';
import CenterBlock from '@/components/CenterBlock/CenterBlock';
import Sidebar from '@/components/Sidebar/Sidebar';
import Bar from '@/components/Bar/Bar';

export default async function Home() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    console.log('Home page - token:', token?.value ? 'EXISTS' : 'NOT FOUND');

    if (!token?.value) {
        console.log('Redirecting to /auth/signin (no token)');
        redirect('/auth/signin');
    }

    console.log('Showing main page');

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
