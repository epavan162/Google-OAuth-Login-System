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
} from 'react-icons/hi'

interface PublicProfileData {
    is_public: boolean
    name?: string
    username: string
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

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Banner + Avatar */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
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
                                        image={profile.image}
                                        name={profile.name}
                                        size="w-24 h-24 sm:w-28 sm:h-28"
                                        className="ring-4 ring-gray-900 shadow-xl"
                                    />
                                </motion.div>
                                <div className="text-center sm:text-left">
                                    <h1 className={`text-2xl font-bold ${textColor}`}>{profile.name}</h1>
                                    <p className={subTextColor}>@{profile.username}</p>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Bio */}
                {profile.bio && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-6"
                    >
                        <GlassCard className="p-6">
                            <h2 className={`${textColor} font-semibold mb-2`}>About</h2>
                            <p className={`${subTextColor} leading-relaxed`}>{profile.bio}</p>
                        </GlassCard>
                    </motion.div>
                )}

                {/* Location */}
                {profile.location && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6"
                    >
                        <GlassCard className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                    <HiOutlineLocationMarker className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className={`text-xs ${labelColor} uppercase tracking-wider`}>Location</p>
                                    <p className={`${textColor} text-sm`}>{profile.location}</p>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default PublicProfile
