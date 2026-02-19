import React from 'react'

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=6366f1&color=fff&bold=true&size=200&name='

export const getAvatarUrl = (image?: string, name?: string): string => {
    if (image && image.trim() !== '') return image
    return `${DEFAULT_AVATAR}${encodeURIComponent(name || 'User')}`
}

interface AvatarProps {
    image?: string
    name?: string
    size?: string
    className?: string
}

const Avatar: React.FC<AvatarProps> = ({
    image,
    name = 'User',
    size = 'w-10 h-10',
    className = '',
}) => {
    const src = getAvatarUrl(image, name)

    return (
        <img
            src={src}
            alt={name}
            className={`${size} rounded-2xl object-cover ${className}`}
            onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = `${DEFAULT_AVATAR}${encodeURIComponent(name)}`
            }}
        />
    )
}

export default Avatar
