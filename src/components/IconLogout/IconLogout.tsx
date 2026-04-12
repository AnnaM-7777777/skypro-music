'use client';

import styles from './IconLogout.module.css';

interface IconLogoutProps {
    onClick?: () => void;
}

export default function IconLogout({ onClick }: IconLogoutProps) {
    return (
        <div
            className={styles.sidebar__icon}
            style={{ cursor: 'pointer' }}
            onClick={onClick}
            title='Выйти'
            role='button'
            tabIndex={0}
            onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick?.();
                }
            }}
        >
            <svg>
                <use xlinkHref='/img/icon/sprite.svg#logout'></use>
            </svg>
        </div>
    );
}
