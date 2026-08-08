import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export const Logo: React.FC<{ to?: string }> = ({ to = '/' }) => (
  <Link className="app-logo" to={to} aria-label="Deepfake Detection home">
    <img src="/assets/logo.png" alt="Deepfake Detection" />
  </Link>
)

const ANALYZE_PATHS = ['/upload', '/results']
const HISTORY_PATHS = ['/history', '/result/']

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const analyzeActive = ANALYZE_PATHS.some((p) => pathname.startsWith(p))
  const historyActive = HISTORY_PATHS.some((p) => pathname.startsWith(p))

  return (
    <div className="stage">
      <header className="app-header">
        <Logo to="/upload" />
        <button className="account-btn" onClick={() => navigate('/profile')} aria-label="Account">
          <img src="/assets/account-circle.svg" alt="" />
        </button>
      </header>

      <nav className="nav-bar">
        <button
          className={`nav-tab${analyzeActive ? ' active' : ''}`}
          onClick={() => navigate('/upload')}
        >
          Analyze
        </button>
        <button
          className={`nav-tab${historyActive ? ' active' : ''}`}
          onClick={() => navigate('/history')}
        >
          History
        </button>
      </nav>

      {children}
    </div>
  )
}
