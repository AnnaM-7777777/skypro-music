'use client';
import { useState } from 'react';
import styles from './signin.module.css';
import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';

const API_URL = 'https://webdev-music-003b5b991590.herokuapp.com';

export default function Signin() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Signin form submitted');

        setLoading(true);
        setError('');

        try {
            // 1. Логин
            console.log('Sending login request...');
            const loginRes = await fetch(`${API_URL}/user/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });
            console.log('Login response status:', loginRes.status);

            const loginData = await loginRes.json();
            console.log('Login response:', loginData);

            if (!loginRes.ok) {
                throw new Error(loginData.message || 'Ошибка входа');
            }

            // 2. Получаем токен
            console.log('Sending token request...');
            const tokenRes = await fetch(`${API_URL}/user/token/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });
            console.log('Token response status:', tokenRes.status);

            const tokenData = await tokenRes.json();
            console.log('Token response:', tokenData);

            // ВАЖНО: используем tokenData.access, а не tokenData.token
            if (tokenRes.ok && tokenData.access) {
                // 3. Сохраняем токен в cookie
                document.cookie = `token=${tokenData.access}; path=/; max-age=604800; SameSite=Lax`;
                console.log('Token saved to cookie');
                console.log('Current cookies:', document.cookie);

                // 4. Редирект на главную (используем window.location для надёжности)
                console.log('Redirecting to /');
                window.location.href = '/';
                return; // Важно: выйти из функции после редиректа
            } else {
                console.error('Invalid token response:', tokenData);
                throw new Error('Не удалось получить токен');
            }
        } catch (err: any) {
            console.error('Signin error:', err);
            setError(err.message || 'Произошла ошибка при входе');
        } finally {
            console.log('Finally block - loading: false');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.modal__form}>
            <Link href='/'>
                <div className={styles.modal__logo}>
                    <Image
                        width={140}
                        height={21}
                        className={styles.headerLogoImage}
                        src='/img/logo_modal.png'
                        alt='logo'
                        priority
                    />
                </div>
            </Link>

            <input
                className={classNames(styles.modal__input, styles.login)}
                type='email'
                name='email'
                placeholder='Почта'
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                className={classNames(styles.modal__input)}
                type='password'
                name='password'
                placeholder='Пароль'
                value={formData.password}
                onChange={handleChange}
                required
            />

            <div className={styles.errorContainer}>
                {error && <span className={styles.error}>{error}</span>}
            </div>

            <button className={styles.modal__btnEnter} type='submit' disabled={loading}>
                {loading ? 'Вход...' : 'Войти'}
            </button>

            <Link href='/auth/signup' className={styles.modal__btnSignup}>
                Зарегистрироваться
            </Link>
        </form>
    );
}
