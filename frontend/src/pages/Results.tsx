import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { StepIndicator } from '../components/StepIndicator'
import { Modal } from '../components/Modal'
import { useAppState } from '../state/AppState'
import { RESULT_PARAGRAPHS } from '../data/mock'

/* Figma frame "Image Results" (node 3:4).

   The frame has no way to save the result or start another run, so the
   Save / Analyze another buttons below are additions in the design's
   own button style. Saving reuses the "Saved Modal" (node 115:92). */
export const Results: React.FC = () => {
  const navigate = useNavigate()
  const { currentResult, previewUrl, saveResult, isSaved, clearAnalysis } = useAppState()
  const [saved, setSaved] = useState(false)
  const alreadySaved = currentResult ? isSaved(currentResult.id) : false

  if (!currentResult) return <Navigate to="/upload" replace />

  const save = () => {
    saveResult(currentResult)
    setSaved(true)
  }

  const analyzeAnother = () => {
    clearAnalysis()
    navigate('/upload')
  }

  return (
    <AppShell>
      <section className="panel results-card">
        <div className="result-thumb">
          {previewUrl ? (
            <img className="shot" src={previewUrl} alt={currentResult.fileName} />
          ) : (
            <img className="icon" src="/assets/icon-image.svg" alt="" />
          )}
        </div>

        <div className="result-body">
          <div className="result-text">
            {RESULT_PARAGRAPHS.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="score">
            <span>{currentResult.confidence}</span>
          </div>
        </div>

        <div className="results-steps">
          <StepIndicator step={3} />
        </div>

        <div className="results-actions">
          <button className="btn" onClick={save} disabled={alreadySaved}>
            {alreadySaved ? 'Saved' : 'Save result'}
          </button>
          <button className="btn-ghost" onClick={analyzeAnother}>
            Analyze another
          </button>
        </div>
      </section>

      {saved && (
        <Modal
          title="Results Saved"
          subtitle={'Results can be viewed in the “History” Page'}
          onClose={() => setSaved(false)}
        />
      )}
    </AppShell>
  )
}
