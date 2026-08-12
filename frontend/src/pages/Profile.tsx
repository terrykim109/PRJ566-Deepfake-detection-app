import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { useAppState } from '../state/AppState'

/* Profile page — editable fields synced to backend.
   After login, user lands here first. */
export const Profile: React.FC = () => {
  const navigate = useNavigate()
  const { profile, updateProfile, signOut, loading, saving, error, clearError } = useAppState()
  const [draft, setDraft] = useState(profile)
  const [dirty, setDirty] = useState(false)
  const [savedNote, setSavedNote] = useState(false)
  const [localError, setLocalError] = useState('')
  const busy = loading || saving

  useEffect(() => {
    if (!dirty) setDraft(profile)
  }, [profile, dirty])

  const set = (key: keyof typeof draft) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDraft((d) => ({ ...d, [key]: value }))
    setDirty(true)
    setSavedNote(false)
    setLocalError('')
    clearError()
  }

  const save = async () => {
    setLocalError('')
    try {
      await updateProfile(draft)
      setDirty(false)
      setSavedNote(true)
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Could not save profile.')
    }
  }

  const logOut = async () => {
    await signOut()
    navigate('/login')
  }

  const displayError = localError || error

  return (
    <AppShell>
      <div className="profile-head">
        <div className="profile-avatar" aria-hidden="true" />
        <h1 className="profile-name">
          {draft.firstName || profile.firstName} {draft.lastName || profile.lastName}
        </h1>
      </div>

      <section className="profile-card">
        <div className="profile-field">
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" value={draft.firstName} onChange={set('firstName')} disabled={busy} />
        </div>
        <div className="profile-field">
          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" value={draft.lastName} onChange={set('lastName')} disabled={busy} />
        </div>
        <div className="profile-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={draft.email} onChange={set('email')} disabled={busy} />
        </div>
        <div className="profile-field">
          <label htmlFor="phone">Phone Number</label>
          <input id="phone" type="tel" value={draft.phone} onChange={set('phone')} disabled={busy} autoComplete="tel" />
        </div>
      </section>

      <div className="profile-actions">
        {savedNote && !displayError && <span className="profile-saved">Profile updated</span>}
        {displayError && <span className="auth-error" style={{ marginRight: 'auto' }}>{displayError}</span>}
        <button type="button" className="btn-ghost" onClick={save} disabled={busy}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        <button type="button" className="btn" onClick={logOut} disabled={busy}>
          Log Out
        </button>
      </div>
    </AppShell>
  )
}
