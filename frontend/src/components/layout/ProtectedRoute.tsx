import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { DashboardSkeleton } from '../ui/LoadingSkeleton'

interface ProtectedRouteProps {
    children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="w-full max-w-6xl">
                    <DashboardSkeleton />
                </div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}

export default ProtectedRoute
