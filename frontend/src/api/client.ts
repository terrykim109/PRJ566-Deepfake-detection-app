const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

interface ApiResponse<T> {
  data?: T
  error?: string
}

async function post<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) return { error: data.detail || `Error ${res.status}` }
    return { data }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Network error' }
  }
}

async function put<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) return { error: data.detail || `Error ${res.status}` }
    return { data }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Network error' }
  }
}

export interface UserResponse {
  id: string
  user_id: string
  email: string
  display_name: string | null
  first_name?: string
  last_name?: string
  phone?: string
  auth_provider: string
  created_at: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  user: UserResponse
}

export const authApi = {
  signup: (email: string, password: string, displayName?: string) =>
    post<TokenResponse>('/api/auth/signup', { email, password, display_name: displayName }),

  login: (email: string, password: string) =>
    post<TokenResponse>('/api/auth/login', { email, password }),

  logout: (userId?: string) =>
    post('/api/auth/logout', { user_id: userId }),

  updateProfile: (userId: string, profile: { first_name?: string; last_name?: string; email?: string; phone?: string }) =>
    put(`/api/users/${userId}/profile`, profile),
}