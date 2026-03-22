'use client';

interface IconLikeOutlineProps {
    className?: string;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    isHovered?: boolean;
}

export default function IconLikeOutline({
    className,
    onClick,
    onMouseEnter,
    onMouseLeave,
    isHovered = false,
}: IconLikeOutlineProps) {
    // Цвета: фиолетовый при ховере, серый в обычном состоянии
    const strokeColor = isHovered ? 'rgba(182, 114, 255, 1)' : 'rgba(78, 78, 78, 1)';
    const fillColor = isHovered ? 'rgba(182, 114, 255, 1)' : 'none';

    return (
        <svg
            className={className}
            width='16'
            height='14'
            viewBox='0 0 16 14'
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth='1'
            strokeLinecap='round'
            strokeLinejoin='round'
            xmlns='http://www.w3.org/2000/svg'
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                cursor: 'pointer',
                transition: 'fill 0.2s ease, stroke 0.2s ease',
            }}
        >
            <path d='M8.34372 2.25572H8.36529C9.29718 1.44175 11.7563 0.165765 13.9565 1.76734C17.3111 4.20921 14.2458 9.5 8.36529 13H8.34372M8.34378 2.25572H8.32221C7.39032 1.44175 4.93121 0.165765 2.73102 1.76734C-0.623552 4.20921 2.44172 9.5 8.32221 13H8.34378' />
        </svg>
    );
}
