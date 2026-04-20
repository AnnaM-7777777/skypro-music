'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './signin.module.css';
import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';

const API_URL = 'https://webdev-music-003b5b991590.herokuapp.com';

interface FormMessageProps {
    type: 'error' | 'success';
    text: string;
    shake?: boolean;
}

function FormMessage({ type, text, shake = false }: FormMessageProps) {
    if (!text) return null;
    const baseClass = `${styles.formMessage} ${styles[`formMessage--${type}`]}`;
    const shakeClass = shake && type === 'error' ? styles.shake : '';
    return (
        <div className={`${baseClass} ${shakeClass}`}>
            <span>{type === 'error' ? '⚠️' : '✅'}</span>
            <span>{text}</span>
        </div>
    );
}

export default function Signin() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [validationError, setValidationError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setValidationError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setValidationError('');

        // Валидация
        if (!formData.email.trim()) {
            setValidationError('Введите адрес электронной почты');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setValidationError('Неверный формат электронной почты');
            return;
        }
        if (!formData.password) {
            setValidationError('Введите пароль');
            return;
        }
        if (formData.password.length < 6) {
            setValidationError('Пароль должен содержать не менее 6 символов');
            return;
        }

        setLoading(true);

        try {
            // 1. Логин
            const loginRes = await fetch(`${API_URL}/user/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
            });
            const loginData = await loginRes.json();
            if (!loginRes.ok) throw new Error(loginData.message || 'Ошибка входа');

            // 2. Получаем токен
            const tokenRes = await fetch(`${API_URL}/user/token/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
            });
            const tokenData = await tokenRes.json();

            if (tokenRes.ok && tokenData.access) {
                // Сохраняем токен
                localStorage.setItem('token', tokenData.access);

                // Сохраняем имя пользователя:
                // Если API вернул username в loginData
                if (loginData?.username) {
                    localStorage.setItem('username', loginData.username);
                }
                // Если нет — используем email
                else if (formData.email) {
                    localStorage.setItem('username', formData.email);
                }

                // Клиентский редирект
                router.push('/music/main');
                return;
            } else {
                throw new Error('Не удалось получить токен');
            }
        } catch (err: any) {
            setError(err.message || 'Произошла ошибка при входе');
        } finally {
            setLoading(false);
        }
    };

    const getMessage = () => {
        if (validationError) return { type: 'error' as const, text: validationError, shake: true };
        if (error) return { type: 'error' as const, text: error, shake: false };
        return null;
    };

    const messageData = getMessage();

    return (
        <form onSubmit={handleSubmit} className={styles.modal__form} noValidate>
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

            {messageData && (
                <FormMessage
                    type={messageData.type}
                    text={messageData.text}
                    shake={messageData.shake}
                />
            )}

            <button className={styles.modal__btnEnter} type='submit' disabled={loading}>
                {loading ? 'Вход...' : 'Войти'}
            </button>

            <Link href='/auth/signup' className={styles.modal__btnSignup}>
                Зарегистрироваться
            </Link>
        </form>
    );
}
