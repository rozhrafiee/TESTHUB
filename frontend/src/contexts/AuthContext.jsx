import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      loadUser()
    } else {
      setLoading(false)
    }
  }, [])

  const loadUser = async () => {
    try {
      const response = await authAPI.getProfile()
      setUser(response.data.user)
    } catch (error) {
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password })
      localStorage.setItem('token', response.data.token)
      setUser(response.data.user)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.detail || 'Login failed',
      }
    }
  }

  const register = async (data) => {
    try {
      console.log('Registering with data:', { ...data, password1: '***', password2: '***' })
      const response = await authAPI.register(data)
      console.log('Registration response:', response.data)
      localStorage.setItem('token', response.data.token)
      setUser(response.data.user)
      return { success: true }
    } catch (error) {
      console.error('Registration error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      })
      
      let errorMessage = 'Registration failed'
      if (error.response?.data) {
        const errorData = error.response.data
        
        // Handle different error formats
        if (errorData.error) {
          if (typeof errorData.error === 'string') {
            errorMessage = errorData.error
          } else if (typeof errorData.error === 'object') {
            errorMessage = Object.entries(errorData.error)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join('\n')
          }
        } else if (errorData.detail) {
          errorMessage = errorData.detail
        } else if (Array.isArray(errorData)) {
          errorMessage = errorData.join('\n')
        } else if (typeof errorData === 'object') {
          // Handle validation errors - common Django REST framework format
          const errors = Object.entries(errorData)
            .map(([key, value]) => {
              if (Array.isArray(value)) {
                return `${key}: ${value.join(', ')}`
              } else if (typeof value === 'object') {
                return `${key}: ${JSON.stringify(value)}`
              }
              return `${key}: ${value}`
            })
            .join('\n')
          errorMessage = errors || 'Validation error'
        } else if (typeof errorData === 'string') {
          errorMessage = errorData
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      
      // Handle network errors specifically
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - سرور پاسخ نمی‌دهد'
      } else if (!error.response && error.request) {
        errorMessage = 'خطای شبکه - اتصال به سرور برقرار نشد. لطفاً مطمئن شوید سرور در حال اجرا است.'
      }
      
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loadUser,
    isAuthenticated: !!user,
    isStudent: user?.user_type === 'student',
    isTeacher: user?.user_type === 'teacher',
    isConsultant: user?.user_type === 'consultant',
    isAdmin: user?.user_type === 'admin',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

