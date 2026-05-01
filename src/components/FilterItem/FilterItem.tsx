'use client';

import { useRef } from 'react';
import styles from './FilterItem.module.css';
import { FilterType } from '@/utils/filter';

interface FilterItemProps {
    titleFilter: string;
    list: string[];
    nameFilter: FilterType;
    activeFilter: FilterType;
    onChangeActiveFilter: (name: FilterType) => void;
    onSelect: (value: string) => void;
    // Два варианта: массив для мультивыбора или одно значение для сортировки
    selectedValues?: string[];
    selectedValue?: string;
}

export default function FilterItem({
    titleFilter,
    list,
    nameFilter,
    activeFilter,
    onChangeActiveFilter,
    onSelect,
    selectedValues,
    selectedValue,
}: FilterItemProps) {
    const itemRef = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        onChangeActiveFilter(activeFilter === nameFilter ? null : nameFilter);
    };

    const handleItemClick = (value: string) => {
        onSelect(value);
    };

    const isActiveMenu = activeFilter === nameFilter;

    // Кнопка активна, если меню открыто ИЛИ если что-то выбрано
    const isButtonActive =
        isActiveMenu ||
        (selectedValues && selectedValues.length > 0) ||
        (selectedValue && selectedValue !== 'По умолчанию');

    return (
        <div className={styles.filter__item} ref={itemRef}>
            <button
                className={`btn-filter ${styles.filter__button} ${isButtonActive ? 'active' : ''}`}
                onClick={handleClick}
            >
                {titleFilter}
            </button>

            {/* Бейдж ВНЕ кнопки, абсолютно позиционирован (виден всегда без !isActiveMenu) */}
            {selectedValues && selectedValues.length > 0 && (
                <span key={selectedValues.length} className={styles.filter__badge}>
                    {selectedValues.length}
                </span>
            )}

            {isActiveMenu && list.length > 0 && (
                <div className={styles.filter__dropdown}>
                    <ul className={styles.dropdown__list}>
                        {list.map(item => {
                            const isSelectedItem = selectedValues
                                ? selectedValues.includes(item)
                                : selectedValue === item;

                            return (
                                <li
                                    key={item}
                                    className={`${styles.dropdown__item} ${isSelectedItem ? styles.selected : ''}`}
                                    onClick={() => handleItemClick(item)}
                                >
                                    {item}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
