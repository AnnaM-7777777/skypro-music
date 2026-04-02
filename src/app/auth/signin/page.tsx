'use client';
import styles from './signin.module.css';
import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';

export default function Signin() {
    return (
        <>
            {/* Только УНИКАЛЬНЫЙ контент */}
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
                type='text'
                name='login'
                placeholder='Почта'
            />
            <input
                className={classNames(styles.modal__input)}
                type='password'
                name='password'
                placeholder='Пароль'
            />

            <div className={styles.errorContainer}></div>

            <button className={styles.modal__btnEnter}>Войти</button>

            <Link href='/auth/signup' className={styles.modal__btnSignup}>
                Зарегистрироваться
            </Link>
        </>
    );
}
