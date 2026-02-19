import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Auth
export const getCurrentUser = () => api.get('/auth/me')
export const logout = () => api.post('/auth/logout')

// User
export const getUser = () => api.get('/api/users/me')
export const updateUser = (data: Record<string, unknown>) => api.put('/api/users/me', data)
export const updateUsername = (username: string) => api.put('/api/users/me/username', { username })
export const togglePublic = () => api.put('/api/users/me/toggle-public')
export const deleteAccount = () => api.delete('/api/users/me')
export const getUserStats = () => api.get('/api/users/me/stats')

// Activity
export const getActivity = () => api.get('/api/activity')

// Public Profile
export const getPublicProfile = (username: string) => api.get(`/api/profile/${username}`)

// Google login URL
export const getGoogleLoginUrl = () => `${API_URL}/auth/google`

export default api
