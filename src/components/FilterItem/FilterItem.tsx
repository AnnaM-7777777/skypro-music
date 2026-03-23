'use client';

import styles from './FilterItem.module.css';

interface FilterItemProps {
    items: string[];
    onSelect?: (value: string) => void;
}

export default function FilterItem({ items, onSelect }: FilterItemProps) {
    return (
        <div className={styles.filter__dropdown}>
            <ul className={styles.dropdown__list}>
                {items.map(item => (
                    <li
                        key={item}
                        className={styles.dropdown__item}
                        onClick={() => onSelect?.(item)}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}
