import React from 'react'
import { motion } from 'framer-motion'
import { HiOutlineLogin, HiOutlineUser, HiOutlinePencil, HiOutlineEye, HiOutlineShieldCheck } from 'react-icons/hi'

interface Activity {
    id: string
    action: string
    created_at: string
}

interface ActivityTimelineProps {
    activities: Activity[]
    theme?: string
}

const getIcon = (action: string) => {
    if (action.toLowerCase().includes('logged') || action.toLowerCase().includes('restored')) return <HiOutlineLogin className="text-green-400" />
    if (action.toLowerCase().includes('created')) return <HiOutlineUser className="text-blue-400" />
    if (action.toLowerCase().includes('username') || action.toLowerCase().includes('updated')) return <HiOutlinePencil className="text-yellow-400" />
    if (action.toLowerCase().includes('public') || action.toLowerCase().includes('private')) return <HiOutlineShieldCheck className="text-purple-400" />
    if (action.toLowerCase().includes('view')) return <HiOutlineEye className="text-cyan-400" />
    return <HiOutlineUser className="text-gray-400" />
}

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    const diffHrs = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMin < 1) return 'Just now'
    if (diffMin < 60) return `${diffMin}m ago`
    if (diffHrs < 24) return `${diffHrs}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities, theme = 'dark' }) => {
    const textColor = theme === 'light' ? 'text-gray-800' : 'text-gray-200'
    const subTextColor = theme === 'light' ? 'text-gray-500' : 'text-gray-500'

    if (!activities || activities.length === 0) {
        return (
            <div className="text-center py-8">
                <p className={`text-sm ${subTextColor}`}>No activity yet</p>
            </div>
        )
    }

    return (
        <div className="space-y-1">
            {activities.map((activity, index) => (
                <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">
                        {getIcon(activity.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={`text-sm ${textColor} truncate`}>{activity.action}</p>
                    </div>
                    <span className={`text-xs ${subTextColor} flex-shrink-0`}>{formatDate(activity.created_at)}</span>
                </motion.div>
            ))}
        </div>
    )
}

export default ActivityTimeline
