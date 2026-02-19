import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { updateUser, updateUsername, togglePublic, deleteAccount } from '../services/api'
import GlassCard from '../components/ui/GlassCard'
import FloatingInput from '../components/ui/FloatingInput'
import AnimatedButton from '../components/ui/AnimatedButton'
import toast from 'react-hot-toast'
import { HiOutlineTrash, HiOutlineEyeOff, HiOutlineEye } from 'react-icons/hi'

const ProfileEdit: React.FC = () => {
    const { user, checkAuth, logout } = useAuth()
    const { theme } = useTheme()
    const navigate = useNavigate()

    const textColor = theme === 'light' ? 'text-gray-900' : 'text-white'
    const subTextColor = theme === 'light' ? 'text-gray-600' : 'text-gray-400'

    const [form, setForm] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        phone: user?.phone || '',
        location: user?.location || '',
    })
    const [username, setUsername] = useState(user?.username || '')
    const [saving, setSaving] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleChange = (field: string) => (value: string) => {
        setForm(prev => ({ ...prev, [field]: value }))
        setErrors(prev => ({ ...prev, [field]: '' }))
    }

    const validate = () => {
        const errs: Record<string, string> = {}
        if (form.phone && !/^[\d\s\-+()]*$/.test(form.phone)) {
            errs.phone = 'Invalid phone number'
        }
        if (username.length < 3) {
            errs.username = 'Username must be at least 3 characters'
        }
        if (username.length > 50) {
            errs.username = 'Username must be less than 50 characters'
        }
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSave = async () => {
        if (!validate()) return
        setSaving(true)
        try {
            await updateUser(form)

            if (username !== user?.username) {
                await updateUsername(username)
            }

            await checkAuth()
            toast.success('Profile updated successfully!')
            navigate('/profile')
        } catch (err: any) {
            const msg = err.response?.data?.error || 'Failed to update profile'
            toast.error(msg)
        } finally {
            setSaving(false)
        }
    }

    const handleTogglePublic = async () => {
        try {
            await togglePublic()
            await checkAuth()
            toast.success(user?.is_public ? 'Profile set to private' : 'Profile set to public')
        } catch {
            toast.error('Failed to toggle visibility')
        }
    }

    const handleDelete = async () => {
        try {
            await deleteAccount()
            await logout()
            toast.success('Account permanently deleted')
            navigate('/')
        } catch {
            toast.error('Failed to delete account')
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <GlassCard className="p-6 sm:p-8">
                        <h1 className={`text-2xl font-bold ${textColor} mb-6`}>Edit Profile</h1>

                        <div className="space-y-5">
                            <FloatingInput
                                label="Display Name"
                                value={form.name}
                                onChange={handleChange('name')}
                                theme={theme}
                            />

                            <FloatingInput
                                label="Username"
                                value={username}
                                onChange={setUsername}
                                error={errors.username}
                                theme={theme}
                            />

                            <FloatingInput
                                label="Bio"
                                value={form.bio}
                                onChange={handleChange('bio')}
                                multiline
                                theme={theme}
                            />

                            <FloatingInput
                                label="Phone"
                                value={form.phone}
                                onChange={handleChange('phone')}
                                type="tel"
                                error={errors.phone}
                                theme={theme}
                            />

                            <FloatingInput
                                label="Location"
                                value={form.location}
                                onChange={handleChange('location')}
                                theme={theme}
                            />

                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <AnimatedButton
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </AnimatedButton>
                                <AnimatedButton
                                    variant="glass"
                                    onClick={() => navigate('/profile')}
                                    className="flex-1"
                                >
                                    Cancel
                                </AnimatedButton>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Privacy Toggle */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6"
                >
                    <GlassCard className="p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                {user?.is_public ? (
                                    <HiOutlineEye className="w-5 h-5 text-green-400" />
                                ) : (
                                    <HiOutlineEyeOff className="w-5 h-5 text-red-400" />
                                )}
                                <div>
                                    <h3 className={`${textColor} font-medium`}>Profile Visibility</h3>
                                    <p className={`text-sm ${subTextColor}`}>
                                        {user?.is_public ? 'Your profile is visible to everyone' : 'Your profile is private'}
                                    </p>
                                </div>
                            </div>
                            <AnimatedButton
                                variant={user?.is_public ? 'glass' : 'primary'}
                                onClick={handleTogglePublic}
                                className="text-sm w-full sm:w-auto"
                            >
                                {user?.is_public ? 'Make Private' : 'Make Public'}
                            </AnimatedButton>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Danger Zone */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6"
                >
                    <GlassCard className="p-6 border-red-500/20">
                        <h3 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                            <HiOutlineTrash className="w-5 h-5" />
                            Danger Zone
                        </h3>
                        <p className={`text-sm ${subTextColor} mb-4`}>
                            Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        {!showDelete ? (
                            <AnimatedButton
                                variant="danger"
                                onClick={() => setShowDelete(true)}
                                className="text-sm"
                            >
                                Delete Account
                            </AnimatedButton>
                        ) : (
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <AnimatedButton
                                    variant="danger"
                                    onClick={handleDelete}
                                    className="text-sm w-full sm:w-auto"
                                >
                                    Yes, Delete Forever
                                </AnimatedButton>
                                <AnimatedButton
                                    variant="glass"
                                    onClick={() => setShowDelete(false)}
                                    className="text-sm w-full sm:w-auto"
                                >
                                    Cancel
                                </AnimatedButton>
                            </div>
                        )}
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    )
}

export default ProfileEdit
