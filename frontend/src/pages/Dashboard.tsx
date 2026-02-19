import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { getUserStats } from '../services/api'
import GlassCard from '../components/ui/GlassCard'
import ProgressBar from '../components/ui/ProgressBar'
import ActivityTimeline from '../components/ui/ActivityTimeline'
import Avatar from '../components/ui/Avatar'
import { DashboardSkeleton } from '../components/ui/LoadingSkeleton'
import {
    HiOutlineLogin,
    HiOutlineCalendar,
    HiOutlineEye,
    HiOutlineClock,
} from 'react-icons/hi'

interface Stats {
    user: any
    profile_views: number
    recent_activity: any[]
    profile_completion: number
}

const Dashboard: React.FC = () => {
    const { user } = useAuth()
    const { theme } = useTheme()
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

    const textColor = theme === 'light' ? 'text-gray-900' : 'text-white'
    const subTextColor = theme === 'light' ? 'text-gray-600' : 'text-gray-400'

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const res = await getUserStats()
            setStats(res.data)
        } catch {
            // fallback
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <DashboardSkeleton />
                </div>
            </div>
        )
    }

    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
    })

    const formatRelative = (d: string) => {
        const diff = Date.now() - new Date(d).getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 60) return `${mins}m ago`
        const hrs = Math.floor(diff / 3600000)
        if (hrs < 24) return `${hrs}h ago`
        return `${Math.floor(diff / 86400000)}d ago`
    }

    const statCards = [
        {
            icon: <HiOutlineLogin className="w-6 h-6 text-green-400" />,
            label: 'Total Logins',
            value: stats?.user?.login_count || user?.login_count || 0,
            color: 'from-green-500/20 to-emerald-500/20',
        },
        {
            icon: <HiOutlineCalendar className="w-6 h-6 text-blue-400" />,
            label: 'Member Since',
            value: formatDate(user?.created_at || ''),
            color: 'from-blue-500/20 to-cyan-500/20',
        },
        {
            icon: <HiOutlineClock className="w-6 h-6 text-purple-400" />,
            label: 'Last Login',
            value: formatRelative(stats?.user?.last_login_at || user?.last_login_at || ''),
            color: 'from-purple-500/20 to-pink-500/20',
        },
        {
            icon: <HiOutlineEye className="w-6 h-6 text-yellow-400" />,
            label: 'Profile Views',
            value: stats?.profile_views || 0,
            color: 'from-yellow-500/20 to-orange-500/20',
        },
    ]

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Welcome Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <GlassCard className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                            >
                                <Avatar image={user?.image} name={user?.name} size="w-16 h-16 sm:w-20 sm:h-20" className="ring-4 ring-primary-500/30 shadow-lg" />
                            </motion.div>
                            <div className="text-center sm:text-left">
                                <h1 className={`text-2xl sm:text-3xl font-bold ${textColor} mb-1`}>
                                    Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
                                </h1>
                                <p className={subTextColor}>{user?.email}</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <ProgressBar
                                value={stats?.profile_completion || 0}
                                label="Profile Completion"
                                theme={theme}
                            />
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Stat Cards */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
                >
                    {statCards.map((card, i) => (
                        <motion.div key={i} variants={item}>
                            <GlassCard hover className="p-5 sm:p-6">
                                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${card.color} mb-3`}>
                                    {card.icon}
                                </div>
                                <p className={`${subTextColor} text-sm mb-1`}>{card.label}</p>
                                <p className={`text-xl sm:text-2xl font-bold ${textColor}`}>{card.value}</p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Activity Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <GlassCard className="p-6">
                        <h2 className={`text-lg font-semibold ${textColor} mb-4 flex items-center gap-2`}>
                            <span className="w-2 h-2 rounded-full bg-primary-400" />
                            Recent Activity
                        </h2>
                        <ActivityTimeline activities={stats?.recent_activity || []} theme={theme} />
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    )
}

export default Dashboard
