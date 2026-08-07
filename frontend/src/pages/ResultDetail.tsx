import React, { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Modal } from '../components/Modal'
import { useAppState } from '../state/AppState'

/* Figma frames "Result from History" (20:45) and
   "Saved Confirmation" (115:50) — the score ellipse, the summary and a
   save action that opens the confirmation modal. */
export const ResultDetail: React.FC = () => {
  const { id } = useParams()
  const { history } = useAppState()
  const [saved, setSaved] = useState(false)

  const result = history.find((r) => r.id === id)
  if (!result) return <Navigate to="/history" replace />

  return (
    <AppShell>
      <section className="panel detail-card">
        <button className="detail-save" onClick={() => setSaved(true)} aria-label="Save result">
          <img src="/assets/icon-save.svg" alt="" />
        </button>

        <div className="score">
          <span>{result.confidence}</span>
        </div>

        <p className="detail-text">{result.summary}</p>

        <p className="detail-meta">
          {result.fileName} · {result.verdictLabel} · {result.timestamp}
        </p>
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
