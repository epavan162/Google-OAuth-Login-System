import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface GlassCardProps {
    children: ReactNode
    className?: string
    hover?: boolean
    onClick?: () => void
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hover = false, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
            onClick={onClick}
            className={`
        bg-white/10 dark:bg-gray-900/40
        backdrop-blur-xl
        border border-white/20 dark:border-white/10
        rounded-2xl shadow-xl
        transition-colors duration-300
        ${hover ? 'cursor-pointer hover:shadow-2xl hover:border-primary-400/30' : ''}
        ${className}
      `}
        >
            {children}
        </motion.div>
    )
}

export default GlassCard
