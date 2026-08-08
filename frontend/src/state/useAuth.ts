import { useState, useEffect, useCallback } from 'react'
import { authApi, type UserResponse } from '../api/client'

const TOKEN_KEY = 'dfd.token'
const USER_KEY = 'dfd.user'

function loadStored(): { token: string | null; user: UserResponse | null } {
  try {
    const token = sessionStorage.getItem(TOKEN_KEY)
    const userRaw = sessionStorage.getItem(USER_KEY)
    const user = userRaw ? JSON.parse(userRaw) : null
    return { token, user }
  } catch {
    return { token: null, user: null }
  }
}

function saveStored(token: string, user: UserResponse) {
  sessionStorage.setItem(TOKEN_KEY, token)
  sessionStorage.setItem(USER_KEY, JSON.stringify(user))
}

function clearStored() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)
}

export interface Profile {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface AuthState {
  user: UserResponse | null
  token: string | null
  profile: Profile
  loading: boolean
  error: string
}

export interface AuthActions {
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (next: Profile) => Promise<void>
  clearError: () => void
}

/* Build a Profile from the backend user record */
function buildProfile(user: UserResponse | null): Profile {
  if (!user) return { firstName: '', lastName: '', email: '', phone: '' }
  const names = (user.display_name || '').split(' ')
  return {
    firstName: user.first_name || names[0] || '',
    lastName: user.last_name || names.slice(1).join(' ') || '',
    email: user.email || '',
    phone: user.phone || '',
  }
}

export function useAuth(): AuthState & AuthActions {
  const stored = loadStored()
  const [user, setUser] = useState<UserResponse | null>(stored.user)
  const [token, setToken] = useState<string | null>(stored.token)
  const [profile, setProfile] = useState<Profile>(buildProfile(stored.user))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (stored.token && stored.user) {
      setToken(stored.token)
      setUser(stored.user)
      setProfile(buildProfile(stored.user))
    }
  }, [])

  const clearError = useCallback(() => setError(''), [])

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    setLoading(true)
    setError('')
    const res = await authApi.signup(email, password, displayName)
    if (res.error) {
      setError(res.error)
      setLoading(false)
      throw new Error(res.error)
    }
    const data = res.data!
    saveStored(data.access_token, data.user)
    setToken(data.access_token)
    setUser(data.user)
    setProfile(buildProfile(data.user))
    setLoading(false)
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError('')
    const res = await authApi.login(email, password)
    if (res.error) {
      setError(res.error)
      setLoading(false)
      throw new Error(res.error)
    }
    const data = res.data!
    saveStored(data.access_token, data.user)
    setToken(data.access_token)
    setUser(data.user)
    setProfile(buildProfile(data.user))
    setLoading(false)
  }, [])

  const signOut = useCallback(async () => {
    setLoading(true)
    if (user?.user_id) await authApi.logout(user.user_id)
    clearStored()
    setToken(null)
    setUser(null)
    setProfile({ firstName: '', lastName: '', email: '', phone: '' })
    setLoading(false)
  }, [user])

  /* Update profile — saves to backend AND updates local state */
  const updateProfile = useCallback(async (next: Profile) => {
    if (!user?.user_id) return
    setLoading(true)
    setError('')

    const res = await authApi.updateProfile(user.user_id, {
      first_name: next.firstName,
      last_name: next.lastName,
      email: next.email,
      phone: next.phone,
    })

    if (res.error) {
      setError(res.error)
      setLoading(false)
      throw new Error(res.error)
    }

    /* Update local user + profile */
    const updatedUser = { ...user, display_name: `${next.firstName} ${next.lastName}`.trim(), email: next.email }
    saveStored(token || '', updatedUser)
    setUser(updatedUser)
    setProfile(next)
    setLoading(false)
  }, [user, token])

  return { user, token, profile, loading, error, signUp, signIn, signOut, updateProfile, clearError }
}