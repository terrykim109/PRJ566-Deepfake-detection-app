import React from 'react'

/* Three-step tracker from the Figma: 128×115 ellipses joined by
   arrows. The reached step is filled with --secondary-text (#5D6978),
   the rest with --placeholder (#D9D9D9). */

const STEPS = [
  { icon: '/assets/icon-file.svg', label: 'Step 1. Upload' },
  { icon: '/assets/icon-clock.svg', label: 'Step 2. Processing' },
  { icon: '/assets/icon-smile.svg', label: 'Step 3. Results' },
]

export const StepIndicator: React.FC<{ step: 1 | 2 | 3 }> = ({ step }) => (
  <div className="steps">
    {STEPS.map((s, i) => (
      <React.Fragment key={s.label}>
        {i > 0 && <div className="step-arrow" />}
        <div className={`step-circle${i + 1 === step ? ' active' : ''}`}>
          <img src={s.icon} alt="" />
          <span>{s.label}</span>
        </div>
      </React.Fragment>
    ))}
  </div>
)
