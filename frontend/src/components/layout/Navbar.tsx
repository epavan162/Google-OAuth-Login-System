import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import Avatar from '../ui/Avatar'
import { HiOutlineSun, HiOutlineMoon, HiOutlineMenu, HiOutlineX } from 'react-icons/hi'

const Navbar: React.FC = () => {
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const [mobileOpen, setMobileOpen] = useState(false)
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/')
        setMobileOpen(false)
    }

    const textColor = theme === 'light' ? 'text-gray-800' : 'text-white'
    const subTextColor = theme === 'light' ? 'text-gray-600' : 'text-gray-300'

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
        >
            <div className="max-w-7xl mx-auto">
                <div className="glass-card px-6 py-3 flex items-center justify-between">
                    {/* Logo */}
                    <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">G</span>
                        </div>
                        <span className={`font-bold text-lg hidden sm:inline ${textColor}`}>
                            OAuth<span className="text-primary-400">App</span>
                        </span>
                    </Link>

                    {/* Desktop Nav — only Dashboard and Profile */}
                    {user && (
                        <div className="hidden md:flex items-center gap-1">
                            <NavLink to="/dashboard" theme={theme}>Dashboard</NavLink>
                            <NavLink to="/profile" theme={theme}>Profile</NavLink>
                        </div>
                    )}

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            {theme === 'dark' ? (
                                <HiOutlineSun className="w-5 h-5 text-yellow-400" />
                            ) : (
                                <HiOutlineMoon className="w-5 h-5 text-primary-600" />
                            )}
                        </motion.button>

                        {/* User Avatar */}
                        {user && (
                            <div className="hidden md:flex items-center gap-3">
                                <Avatar image={user.image} name={user.name} size="w-8 h-8" className="ring-2 ring-primary-400/50" />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLogout}
                                    className={`px-4 py-1.5 text-sm rounded-xl bg-white/10 hover:bg-red-500/20 ${subTextColor} hover:text-red-400 transition-all`}
                                >
                                    Logout
                                </motion.button>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        {user && (
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                {mobileOpen ? (
                                    <HiOutlineX className={`w-5 h-5 ${textColor}`} />
                                ) : (
                                    <HiOutlineMenu className={`w-5 h-5 ${textColor}`} />
                                )}
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileOpen && user && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden mt-2 glass-card overflow-hidden"
                        >
                            <div className="p-4 space-y-2">
                                <div className="flex items-center gap-3 p-2 mb-3">
                                    <Avatar image={user.image} name={user.name} size="w-10 h-10" className="ring-2 ring-primary-400/50" />
                                    <div>
                                        <p className={`font-medium text-sm ${textColor}`}>{user.name}</p>
                                        <p className={`text-xs ${subTextColor}`}>{user.email}</p>
                                    </div>
                                </div>
                                <MobileLink to="/dashboard" onClick={() => setMobileOpen(false)} theme={theme}>Dashboard</MobileLink>
                                <MobileLink to="/profile" onClick={() => setMobileOpen(false)} theme={theme}>Profile</MobileLink>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm"
                                >
                                    Logout
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    )
}

const NavLink: React.FC<{ to: string; children: React.ReactNode; theme: string }> = ({ to, children, theme }) => (
    <Link
        to={to}
        className={`px-4 py-2 text-sm rounded-xl hover:bg-white/10 transition-all ${theme === 'light' ? 'text-gray-700 hover:text-gray-900' : 'text-gray-300 hover:text-white'
            }`}
    >
        {children}
    </Link>
)

const MobileLink: React.FC<{ to: string; onClick: () => void; children: React.ReactNode; theme: string }> = ({
    to, onClick, children, theme,
}) => (
    <Link
        to={to}
        onClick={onClick}
        className={`block p-3 rounded-xl hover:bg-white/10 transition-all text-sm ${theme === 'light' ? 'text-gray-700 hover:text-gray-900' : 'text-gray-300 hover:text-white'
            }`}
    >
        {children}
    </Link>
)

export default Navbar
