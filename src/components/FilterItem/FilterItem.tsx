'use client';

import { useState, useRef } from 'react';
import styles from './FilterItem.module.css';
import { FilterType } from '@/utils/filter';

interface FilterItemProps {
    titleFilter: string;
    list: string[];
    nameFilter: FilterType;
    activeFilter: FilterType;
    onChangeActiveFilter: (name: FilterType) => void;
}

export default function FilterItem({
    titleFilter,
    list,
    nameFilter,
    activeFilter,
    onChangeActiveFilter,
}: FilterItemProps) {
    const itemRef = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        onChangeActiveFilter(activeFilter === nameFilter ? null : nameFilter);
    };

    const handleSelect = (value: string) => {
        console.log(`Выбрано: ${value}`);
        onChangeActiveFilter(null);
    };

    const isActive = activeFilter === nameFilter;

    return (
        <div className={styles.filter__item} ref={itemRef}>
            <button
                className={`${styles.filter__button} ${isActive ? styles.active : ''}`}
                onClick={handleClick}
            >
                {titleFilter}
            </button>

            {isActive && list.length > 0 && (
                <div className={styles.filter__dropdown}>
                    <ul className={styles.dropdown__list}>
                        {list.map(item => (
                            <li
                                key={item}
                                className={styles.dropdown__item}
                                onClick={() => handleSelect(item)}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
