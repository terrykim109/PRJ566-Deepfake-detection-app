import React, { createContext, useContext, useMemo, useState } from 'react'
import {
  HISTORY_SEED,
  MOCK_USER,
  formatTimestamp,
  type AnalysisResult,
} from '../data/mock'
import type { Detector } from '../detection/detector'
import { mockDetector } from '../detection/mockDetector'

export type SortOrder = 'newest' | 'oldest'

interface Profile {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface AppStateValue {
  signedIn: boolean
  signIn: () => void
  signOut: () => void

  profile: Profile
  updateProfile: (next: Profile) => void

  history: AnalysisResult[]
  sortOrder: SortOrder
  setSortOrder: (order: SortOrder) => void
  sortedHistory: AnalysisResult[]
  deleteResult: (id: string) => void
  saveResult: (result: AnalysisResult) => void
  isSaved: (id: string) => boolean

  currentResult: AnalysisResult | null
  /* Rejects if detection fails or the signal aborts; nothing is
     committed in either case, so the caller keeps ownership of
     `preview` until this resolves. */
  runAnalysis: (file: File, preview: string | null, signal?: AbortSignal) => Promise<void>
  clearAnalysis: () => void
  previewUrl: string | null
}

const AppStateContext = createContext<AppStateValue | null>(null)

/* Kept in sessionStorage so a refresh doesn't bounce you to the landing
   page mid-demo. Cleared when the tab closes. */
const AUTH_KEY = 'dfd.signedIn'

/* `detector` is injected so tests can supply a deterministic adapter
   instead of waiting on the mock's latency. */
export const AppStateProvider: React.FC<{
  children: React.ReactNode
  detector?: Detector
}> = ({ children, detector = mockDetector }) => {
  const [signedIn, setSignedIn] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === 'true',
  )
  const [history, setHistory] = useState<AnalysisResult[]>(HISTORY_SEED)
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile>({
    firstName: MOCK_USER.firstName,
    lastName: MOCK_USER.lastName,
    email: MOCK_USER.email,
    phone: MOCK_USER.phone,
  })

  /* Sorted on createdAt, not on array order — a result saved during the
     session must slot in by date, not jump to the top. */
  const sortedHistory = useMemo(() => {
    const dir = sortOrder === 'newest' ? -1 : 1
    return [...history].sort(
      (a, b) => dir * (Date.parse(a.createdAt) - Date.parse(b.createdAt)),
    )
  }, [history, sortOrder])

  const value: AppStateValue = {
    signedIn,
    signIn: () => {
      sessionStorage.setItem(AUTH_KEY, 'true')
      setSignedIn(true)
    },
    signOut: () => {
      sessionStorage.removeItem(AUTH_KEY)
      setSignedIn(false)
    },

    profile,
    updateProfile: setProfile,

    history,
    sortOrder,
    setSortOrder,
    sortedHistory,
    deleteResult: (id) => setHistory((rows) => rows.filter((r) => r.id !== id)),
    /* The id is assigned once in runAnalysis and kept here, so this
       guard actually matches and saving twice can't duplicate a row. */
    saveResult: (result) =>
      setHistory((rows) => (rows.some((r) => r.id === result.id) ? rows : [result, ...rows])),
    isSaved: (id) => history.some((r) => r.id === id),

    currentResult,
    previewUrl,
    runAnalysis: async (file, preview, signal) => {
      /* Nothing below this line runs on a failed or aborted run, so the
         caller's blob URL is never adopted unless we got a Detection. */
      const detection = await detector.analyze(file, signal)

      /* Release the blob from any previous run before replacing it. */
      setPreviewUrl((old) => {
        if (old && old !== preview) URL.revokeObjectURL(old)
        return preview
      })
      /* Stamp the real run time. Reusing the design's frozen timestamp
         would tie with the seeded Jul 20 row and make history ordering
         depend on insertion order instead of date. No Figma frame shows
         a timestamp on the results screen, so fidelity is unaffected. */
      const now = new Date()
      setCurrentResult({
        ...detection,
        id: `a${now.getTime()}`,
        fileName: file.name,
        createdAt: now.toISOString(),
        timestamp: formatTimestamp(now),
      })
    },
    clearAnalysis: () => {
      setCurrentResult(null)
      setPreviewUrl((old) => {
        if (old) URL.revokeObjectURL(old)
        return null
      })
    },
  }

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export const useAppState = (): AppStateValue => {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider')
  return ctx
}
