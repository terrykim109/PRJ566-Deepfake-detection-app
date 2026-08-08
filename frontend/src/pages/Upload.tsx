import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { StepIndicator } from '../components/StepIndicator'
import { useAppState } from '../state/AppState'
import { TIPS, TIPS_LEAD } from '../data/mock'

/* Figma frame "Image Upload" (node 20:12).

   The frame shows the step tracker but has no control that moves you
   from step 1 to step 2, so the Analyze / Clear buttons below are an
   addition, styled with the design's own button treatment. */
export const Upload: React.FC = () => {
  const navigate = useNavigate()
  const { runAnalysis } = useAppState()
  const inputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const abortRef = useRef<AbortController | null>(null)
  /* Blob-URL bookkeeping: previewRef mirrors `preview` for the unmount
     cleanup, handedOff marks the URL as now owned by app state. */
  const previewRef = useRef<string | null>(null)
  const handedOff = useRef(false)

  useEffect(
    () => () => {
      // Cancel a pending run — otherwise navigating away mid analysis
      // still fires navigate('/results') a second later.
      abortRef.current?.abort()
      if (previewRef.current && !handedOff.current) {
        URL.revokeObjectURL(previewRef.current)
      }
    },
    [],
  )

  const setPreviewUrl = (next: string | null) => {
    if (previewRef.current && previewRef.current !== next) {
      URL.revokeObjectURL(previewRef.current)
    }
    previewRef.current = next
    setPreview(next)
  }

  const accept = (picked: File | undefined) => {
    if (!picked || !picked.type.startsWith('image/')) return
    setFile(picked)
    setPreviewUrl(URL.createObjectURL(picked))
    setError('')
  }

  const clear = () => {
    setFile(null)
    setPreviewUrl(null)
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  /* Hold on step 2 until the detector answers, then hand off to the
     results screen. On failure we keep the file and the blob so the
     user can retry — handedOff only flips once the run is committed. */
  const analyze = async () => {
    if (!file) return
    setProcessing(true)
    setError('')

    const controller = new AbortController()
    abortRef.current = controller

    try {
      await runAnalysis(file, preview, controller.signal)
      handedOff.current = true
      navigate('/results')
    } catch (err) {
      // Aborted means we unmounted; the cleanup has already revoked.
      if (controller.signal.aborted) return
      setProcessing(false)
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.')
    }
  }

  return (
    <AppShell>
      <h1 className="page-title">Upload your media</h1>

      <section className="panel upload-card">
        <div className="upload-grid">
          <div className="upload-col">
            {processing ? (
              <div className="processing-box">
                <div className="spinner" />
                <p className="processing-text">Analyzing your image…</p>
              </div>
            ) : (
              <div
                className={`drop-zone${dragging ? ' dragging' : ''}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragging(false)
                  accept(e.dataTransfer.files[0])
                }}
              >
                {preview ? (
                  <img className="preview" src={preview} alt={file?.name ?? 'Selected image'} />
                ) : (
                  <>
                    <p className="drop-zone-text">Drop your image here</p>
                    <p className="drop-zone-hint">or click to browse — JPG, PNG or WEBP</p>
                  </>
                )}
              </div>
            )}

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => accept(e.target.files?.[0])}
            />

            <div className="upload-steps">
              <StepIndicator step={processing ? 2 : 1} />
            </div>

            {error && <p className="upload-error">{error}</p>}

            <div className="upload-actions">
              <button className="btn" onClick={analyze} disabled={!file || processing}>
                {processing ? 'Analyzing…' : 'Analyze image'}
              </button>
              {file && !processing && (
                <button className="btn-ghost" onClick={clear}>
                  Clear
                </button>
              )}
            </div>
          </div>

          <aside className="tips-panel">
            <p className="tips-title">Helpful Tips</p>
            <p className="tips-lead">{TIPS_LEAD}</p>
            {TIPS.map((tip) => (
              <div className="tip-row" key={tip}>
                <img src="/assets/icon-check-circle.svg" alt="" />
                <span>{tip}</span>
              </div>
            ))}
          </aside>
        </div>
      </section>
    </AppShell>
  )
}
