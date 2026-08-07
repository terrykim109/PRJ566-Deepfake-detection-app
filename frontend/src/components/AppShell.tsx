import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

/* Header + navy nav bar shared by every signed-in screen.
   Geometry matches the Figma: logo 160×160 at x=64/y=0, nav bar
   1312×64 at x=64/y=148, account circle 53×52 at x=1326/y=62. */

export const Logo: React.FC<{ to?: string }> = ({ to = '/' }) => (
  <Link className="app-logo" to={to} aria-label="Deepfake Detection home">
    <img src="/assets/logo.png" alt="Deepfake Detection" />
  </Link>
)

/* "Analyze" covers the whole upload → processing → results flow,
   "History" covers the list and any result opened from it.
   The trailing slash on '/result/' matters: without it the prefix also
   matches '/results' and both tabs light up at once. */
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
