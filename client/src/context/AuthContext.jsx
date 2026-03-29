import { createContext, useContext, useState, useCallback } from 'react'
import API from '../services/api'

const AuthContext = createContext(null)
const STORAGE_KEY = 'bs_user'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  const saveUser = useCallback((data) => {
    setUser(data)
    if (data) localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    else       localStorage.removeItem(STORAGE_KEY)
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await API.post('/auth/login', { email, password })
      saveUser(data)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    setLoading(true)
    try {
      const { data } = await API.post('/auth/register', { name, email, password })
      saveUser(data)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = useCallback(() => saveUser(null), [saveUser])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
