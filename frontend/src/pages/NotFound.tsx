import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import GlassCard from '../components/ui/GlassCard'

const NotFound: React.FC = () => {
    const { theme } = useTheme()
    const textColor = theme === 'light' ? 'text-gray-900' : 'text-white'
    const subTextColor = theme === 'light' ? 'text-gray-600' : 'text-gray-400'

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <GlassCard className="p-12 text-center max-w-md">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="text-8xl mb-6"
                >
                    🚀
                </motion.div>
                <h1 className="text-4xl font-bold gradient-text mb-3">404</h1>
                <p className={`${subTextColor} mb-6`}>
                    This page has drifted off into space.
                </p>
                <Link
                    to="/"
                    className="inline-flex btn-primary"
                >
                    Go Home
                </Link>
            </GlassCard>
        </div>
    )
}

export default NotFound
