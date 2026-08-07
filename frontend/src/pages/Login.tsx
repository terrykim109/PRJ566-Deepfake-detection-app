import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppState } from '../state/AppState'

/* Figma frame "Log In" (node 3:187): 521px primary panel on the left,
   form on the right with social buttons, underlined fields and a
   612×72 submit button. */
export const Login: React.FC = () => {
  const navigate = useNavigate()
  const { signIn } = useAppState()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  /* Mock auth: any non-empty pair signs in. */
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    const password = (form.elements.namedItem('password') as HTMLInputElement).value.trim()
    if (!email || !password) {
      setError('Enter an email address and password to continue.')
      return
    }
    signIn()
    navigate('/upload')
  }

  const socialSignIn = () => {
    signIn()
    navigate('/upload')
  }

  return (
    <div className="stage auth-page">
      <aside className="auth-aside">
        <img src="/assets/logo.png" alt="Deepfake Detection" />
      </aside>

      <main className="auth-main">
        <h1 className="auth-title">Log in</h1>

        <div className="social-row">
          <button type="button" className="social-btn" onClick={socialSignIn}>
            <img src="/assets/icon-google.svg" alt="" />
            <span>Login with Google</span>
          </button>
          <button type="button" className="social-btn" onClick={socialSignIn}>
            <img src="/assets/icon-facebook.svg" alt="" />
            <span>Login with Facebook</span>
          </button>
        </div>

        <p className="auth-or">- OR -</p>

        <form onSubmit={submit}>
          <div className="field">
            <input name="email" type="email" placeholder="Email Address" autoComplete="email" />
          </div>

          <div className="field">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              autoComplete="current-password"
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
            Log in
          </button>
        </form>

        <div className="auth-links">
          <p>
            Forgot <Link to="/login">password?</Link>
          </p>
          <p>
            Don't have an account? <Link to="/create-account">Create an account</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
