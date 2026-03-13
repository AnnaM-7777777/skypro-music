'use client';

import IconLikeOutline from './IconLikeOutline';
import IconLikeFilled from './IconLikeFilled';

interface IconLikeProps {
    className?: string;
    isFilled?: boolean;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export default function IconLike({
    className,
    isFilled = false,
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
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        />
    );
}
