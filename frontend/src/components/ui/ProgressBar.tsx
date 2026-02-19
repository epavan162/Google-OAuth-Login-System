import React from 'react'
import { motion } from 'framer-motion'

interface ProgressBarProps {
    value: number
    label?: string
    showPercentage?: boolean
    className?: string
    theme?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    label,
    showPercentage = true,
    className = '',
    theme = 'dark',
}) => {
    const clampedValue = Math.min(100, Math.max(0, value))
    const labelColor = theme === 'light' ? 'text-gray-600' : 'text-gray-300'

    return (
        <div className={className}>
            {(label || showPercentage) && (
                <div className="flex justify-between items-center mb-2">
                    {label && <span className={`text-sm ${labelColor}`}>{label}</span>}
                    {showPercentage && (
                        <span className="text-sm font-semibold text-primary-400">{clampedValue}%</span>
                    )}
                </div>
            )}
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${clampedValue}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                />
            </div>
        </div>
    )
}

export default ProgressBar
