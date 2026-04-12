import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function HomePage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    // Нет токена → отправляем на вход
    if (!token) {
        redirect('/auth/signin');
    }

    // Есть токен → отправляем на страницу с музыкой
    redirect('/music/main');
}
