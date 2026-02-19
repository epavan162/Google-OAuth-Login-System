import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface AnimatedButtonProps {
    children: ReactNode
    onClick?: () => void
    variant?: 'primary' | 'glass' | 'danger'
    className?: string
    disabled?: boolean
    type?: 'button' | 'submit'
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    className = '',
    disabled = false,
    type = 'button',
}) => {
    const variants = {
        primary: `bg-gradient-to-r from-primary-500 to-accent-500 text-white
              shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40`,
        glass: `bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20
            text-white hover:bg-white/20`,
        danger: `bg-gradient-to-r from-red-500 to-pink-500 text-white
             shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40`,
    }

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            className={`
        px-6 py-3 font-semibold rounded-2xl
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
        >
            {children}
        </motion.button>
    )
}

export default AnimatedButton
