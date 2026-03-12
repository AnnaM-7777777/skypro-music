import './page.css';
import Header from '@/components/Header/Header';
import CenterBlock from '@/components/CenterBlock/CenterBlock';
import Sidebar from '@/components/Sidebar/Sidebar';
import PlayerBar from '@/components/PlayerBar/PlayerBar';
import Footer from '@/components/Footer/Footer';

export default function Home() {
  return (
    <div className={'wrapper'}>
      <div className={'container'}>
        <main className={'main'}>
          <Header />
          <CenterBlock />
          <Sidebar />
        </main>
        <PlayerBar />
        <Footer />
      </div>
    </div>
  );
}
