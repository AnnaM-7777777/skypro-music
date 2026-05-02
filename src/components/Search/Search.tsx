'use client';

import { useState } from 'react';
import styles from './Search.module.css';

interface SearchProps {
    onSearch?: (query: string) => void;
}

export default function Search({ onSearch }: SearchProps) {
    const [value, setValue] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setValue(query);
        if (onSearch) onSearch(query);
    };

    return (
        <div className={styles.search}>
            <svg className={styles.search__svg}>
                <use xlinkHref='/img/icon/sprite.svg#icon-search'></use>
            </svg>

            <input
                className={styles.search__text}
                type='search'
                placeholder='Поиск'
                name='search'
                value={value}
                onChange={handleChange}
            />
        </div>
    );
}
