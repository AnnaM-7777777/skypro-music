'use client';

import IconLikeOutline from './IconLikeOutline';
import IconLikeFilled from './IconLikeFilled';

interface IconLikeProps {
    className?: string;
    isFilled?: boolean;
    isHovered?: boolean;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export default function IconLike({
    className,
    isFilled = false,
    isHovered = false,
    onClick,
    onMouseEnter,
    onMouseLeave,
}: IconLikeProps) {
    return isFilled ? (
        <IconLikeFilled
            className={className}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        />
    ) : (
        <IconLikeOutline
            className={className}
            isHovered={isHovered}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        />
    );
}
