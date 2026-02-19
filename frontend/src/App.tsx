import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import AnimatedBackground from './components/layout/AnimatedBackground'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import ProfileEdit from './pages/ProfileEdit'
import PublicProfile from './pages/PublicProfile'
import NotFound from './pages/NotFound'

const pageTransition = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.3, ease: 'easeInOut' },
}

const App: React.FC = () => {
    const location = useLocation()

    return (
        <div className="relative min-h-screen text-white light:text-gray-900">
            <AnimatedBackground />
            <Navbar />
            <AnimatePresence mode="wait">
                <motion.div key={location.pathname} {...pageTransition}>
                    <Routes location={location}>
                        <Route path="/" element={<Landing />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile/edit"
                            element={
                                <ProtectedRoute>
                                    <ProfileEdit />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/u/:username" element={<PublicProfile />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default App
