import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { useAppState } from '../state/AppState'

/* Profile page — editable fields synced to backend.
   After login, user lands here first. */
export const Profile: React.FC = () => {
  const navigate = useNavigate()
  const { profile, updateProfile, signOut, loading } = useAppState()
  const [draft, setDraft] = useState(profile)
  const [savedNote, setSavedNote] = useState(false)
  const [localError, setLocalError] = useState('')

  const set = (key: keyof typeof draft) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft((d) => ({ ...d, [key]: e.target.value }))
    setSavedNote(false)
    setLocalError('')
  }

  const save = async () => {
    setLocalError('')
    try {
      await updateProfile(draft)
      setSavedNote(true)
    } catch {
      // error surfaced via useAuth
    }
  }

  const logOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <AppShell>
      <div className="profile-head">
        <div className="profile-avatar">
          <img src="/assets/avatar.png" alt="" />
        </div>
        <h1 className="profile-name">
          {profile.firstName} {profile.lastName}
        </h1>
      </div>

      <section className="profile-card">
        <div className="profile-field">
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" value={draft.firstName} onChange={set('firstName')} disabled={loading} />
        </div>
        <div className="profile-field">
          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" value={draft.lastName} onChange={set('lastName')} disabled={loading} />
        </div>
        <div className="profile-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={draft.email} onChange={set('email')} disabled={loading} />
        </div>
        <div className="profile-field">
          <label htmlFor="phone">Phone Number</label>
          <input id="phone" value={draft.phone} onChange={set('phone')} disabled={loading} />
        </div>
      </section>

      <div className="profile-actions">
        {savedNote && <span className="profile-saved">Profile updated</span>}
        {localError && <span className="auth-error" style={{ marginRight: 'auto' }}>{localError}</span>}
        <button className="btn-ghost" onClick={save} disabled={loading}>
          {loading ? 'Saving…' : 'Save changes'}
        </button>
        <button className="btn" onClick={logOut} disabled={loading}>
          Log Out
        </button>
      </div>
    </AppShell>
  )
}