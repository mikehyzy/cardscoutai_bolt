import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

// Mock user for demo mode
const createMockUser = (email: string): User => ({
  id: 'demo-user-123',
  email,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  aud: 'authenticated',
  role: 'authenticated',
  email_confirmed_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {},
  identities: [],
  factors: []
})

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true' || !import.meta.env.VITE_SUPABASE_URL

  useEffect(() => {
    if (isDemoMode) {
      // In demo mode, check if there's a stored demo user
      const storedDemoUser = localStorage.getItem('demo-user')
      if (storedDemoUser) {
        setUser(JSON.parse(storedDemoUser))
      }
      setLoading(false)
      return
    }

    // Get initial session for real mode
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes in real mode
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [isDemoMode])

  const signIn = async (email: string, password: string) => {
    if (isDemoMode) {
      // In demo mode, accept any credentials
      const mockUser = createMockUser(email)
      setUser(mockUser)
      localStorage.setItem('demo-user', JSON.stringify(mockUser))
      return { error: null }
    }

    // Real authentication
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    if (isDemoMode) {
      // In demo mode, accept any credentials for signup
      const mockUser = createMockUser(email)
      setUser(mockUser)
      localStorage.setItem('demo-user', JSON.stringify(mockUser))
      return { error: null }
    }

    // Real signup
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    if (isDemoMode) {
      // In demo mode, just clear the mock user
      setUser(null)
      localStorage.removeItem('demo-user')
      return { error: null }
    }

    // Real signout
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
}