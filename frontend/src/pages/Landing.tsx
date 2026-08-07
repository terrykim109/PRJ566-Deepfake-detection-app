import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/AppShell'

/* Figma frame "Landing Page" (node 3:182) */
export const Landing: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="stage">
      <header className="app-header">
        <Logo to="/" />
      </header>

      <nav className="nav-bar">
        <div className="nav-auth">
          <button className="nav-btn" onClick={() => navigate('/create-account')}>
            Create Account
          </button>
          <button className="nav-btn" onClick={() => navigate('/login')}>
            Log In
          </button>
        </div>
      </nav>

      <section className="panel landing-card">
        <div className="landing-heading">
          <p className="l1">Not everything you see is real. Check first.</p>
          <p className="l2">Create an account to securely analyze your images.</p>
        </div>

        <div className="landing-tiles">
          <div className="landing-tile">REAL</div>
          <div className="landing-tile">Deepfake</div>
        </div>

        <div className="landing-cta">
          <button className="btn" onClick={() => navigate('/create-account')}>
            Get Started
          </button>
        </div>
      </section>
    </div>
  )
}
