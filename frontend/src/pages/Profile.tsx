import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { useAppState } from '../state/AppState'

/* Figma frame "Profile" (node 57:38).

   The frame shows the fields and a Log Out button but no way to commit
   an edit, so "Save changes" is an addition in the design's own style. */
export const Profile: React.FC = () => {
  const navigate = useNavigate()
  const { profile, updateProfile, signOut } = useAppState()
  const [draft, setDraft] = useState(profile)
  const [savedNote, setSavedNote] = useState(false)

  const set = (key: keyof typeof draft) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft((d) => ({ ...d, [key]: e.target.value }))
    setSavedNote(false)
  }

  const save = () => {
    updateProfile(draft)
    setSavedNote(true)
  }

  const logOut = () => {
    signOut()
    navigate('/')
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
          <input id="firstName" value={draft.firstName} onChange={set('firstName')} />
        </div>
        <div className="profile-field">
          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" value={draft.lastName} onChange={set('lastName')} />
        </div>
        <div className="profile-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={draft.email} onChange={set('email')} />
        </div>
        <div className="profile-field">
          <label htmlFor="phone">Phone Number</label>
          <input id="phone" value={draft.phone} onChange={set('phone')} />
        </div>
      </section>

      <div className="profile-actions">
        {savedNote && <span className="profile-saved">Profile updated</span>}
        <button className="btn-ghost" onClick={save}>
          Save changes
        </button>
        <button className="btn" onClick={logOut}>
          Log Out
        </button>
      </div>
    </AppShell>
  )
}
