'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './signup.module.css';
import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';

const API_URL = 'https://webdev-music-003b5b991590.herokuapp.com';

export default function SignUp() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted');

        if (formData.password.length < 6) {
            setError('Пароль должен быть не менее 6 символов');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 1. Регистрация
            console.log('Sending signup request...');
            const signupRes = await fetch(`${API_URL}/user/signup/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    username: formData.username,
                }),
            });
            console.log('Signup response status:', signupRes.status);

            const signupData = await signupRes.json();
            console.log('Signup response:', signupData);

            if (!signupRes.ok) {
                throw new Error(signupData.message || 'Ошибка регистрации');
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

            if (tokenRes.ok && tokenData.access) {
                // 3. Сохраняем токен в cookie
                document.cookie = `token=${tokenData.access}; path=/; max-age=604800; SameSite=Lax`;

                // Даем браузеру время записать куку перед редиректом
                setTimeout(() => {
                    window.location.href = '/';
                }, 50); // 50мс

                console.log('Token saved to cookie');
                console.log('Current cookies:', document.cookie);

                // 4. Редирект (БЕЗ router.refresh())
                console.log('Redirecting to /');

                // Используем window.location как более надёжный вариант
                window.location.href = '/';
                return; // Выйти из функции после редиректа
            } else {
                throw new Error('Не удалось получить токен: ' + JSON.stringify(tokenData));
            }
        } catch (err: any) {
            console.error('Error:', err);
            setError(err.message || 'Произошла ошибка при регистрации');
        } finally {
            console.log('Finally block');
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
                className={styles.modal__input}
                type='text'
                name='username'
                placeholder='Имя пользователя'
                value={formData.username}
                onChange={handleChange}
                required
            />
            <input
                className={styles.modal__input}
                type='password'
                name='password'
                placeholder='Пароль'
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
            />

            <div className={styles.errorContainer}>
                {error && <span className={styles.error}>{error}</span>}
            </div>

            <button className={styles.modal__btnSignupEnt} type='submit' disabled={loading}>
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
        </form>
    );
}
