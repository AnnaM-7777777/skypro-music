import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Лог для отладки (смотрите в терминале, где запущен npm run dev)
    console.log(`[Middleware] ${pathname} | Token: ${token ? '✅' : '❌'}`);

    // Если нет токена и лезет на /music/* → редирект на вход
    if (pathname.startsWith('/music') && !token) {
        console.log(`[Middleware] Redirecting ${pathname} → /auth/signin`);
        return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    // Если есть токен и лезет на /auth/* → редирект на главную
    if (pathname.startsWith('/auth') && token) {
        console.log(`[Middleware] Already auth, redirecting ${pathname} → /music/main`);
        return NextResponse.redirect(new URL('/music/main', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/music/:path*', '/auth/:path*'],
};
