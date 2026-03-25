'use client';

import { useEffect, useRef } from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
    max: number;
    value: number;
    step?: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProgressBar({ max, value, step = 0.01, onChange }: ProgressBarProps) {
    const progressRef = useRef<HTMLInputElement>(null);

    // Вычисляем процент заполнения
    const percent = max > 0 ? (value / max) * 100 : 0;

    // Обновляем CSS-переменную при изменении значения
    useEffect(() => {
        if (progressRef.current) {
            progressRef.current.style.setProperty('--progress-percent', `${percent}%`);
        }
    }, [percent]);

    return (
        <div className={styles.progress__wrapper}>
            <input
                ref={progressRef}
                className={styles.progress__line}
                type='range'
                min={0}
                max={max || 100}
                step={step}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}
