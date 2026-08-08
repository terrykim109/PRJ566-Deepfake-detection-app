// CreateAccount.tsx

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppState } from '../state/AppState'

export const CreateAccount: React.FC = () => {
  const navigate = useNavigate()
  const { signUp, error, clearError, loading } = useAppState()
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')
    clearError()

    const form = e.target as HTMLFormElement
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim()
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    const password = (form.elements.namedItem('password') as HTMLInputElement).value.trim()

    if (!name || !email || !password) {
      setLocalError('Fill in every field to create your account.')
      return
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.')
      return
    }

    try {
      await signUp(email, password, name)
      navigate('/login')
    } catch {
      // error surfaced via useAuth
    }
  }

  const displayError = localError || error

  return (
    <div className="stage auth-page">
      <aside className="auth-aside">
        <img src="./logo.png" alt="Deepfake Detection" />
      </aside>

      <main className="auth-main">
        <h1 className="auth-title">Create Account</h1>

        <form onSubmit={submit}>
          <div className="field">
            <input name="name" type="text" placeholder="Full Name" autoComplete="name" disabled={loading} />
          </div>

          <div className="field">
            <input name="email" type="email" placeholder="Email Address" autoComplete="email" disabled={loading} />
          </div>

          <div className="field">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              autoComplete="new-password"
              disabled={loading}
            />
            <button
              type="button"
              className="field-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <img src="/assets/icon-visibility.svg" alt="" />
            </button>
          </div>

          {displayError && <p className="auth-error">{displayError}</p>}

          <button type="submit" className="btn auth-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
