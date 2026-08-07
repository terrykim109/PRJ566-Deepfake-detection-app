import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppState } from '../state/AppState'

/* Figma frame "Create Account" (node 9:8): same split layout as Log In
   with an extra Full Name field. */
export const CreateAccount: React.FC = () => {
  const navigate = useNavigate()
  const { signIn } = useAppState()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const values = ['name', 'email', 'password'].map((n) =>
      (form.elements.namedItem(n) as HTMLInputElement).value.trim(),
    )
    if (values.some((v) => !v)) {
      setError('Fill in every field to create your account.')
      return
    }
    signIn()
    navigate('/upload')
  }

  const socialSignUp = () => {
    signIn()
    navigate('/upload')
  }

  return (
    <div className="stage auth-page">
      <aside className="auth-aside">
        <img src="/assets/logo.png" alt="Deepfake Detection" />
      </aside>

      <main className="auth-main">
        <h1 className="auth-title">Create Account</h1>

        <div className="social-row">
          <button type="button" className="social-btn" onClick={socialSignUp}>
            <img src="/assets/icon-google.svg" alt="" />
            <span>Login with Google</span>
          </button>
          <button type="button" className="social-btn" onClick={socialSignUp}>
            <img src="/assets/icon-facebook.svg" alt="" />
            <span>Login with Facebook</span>
          </button>
        </div>

        <p className="auth-or">- OR -</p>

        <form onSubmit={submit}>
          <div className="field">
            <input name="name" type="text" placeholder="Full Name" autoComplete="name" />
          </div>

          <div className="field">
            <input name="email" type="email" placeholder="Email Address" autoComplete="email" />
          </div>

          <div className="field">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              autoComplete="new-password"
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

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn auth-submit">
            Create Account
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
