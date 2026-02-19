import React from 'react'

interface SkeletonProps {
    className?: string
    count?: number
}

const LoadingSkeleton: React.FC<SkeletonProps> = ({ className = '', count = 1 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`
            animate-pulse bg-white/10 dark:bg-white/5 rounded-xl
            ${className}
          `}
                />
            ))}
        </>
    )
}

export const CardSkeleton: React.FC = () => (
    <div className="glass-card p-6 space-y-4">
        <LoadingSkeleton className="h-4 w-3/4" />
        <LoadingSkeleton className="h-3 w-1/2" />
        <LoadingSkeleton className="h-3 w-2/3" />
    </div>
)

export const DashboardSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card p-6 space-y-3">
                <LoadingSkeleton className="h-4 w-1/3" />
                <LoadingSkeleton className="h-8 w-1/2" />
                <LoadingSkeleton className="h-3 w-2/3" />
            </div>
        ))}
    </div>
)

export const ProfileSkeleton: React.FC = () => (
    <div className="glass-card p-8 space-y-6">
        <div className="flex items-center gap-4">
            <LoadingSkeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2 flex-1">
                <LoadingSkeleton className="h-6 w-1/3" />
                <LoadingSkeleton className="h-4 w-1/4" />
            </div>
        </div>
        <LoadingSkeleton className="h-3 w-full" count={3} />
    </div>
)

export default LoadingSkeleton
