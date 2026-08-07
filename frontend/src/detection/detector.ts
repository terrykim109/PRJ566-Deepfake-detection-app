/* The seam between the app and whatever performs deepfake detection.
   Today the only adapter is the mock (see mockDetector.ts); the HTTP
   adapter that calls the backend drops in beside it without any page
   or state change. */

export type Verdict = 'real' | 'warn' | 'fake'

/* What a detector reports about one image.

   Deliberately does NOT carry id, fileName or timestamps: those are
   app-side identity and are stamped by the caller when the run is
   committed. A detector never mints them. */
export interface Detection {
  verdict: Verdict
  /** Human wording for the verdict, e.g. "Likely manipulated". */
  verdictLabel: string
  /** 0–100. */
  confidence: number
  summary: string
}

/* Contract every adapter must honour:

   - resolves with a Detection, or rejects with an Error whose `message`
     is safe to show the user;
   - rejects with an AbortError (DOMException) if `signal` aborts, and
     performs no further work after that;
   - may take seconds, so callers must render a pending state.

   The backend endpoint is expected to satisfy this shape. */
export interface Detector {
  analyze(file: File, signal?: AbortSignal): Promise<Detection>
}

/** Matches what `fetch` rejects with, so both adapters abort alike. */
export const abortError = (): DOMException =>
  new DOMException('Analysis aborted', 'AbortError')
