import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Modal } from '../components/Modal'
import { useAppState, type SortOrder } from '../state/AppState'

/* Figma frames "History" (3:188), "Sorting" (126:162),
   "DeletePopUp" (156:118) and "Deleted History" (117:101) — one screen
   with a sort control, a delete confirmation and a success banner. */
export const History: React.FC = () => {
  const navigate = useNavigate()
  const { sortedHistory, sortOrder, setSortOrder, deleteResult } = useAppState()
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)
  const [showDeleted, setShowDeleted] = useState(false)
  const toastTimer = useRef<number>()

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const confirmDelete = () => {
    if (pendingDelete) deleteResult(pendingDelete)
    setPendingDelete(null)
    setShowDeleted(true)
    /* Restart the timer so a second delete gets a full toast rather than
       inheriting the tail of the first one. */
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setShowDeleted(false), 2400)
  }

  return (
    <AppShell>
      <section className="panel history-card">
        {showDeleted && <div className="toast">Successfully Deleted!</div>}

        <div className="history-toolbar">
          <select
            className="sort-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            aria-label="Sort results"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {sortedHistory.length === 0 ? (
          <p className="history-empty">No saved results yet.</p>
        ) : (
          <div className="history-list">
            {sortedHistory.map((row) => (
              <div
                className="history-row"
                key={row.id}
                onClick={() => navigate(`/result/${row.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/result/${row.id}`)}
              >
                <div className="history-row-info">
                  <div>{row.fileName}</div>
                  <div className={`history-row-verdict ${row.verdict}`}>
                    {row.verdictLabel} — {row.confidence}% confidence
                  </div>
                  <div>{row.timestamp}</div>
                </div>

                <button
                  className="history-delete"
                  aria-label={`Delete ${row.fileName}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setPendingDelete(row.id)
                  }}
                >
                  <img src="/assets/icon-x-octagon.svg" alt="" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {pendingDelete && (
        <Modal
          title="Delete Result?"
          subtitle="Result will be permanently deleted"
          onClose={() => setPendingDelete(null)}
        >
          <div className="modal-actions">
            <button className="modal-btn confirm" onClick={confirmDelete}>
              Confirm
            </button>
            <button className="modal-btn cancel" onClick={() => setPendingDelete(null)}>
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </AppShell>
  )
}
