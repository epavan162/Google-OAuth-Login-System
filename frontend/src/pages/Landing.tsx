import React from 'react'
import { motion } from 'framer-motion'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { getGoogleLoginUrl } from '../services/api'
import GlassCard from '../components/ui/GlassCard'
import { FcGoogle } from 'react-icons/fc'
import { HiOutlineShieldCheck, HiOutlineLightningBolt, HiOutlineGlobe } from 'react-icons/hi'

const Landing: React.FC = () => {
    const { user, loading } = useAuth()
    const { theme } = useTheme()

    if (!loading && user) {
        return <Navigate to="/dashboard" replace />
    }

    const textColor = theme === 'light' ? 'text-gray-900' : 'text-white'
    const subTextColor = theme === 'light' ? 'text-gray-600' : 'text-gray-400'

    const handleGoogleLogin = () => {
        window.location.href = getGoogleLoginUrl()
    }

    const features = [
        {
            icon: <HiOutlineShieldCheck className="w-8 h-8 text-green-400" />,
            title: 'Secure Authentication',
            desc: 'Enterprise-grade security with Google OAuth 2.0',
        },
        {
            icon: <HiOutlineLightningBolt className="w-8 h-8 text-yellow-400" />,
            title: 'Lightning Fast',
            desc: 'Built with Go backend for blazing performance',
        },
        {
            icon: <HiOutlineGlobe className="w-8 h-8 text-blue-400" />,
            title: 'Public Profiles',
            desc: 'Share your profile with a personalized URL',
        },
    ]

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="max-w-5xl w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left - Hero */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="text-center lg:text-left"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-sm text-primary-400">Secure • Fast • Modern</span>
                        </motion.div>

                        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold ${textColor} leading-tight mb-6`}>
                            Welcome to{' '}
                            <span className="gradient-text">OAuth</span>
                            <br />
                            Login System
                        </h1>

                        <p className={`text-lg ${subTextColor} mb-8 max-w-xl mx-auto lg:mx-0`}>
                            A premium authentication experience built with modern technologies.
                            Sign in securely with your Google account.
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleGoogleLogin}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white
                         text-gray-800 font-semibold rounded-2xl shadow-2xl shadow-black/10
                         hover:shadow-black/20 transition-all duration-300 group"
                        >
                            <FcGoogle className="w-6 h-6" />
                            <span>Sign in with Google</span>
                            <motion.span
                                animate={{ x: [0, 4, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                →
                            </motion.span>
                        </motion.button>
                    </motion.div>

                    {/* Right - Features */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="space-y-4"
                    >
                        {features.map((feature, i) => (
                            <GlassCard key={i} hover className="p-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + i * 0.2 }}
                                    className="flex items-start gap-4"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className={`${textColor} font-semibold mb-1`}>{feature.title}</h3>
                                        <p className={`${subTextColor} text-sm`}>{feature.desc}</p>
                                    </div>
                                </motion.div>
                            </GlassCard>
                        ))}

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 mt-6">
                            {[
                                { label: 'Secure', val: '100%' },
                                { label: 'Uptime', val: '99.9%' },
                                { label: 'Speed', val: '<50ms' },
                            ].map((stat, i) => (
                                <GlassCard key={i} className="p-4 text-center">
                                    <p className="text-2xl font-bold gradient-text">{stat.val}</p>
                                    <p className={`text-xs ${subTextColor} mt-1`}>{stat.label}</p>
                                </GlassCard>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Landing
