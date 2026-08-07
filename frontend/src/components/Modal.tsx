import React from 'react'

/* 836×423 dialog from the Figma "Saved Modal" / "DeleteModal" frames:
   grey body with a 32px primary-coloured title bar and a close X. */

interface ModalProps {
  title: string
  subtitle: string
  onClose: () => void
  children?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ title, subtitle, onClose, children }) => (
  <div className="modal-backdrop" onClick={onClose} role="presentation">
    <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
      <div className="modal-bar">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>
      <div className="modal-body">
        <div className="modal-title">{title}</div>
        <div className="modal-sub">{subtitle}</div>
      </div>
      {children}
    </div>
  </div>
)
