/* Hardcoded mock data transcribed from the Figma file
   (PRJ544_DeepfakeDetection, 1KQ4bdMC3NOlHZVtDRzN0G).
   Copy, scores and timestamps match the design frames exactly. */

import type { Detection } from '../detection/detector'

/* A Detection plus the identity and timing the app stamps on it when a
   run is committed. */
export interface AnalysisResult extends Detection {
  id: string
  fileName: string
  /** Display string, worded exactly as the Figma frames show it. */
  timestamp: string
  /** ISO 8601 — the sortable value. `timestamp` is for display only and
      must never be parsed; keep both in sync when adding results. */
  createdAt: string
}

/* Long-form copy from the "Image Results" frame (node 209:104) */
export const RESULT_PARAGRAPHS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id feugiat lorem. Sed sed nunc velit. Vivamus quis enim nec diam posuere interdum. Donec feugiat rutrum lectus luctus aliquam. Duis consectetur luctus neque, vel accumsan velit auctor at. Duis non justo in tortor pretium mollis porttitor dapibus mauris. Aliquam ornare et ex ac sodales. Vivamus turpis eros, efficitur et eros et, accumsan pellentesque eros. Quisque viverra dignissim efficitur. Phasellus ac nunc ante. Praesent ac ante sagittis est gravida finibus nec ut purus. In condimentum laoreet arcu, eget aliquam neque rhoncus ut. Praesent a euismod urna. Quisque in dui nibh. Aenean eu interdum magna.',
  'Mauris vitae nibh massa. Ut sed erat erat. Phasellus vel porta augue. Ut maximus varius neque, sit amet ullamcorper libero venenatis maximus. Duis id finibus risus. Proin eu sem ante. Quisque ex dui, pretium suscipit magna eget, tristique sodales felis. Aenean et eros ut tellus feugiat pellentesque. Maecenas ornare purus nec sapien dignissim consectetur. Nunc volutpat pellentesque lacus nec posuere.',
  'Pellentesque semper metus diam, id consectetur lorem condimentum ac. Curabitur in diam a felis congue aliquet vitae a elit. In non feugiat ipsum. Vivamus egestas a ipsum molestie consectetur. Suspendisse eget sem quis odio venenatis volutpat. Sed hendrerit nibh ut elit faucibus, vel bibendum purus ullamcorper. Nam non dui sit amet neque lacinia convallis',
]

/* Summary copy from the "Result from History" frame (node 61:49) */
export const DETAIL_SUMMARY =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

/* The three rows shown in the "History" frame (node 3:188) */
export const HISTORY_SEED: AnalysisResult[] = [
  {
    id: 'h1',
    fileName: 'interview_ss.png',
    verdict: 'fake',
    verdictLabel: 'Likely manipulated',
    confidence: 87,
    timestamp: 'Jul 20, 2026 · 3:42 PM',
    createdAt: '2026-07-20T15:42:00',
    summary: DETAIL_SUMMARY,
  },
  {
    id: 'h2',
    fileName: 'news_anchor_photo.jpg',
    verdict: 'warn',
    verdictLabel: 'Possible manipulation detected',
    confidence: 58,
    timestamp: 'Jul 19, 2026 · 6:18 PM',
    createdAt: '2026-07-19T18:18:00',
    summary: DETAIL_SUMMARY,
  },
  {
    id: 'h3',
    fileName: 'profile_photo.jpg',
    verdict: 'real',
    verdictLabel: 'No manipulation detected',
    confidence: 70,
    timestamp: 'Jun 04, 2026 · 1:30 AM',
    createdAt: '2026-06-04T01:30:00',
    summary: DETAIL_SUMMARY,
  },
]

/* Account shown on the "Profile" frame (node 57:38) */
export const MOCK_USER = {
  firstName: 'Biz',
  lastName: 'Owner',
  email: 'BizOwner@gmail.com',
  phone: 'xxx-xxx-xxxx',
}

/* Renders a Date in the exact format the Figma history rows use,
   e.g. "Jun 04, 2026 · 1:30 AM" (day is zero-padded). */
export const formatTimestamp = (d: Date): string => {
  const month = d.toLocaleString('en-US', { month: 'short' })
  const day = String(d.getDate()).padStart(2, '0')
  const time = d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  return `${month} ${day}, ${d.getFullYear()} · ${time}`
}

export const TIPS = [
  'Clear, well lit images usually work best.',
  'Make sure your file is in a supported image format.',
  'Your image is processed securely and removed after analysis.',
  'Analysis results are there to help you make a better judgment.',
]

export const TIPS_LEAD = 'Please upload one image at a time.'
