import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService.getSession().then((session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = authService.onAuthStateChange((session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    const data = await authService.signIn(email, password)
    return data
  }

  const signUp = async (email, password, username) => {
    const data = await authService.signUp(email, password, username)
    return data
  }

  const signOut = async () => {
    await authService.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
