import React, { useState } from 'react'

const API_BASE = 'http://localhost:8000'

/* ─── Types ─── */
interface StepIndicatorProps {
  step: number
}

/* ─── SVG Icons ─── */
const UserIconSvg: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const UploadIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)

const ProcessingIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

const ResultsIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
  </svg>
)

const CheckIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

/* ─── Step Indicator ─── */
const StepIndicator: React.FC<StepIndicatorProps> = ({ step }) => {
  const steps = [
    { id: 1, label: 'Step 1. Upload', Icon: UploadIcon },
    { id: 2, label: 'Step 2. Processing', Icon: ProcessingIcon },
    { id: 3, label: 'Step 3. Results', Icon: ResultsIcon },
  ]
  return (
    <div className="steps-row">
      {steps.map((s, idx) => {
        let status = 'inactive'
        if (s.id === step) status = 'active'
        if (s.id < step) status = 'complete'
        return (
          <React.Fragment key={s.id}>
            <div className="step">
              <div className={`step-circle ${status}`}>
                <s.Icon />
                <span>{s.label}</span>
              </div>
            </div>
            {idx < steps.length - 1 && <div className="step-arrow" />}
          </React.Fragment>
        )
      })}
    </div>
  )
}

/* ─── Tips Sidebar ─── */
const TipsPanel: React.FC = () => (
  <div className="tips-panel">
    <div className="tips-title">Helpful Tips</div>
    <div className="tip-item">
      <div className="tip-check"><CheckIcon /></div>
      <span>Please upload one image at a time.</span>
    </div>
    <div className="tip-item">
      <div className="tip-check"><CheckIcon /></div>
      <span>Clear, well lit images usually work best.</span>
    </div>
    <div className="tip-item">
      <div className="tip-check"><CheckIcon /></div>
      <span>Make sure your file is in a supported image format.</span>
    </div>
    <div className="tip-item">
      <div className="tip-check"><CheckIcon /></div>
      <span>Your image is processed securely and removed after analysis.</span>
    </div>
    <div className="tip-item">
      <div className="tip-check"><CheckIcon /></div>
      <span>Analysis results are there to help you make a better judgment.</span>
    </div>
  </div>
)

/* ─── Main App ─── */
const App: React.FC = () => {
  const [tab, setTab] = useState<'analyze' | 'history'>('analyze')

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src="/logo.png" alt="Deepfake Detection" className="logo-img" />
        </div>
        <div className="user-icon" title="Account">
          <UserIconSvg />
        </div>
      </header>

      {/* Nav */}
      <nav className="nav-bar">
        <button
          className={`nav-tab ${tab === 'analyze' ? 'active' : ''}`}
          onClick={() => setTab('analyze')}
        >
          Analyze
        </button>
        <button
          className={`nav-tab ${tab === 'history' ? 'active' : ''}`}
          onClick={() => setTab('history')}
        >
          History
        </button>
      </nav>

      {/* Main */}
      <main className="main">
        {tab === 'analyze' ? (
          <>
            <h1 className="page-title">Upload your media</h1>
            <div className="card">
              <div className="upload-grid">
                <div>
                  <div className="drop-zone">
                    <div className="drop-zone-text">Drop your image here</div>
                    <div className="drop-zone-hint">
                      or click to browse · JPG, PNG, WEBP · Max 10 MB
                    </div>
                  </div>
                  <StepIndicator step={1} />
                </div>
                <TipsPanel />
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="page-title">Analysis History</h1>
            <div className="card">
              <div className="history-empty">
                <p style={{ fontSize: 16, marginBottom: 8 }}>No history available</p>
                <p style={{ fontSize: 13 }}>
                  Your saved analysis results will appear here.
                </p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App