'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
    max: number;
    value: number;
    step?: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProgressBar({ max, value, step = 0.01, onChange }: ProgressBarProps) {
    const progressRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Локальное значение для плавного отображения во время драга
    const localValue = useRef(value);

    // Вычисляем процент заполнения
    const percent = max > 0 ? (value / max) * 100 : 0;

    // Обновляем CSS-переменную (только если не тащим — иначе берём локальное)
    useEffect(() => {
        if (progressRef.current && !isDragging) {
            localValue.current = value;
            const localPercent = max > 0 ? (localValue.current / max) * 100 : 0;
            progressRef.current.style.setProperty('--progress-percent', `${localPercent}%`);
        }
    }, [value, max, isDragging]);

    // Обработчик начала драга
    const handleDragStart = () => setIsDragging(true);

    // Обработчик конца драга — синхронизируем с родителем
    const handleDragEnd = () => {
        setIsDragging(false);
        // Форсируем обновление градиента после окончания драга
        if (progressRef.current && max > 0) {
            const finalPercent = (value / max) * 100;
            progressRef.current.style.setProperty('--progress-percent', `${finalPercent}%`);
        }
    };

    // Обработчик ввода — плавное обновление локального значения
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        localValue.current = parseFloat(e.target.value);
        if (progressRef.current && max > 0) {
            const localPercent = (localValue.current / max) * 100;
            progressRef.current.style.setProperty('--progress-percent', `${localPercent}%`);
        }
        // Вызываем родительский onChange для обновления стейта (но без визуальных скачков)
        onChange(e);
    };

    return (
        <div className={styles.progress__wrapper}>
            <input
                ref={progressRef}
                className={styles.progress__line}
                type='range'
                min={0}
                max={max || 100}
                step={step}
                value={isDragging ? localValue.current : value}
                onChange={handleInput}
                onMouseDown={handleDragStart}
                onMouseUp={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchEnd={handleDragEnd}
                draggable={false}
            />
        </div>
    );
}
