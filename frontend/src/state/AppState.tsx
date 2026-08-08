import React, { createContext, useContext } from 'react'
import { useAuth, type AuthState, type AuthActions } from './useAuth'

type AppStateValue = AuthState & AuthActions

const AppStateContext = createContext<AppStateValue | null>(null)

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authState = useAuth()
  return <AppStateContext.Provider value={authState}>{children}</AppStateContext.Provider>
}

export const useAppState = (): AppStateValue => {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider')
  return ctx
}
