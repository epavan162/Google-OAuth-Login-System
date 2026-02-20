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
    HiCheckCircle,
    HiExclamationCircle
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

    // Calculate completion
    const fields = [
        { name: 'Name', valid: !!user.name },
        { name: 'Bio', valid: !!user.bio },
        { name: 'Phone', valid: !!user.phone },
        { name: 'Location', valid: !!user.location },
    ]
    const completedCount = fields.filter(f => f.valid).length
    const totalFields = fields.length
    const completionPercentage = Math.round((completedCount / totalFields) * 100)
    const missingFields = fields.filter(f => !f.valid).map(f => f.name).join(', ')

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Main Identity */}
                <div className="lg:col-span-1 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <GlassCard className="p-8 flex flex-col items-center text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary-500/10 to-transparent pointer-events-none" />

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative mb-4"
                            >
                                <Avatar
                                    image={user.image}
                                    name={user.name}
                                    size="w-32 h-32"
                                    className="ring-4 ring-white/10 shadow-xl"
                                />
                                <Link to="/profile/edit" className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full shadow-lg hover:bg-primary-600 transition-colors">
                                    <HiOutlinePencil className="w-4 h-4" />
                                </Link>
                            </motion.div>

                            <h1 className={`text-xl font-bold ${textColor} mb-1`}>{user.name}</h1>
                            <p className={`${subTextColor} text-sm mb-4`}>@{user.username}</p>

                            <span className={`
                                inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                                ${user.is_public
                                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                    : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                }
                            `}>
                                <span className={`w-1.5 h-1.5 rounded-full ${user.is_public ? 'bg-green-500' : 'bg-red-500'}`} />
                                {user.is_public ? 'Public' : 'Private'}
                            </span>
                        </GlassCard>
                    </motion.div>

                    {/* Completion Card */}
                    {completionPercentage < 100 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <GlassCard className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className={`${textColor} font-semibold text-sm`}>Profile Completion</h3>
                                    <span className="text-primary-500 font-bold text-sm">{completionPercentage}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-200/20 rounded-full overflow-hidden mb-4">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${completionPercentage}%` }}
                                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
                                    />
                                </div>
                                <div className="flex items-start gap-2">
                                    <HiExclamationCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className={`${labelColor} text-xs mb-2`}>Add {missingFields} to complete your profile.</p>
                                        <Link to="/profile/edit">
                                            <span className="text-primary-500 text-xs font-medium hover:underline">Complete now &rarr;</span>
                                        </Link>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}
                </div>

                {/* Right Column: Details & Bio */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Public Link Card */}
                    {user.is_public && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <GlassCard className="p-5 flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-primary-500/5 to-transparent border-primary-500/10">
                                <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                                    <HiOutlineLink className="w-5 h-5 text-primary-500" />
                                </div>
                                <div className="flex-1 text-center sm:text-left min-w-0 w-full">
                                    <p className={`${labelColor} text-xs uppercase tracking-wider font-semibold mb-1`}>Your Public Profile Link</p>
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                        <p className={`${textColor} text-sm truncate flex-1`}>{publicUrl}</p>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(publicUrl)}
                                            className="text-primary-500 hover:text-primary-400 text-xs font-medium px-2"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <GlassCard className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className={`text-xl font-bold ${textColor}`}>About</h2>
                                <Link to="/profile/edit">
                                    <span className="text-primary-500 text-sm hover:underline">Edit</span>
                                </Link>
                            </div>

                            {user.bio ? (
                                <p className={`${subTextColor} leading-relaxed text-lg`}>{user.bio}</p>
                            ) : (
                                <div className="text-center py-8 px-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                    <p className={`${subTextColor} mb-2`}>You haven't added a bio yet.</p>
                                    <Link to="/profile/edit">
                                        <span className="text-primary-500 font-medium">Add a bio &rarr;</span>
                                    </Link>
                                </div>
                            )}
                        </GlassCard>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <GlassCard className="p-8">
                            <h2 className={`text-xl font-bold ${textColor} mb-6`}>Contact Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {infoItems.map((item, i) => (
                                    <div
                                        key={i}
                                        className={`p-4 rounded-xl ${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'} flex items-start gap-3`}
                                    >
                                        <div className="mt-1 text-primary-500">{item.icon}</div>
                                        <div className="min-w-0">
                                            <p className={`text-xs ${labelColor} uppercase font-semibold mb-1`}>{item.label}</p>
                                            <p className={`${textColor} font-medium truncate`}>{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Profile
