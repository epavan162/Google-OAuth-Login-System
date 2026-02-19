import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import GlassCard from '../components/ui/GlassCard'
import AnimatedButton from '../components/ui/AnimatedButton'
import Avatar from '../components/ui/Avatar'
import {
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineLocationMarker,
    HiOutlinePencil,
    HiOutlineGlobe,
    HiOutlineLink,
} from 'react-icons/hi'

const Profile: React.FC = () => {
    const { user } = useAuth()
    const { theme } = useTheme()

    if (!user) return null

    const textColor = theme === 'light' ? 'text-gray-900' : 'text-white'
    const subTextColor = theme === 'light' ? 'text-gray-600' : 'text-gray-400'
    const labelColor = theme === 'light' ? 'text-gray-500' : 'text-gray-500'

    const infoItems = [
        { icon: <HiOutlineMail className="w-5 h-5" />, label: 'Email', value: user.email },
        { icon: <HiOutlinePhone className="w-5 h-5" />, label: 'Phone', value: user.phone || 'Not set' },
        { icon: <HiOutlineLocationMarker className="w-5 h-5" />, label: 'Location', value: user.location || 'Not set' },
        { icon: <HiOutlineGlobe className="w-5 h-5" />, label: 'Username', value: `@${user.username}` },
    ]

    const publicUrl = `${window.location.origin}/u/${user.username}`

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Banner */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <GlassCard className="overflow-hidden">
                        <div className="h-32 sm:h-48 bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600" />
                        <div className="px-6 pb-6 -mt-12 sm:-mt-16">
                            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200 }}
                                >
                                    <Avatar
                                        image={user.image}
                                        name={user.name}
                                        size="w-24 h-24 sm:w-28 sm:h-28"
                                        className="ring-4 ring-gray-900 shadow-xl"
                                    />
                                </motion.div>
                                <div className="text-center sm:text-left flex-1">
                                    <h1 className={`text-2xl font-bold ${textColor}`}>{user.name}</h1>
                                    <p className={subTextColor}>@{user.username}</p>
                                </div>
                                <Link to="/profile/edit">
                                    <AnimatedButton variant="glass" className="text-sm">
                                        <HiOutlinePencil className="w-4 h-4 inline mr-2" />
                                        Edit Profile
                                    </AnimatedButton>
                                </Link>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Public Profile URL — only when public */}
                {user.is_public && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-6"
                    >
                        <GlassCard className="p-5">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                        <HiOutlineLink className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className={`text-xs ${labelColor} uppercase tracking-wider`}>Your Public Profile</p>
                                        <a
                                            href={publicUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary-400 hover:text-primary-300 text-sm truncate block transition-colors"
                                        >
                                            {publicUrl}
                                        </a>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigator.clipboard.writeText(publicUrl)}
                                    className="px-4 py-2 text-xs rounded-xl bg-primary-500/10 text-primary-400 border border-primary-500/20 hover:bg-primary-500/20 transition-all flex-shrink-0"
                                >
                                    Copy Link
                                </motion.button>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}

                {/* Bio */}
                {user.bio && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="mb-6"
                    >
                        <GlassCard className="p-6">
                            <h2 className={`${textColor} font-semibold mb-2`}>About</h2>
                            <p className={`${subTextColor} leading-relaxed`}>{user.bio}</p>
                        </GlassCard>
                    </motion.div>
                )}

                {/* Info Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <GlassCard className="p-6">
                        <h2 className={`${textColor} font-semibold mb-4`}>Information</h2>
                        <div className="space-y-4">
                            {infoItems.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-primary-400">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs ${labelColor} uppercase tracking-wider`}>{item.label}</p>
                                        <p className={`${textColor} text-sm truncate`}>{item.value}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Visibility Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-center"
                >
                    <span className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm
            ${user.is_public
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }
          `}>
                        <span className={`w-2 h-2 rounded-full ${user.is_public ? 'bg-green-400' : 'bg-red-400'}`} />
                        {user.is_public ? 'Public Profile' : 'Private Profile'}
                    </span>
                </motion.div>
            </div>
        </div>
    )
}

export default Profile
