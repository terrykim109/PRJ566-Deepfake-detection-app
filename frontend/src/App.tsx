import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppStateProvider, useAppState } from './state/AppState'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { CreateAccount } from './pages/CreateAccount'
import { Upload } from './pages/Upload'
import { Results } from './pages/Results'
import { History } from './pages/History'
import { ResultDetail } from './pages/ResultDetail'
import { Profile } from './pages/Profile'

/* Signed-out visitors get bounced back to the landing page. */
const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { signedIn } = useAppState()
  return signedIn ? children : <Navigate to="/" replace />
}

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/create-account" element={<CreateAccount />} />

    <Route path="/upload" element={<RequireAuth><Upload /></RequireAuth>} />
    <Route path="/results" element={<RequireAuth><Results /></RequireAuth>} />
    <Route path="/history" element={<RequireAuth><History /></RequireAuth>} />
    <Route path="/result/:id" element={<RequireAuth><ResultDetail /></RequireAuth>} />
    <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

const App: React.FC = () => (
  <AppStateProvider>
    <AppRoutes />
  </AppStateProvider>
)

export default App
