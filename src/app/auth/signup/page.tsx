'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './signup.module.css';
import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';

const API_URL = 'https://webdev-music-003b5b991590.herokuapp.com';

// Универсальный компонент сообщений
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

export default function SignUp() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '', username: '' });
    const [error, setError] = useState('');
    const [validationError, setValidationError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false); // ← Новое: флаг успеха

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setValidationError('');
        setShowSuccess(false); // Скрываем успех при вводе
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setValidationError('');
        setShowSuccess(false);

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
        if (!formData.username.trim()) {
            setValidationError('Введите имя пользователя');
            return;
        }
        if (formData.username.length < 3) {
            setValidationError('Имя пользователя должно содержать не менее 3 символов');
            return;
        }
        if (formData.password.length < 6) {
            setValidationError('Пароль должен содержать не менее 6 символов');
            return;
        }

        setLoading(true);

        try {
            // 1. Регистрация
            const signupRes = await fetch(`${API_URL}/user/signup/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    username: formData.username,
                }),
            });
            const signupData = await signupRes.json();
            if (!signupRes.ok) throw new Error(signupData.message || 'Ошибка регистрации');

            // 2. Получаем токен
            const tokenRes = await fetch(`${API_URL}/user/token/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
            });
            const tokenData = await tokenRes.json();

            if (tokenRes.ok && tokenData.access) {
                document.cookie = `token=${tokenData.access}; path=/; max-age=604800; SameSite=Lax`;

                // Показываем успех
                setShowSuccess(true);

                // Ждём 2 секунды и редиректим на вход
                setTimeout(() => {
                    window.location.href = '/auth/signin';
                }, 2000);

                return;
            } else {
                throw new Error('Не удалось получить токен');
            }
        } catch (err: any) {
            setError(err.message || 'Произошла ошибка при регистрации');
        } finally {
            setLoading(false);
        }
    };

    // Простая логика сообщений: только ошибки
    const getMessage = () => {
        if (validationError) return { type: 'error' as const, text: validationError, shake: true };
        if (error) return { type: 'error' as const, text: error, shake: false };
        if (showSuccess)
            return {
                type: 'success' as const,
                text: 'Регистрация успешна! Теперь войдите в аккаунт.',
                shake: false,
            };
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

            {/* Одно сообщение для всего */}
            {messageData && (
                <FormMessage
                    type={messageData.type}
                    text={messageData.text}
                    shake={messageData.shake}
                />
            )}

            <button
                className={styles.modal__btnSignupEnt}
                type='submit'
                disabled={loading || showSuccess}
            >
                {loading
                    ? 'Регистрация...'
                    : showSuccess
                      ? 'Перенаправление...'
                      : 'Зарегистрироваться'}
            </button>
        </form>
    );
}
