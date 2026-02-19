import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getCurrentUser, logout as logoutApi } from '../services/api'

export interface User {
    id: string
    google_id: string
    name: string
    email: string
    image: string
    username: string
    bio: string
    phone: string
    location: string
    skills: string
    banner_image: string
    theme_color: string
    is_public: boolean
    is_deleted: boolean
    login_count: number
    last_login_at: string
    created_at: string
    updated_at: string
}

interface AuthContextType {
    user: User | null
    loading: boolean
    checkAuth: () => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    checkAuth: async () => { },
    logout: async () => { },
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const checkAuth = async () => {
        try {
            const res = await getCurrentUser()
            setUser(res.data)
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            await logoutApi()
        } catch {
            // ignore
        }
        setUser(null)
    }

    useEffect(() => {
        checkAuth()
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, checkAuth, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
