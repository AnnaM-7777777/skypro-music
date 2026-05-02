import '../../globals.css';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import ReduxProvider from '../store/ReduxProvider';
import NetworkToast from '@/components/NetworkToast/NetworkToast';

const montserrat = Montserrat({
    variable: '--font-montserrat',
    subsets: ['cyrillic', 'latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'SkyPro Music',
    description: 'Музыкальный проект на Next.js',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ReduxProvider>
            <html lang='ru'>
                {''}
                <body className={montserrat.variable}>
                    {children}
                    <NetworkToast />
                </body>
            </html>
        </ReduxProvider>
    );
}
