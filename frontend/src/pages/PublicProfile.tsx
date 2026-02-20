import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getPublicProfile } from '../services/api'
import { useTheme } from '../context/ThemeContext'
import GlassCard from '../components/ui/GlassCard'
import Avatar from '../components/ui/Avatar'
import { ProfileSkeleton } from '../components/ui/LoadingSkeleton'
import {
    HiOutlineLocationMarker,
    HiOutlineLockClosed,
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineGlobe,
} from 'react-icons/hi'

interface PublicProfileData {
    is_public: boolean
    name?: string
    username: string
    email?: string
    phone?: string
    bio?: string
    location?: string
    image?: string
}

const PublicProfile: React.FC = () => {
    const { username } = useParams<{ username: string }>()
    const { theme } = useTheme()
    const [profile, setProfile] = useState<PublicProfileData | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    const textColor = theme === 'light' ? 'text-gray-900' : 'text-white'
    const subTextColor = theme === 'light' ? 'text-gray-600' : 'text-gray-400'
    const labelColor = theme === 'light' ? 'text-gray-500' : 'text-gray-500'

    useEffect(() => {
        if (username) fetchProfile()
    }, [username])

    const fetchProfile = async () => {
        try {
            const res = await getPublicProfile(username!)
            setProfile(res.data)
        } catch {
            setNotFound(true)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-24 px-4">
                <div className="max-w-3xl mx-auto">
                    <ProfileSkeleton />
                </div>
            </div>
        )
    }

    if (notFound) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <GlassCard className="p-12 text-center max-w-md">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-6xl mb-4"
                    >
                        🔍
                    </motion.div>
                    <h2 className={`text-2xl font-bold ${textColor} mb-2`}>User Not Found</h2>
                    <p className={subTextColor}>This profile doesn't exist or has been removed.</p>
                </GlassCard>
            </div>
        )
    }

    if (profile && !profile.is_public) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <GlassCard className="p-12 text-center max-w-md">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                        className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center"
                    >
                        <HiOutlineLockClosed className="w-10 h-10 text-red-400" />
                    </motion.div>
                    <h2 className={`text-2xl font-bold ${textColor} mb-2`}>Profile is Private</h2>
                    <p className={subTextColor}>
                        <span className="text-primary-400">@{profile.username}</span> has set their profile to private.
                    </p>
                </GlassCard>
            </div>
        )
    }

    if (!profile) return null

    const infoItems = [
        { icon: <HiOutlineMail className="w-5 h-5" />, label: 'Email', value: profile.email },
        { icon: <HiOutlinePhone className="w-5 h-5" />, label: 'Phone', value: profile.phone },
        { icon: <HiOutlineLocationMarker className="w-5 h-5" />, label: 'Location', value: profile.location },
    ].filter(item => item.value) // Only show items that have values

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <GlassCard className="p-8 sm:p-10 relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-500/10 to-transparent pointer-events-none" />

                        <div className="relative flex flex-col items-center text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className="mb-6"
                            >
                                <Avatar
                                    image={profile.image}
                                    name={profile.name}
                                    size="w-32 h-32 sm:w-40 sm:h-40"
                                    className="ring-8 ring-white/10 shadow-2xl"
                                />
                            </motion.div>

                            <h1 className={`text-3xl sm:text-4xl font-bold ${textColor} mb-2`}>{profile.name}</h1>
                            <p className={`text-lg ${subTextColor} mb-6`}>@{profile.username}</p>

                            {/* Bio */}
                            {profile.bio && (
                                <p className={`max-w-lg mx-auto ${textColor} leading-relaxed text-lg mb-8`}>
                                    "{profile.bio}"
                                </p>
                            )}

                            {/* Info Grid */}
                            {infoItems.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-auto-fit gap-4 w-full max-w-2xl mt-4">
                                    {infoItems.map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + i * 0.1 }}
                                            className={`flex items-center gap-4 p-4 rounded-2xl ${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'} border ${theme === 'light' ? 'border-gray-100' : 'border-white/10'}`}
                                        >
                                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                                                {item.icon}
                                            </div>
                                            <div className="text-left min-w-0">
                                                <p className={`text-xs ${labelColor} uppercase tracking-wider font-semibold mb-0.5`}>{item.label}</p>
                                                <p className={`${textColor} font-medium truncate`}>{item.value}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    )
}

export default PublicProfile
