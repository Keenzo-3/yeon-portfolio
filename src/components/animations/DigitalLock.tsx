import { useEffect, useState } from 'react'
import { LockIcon, CheckIcon } from '../icons'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function DigitalLock({ running, resetKey }: { running: boolean; resetKey: number }) {
  const reduced = useReducedMotion()
  const [stage, setStage] = useState<'scan' | 'unlocked' | 'verified'>('scan')

  useEffect(() => {
    setStage('scan')
    if (!running || reduced) return
    const id = window.setTimeout(() => setStage('unlocked'), 2600)
    const id2 = window.setTimeout(() => setStage('verified'), 3600)
    const id3 = window.setTimeout(() => setStage('scan'), 5600)
    return () => {
      window.clearTimeout(id)
      window.clearTimeout(id2)
      window.clearTimeout(id3)
    }
  }, [running, resetKey, reduced])

  const locked = stage === 'scan'

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4" aria-hidden="true">
      <div className="relative">
        <svg width="84" height="84" viewBox="0 0 84 84" fill="none">
          <circle cx="42" cy="42" r="38" stroke={locked ? '#0e4d57' : '#0e7a55'} strokeWidth="2" opacity="0.7" />
          <circle
            cx="42"
            cy="42"
            r="38"
            stroke={locked ? '#00e5ff' : '#34d399'}
            strokeWidth="2"
            strokeDasharray="12 8"
            className="dash-flow"
            style={running && !reduced ? undefined : { animationPlayState: 'paused' }}
          />
          <g transform="translate(21 21)">
            <rect x="4" y="18" width="34" height="26" rx="4" stroke={locked ? '#9aa3ab' : '#34d399'} strokeWidth="2.5" fill="rgba(255,255,255,0.02)" />
            <path d="M10 18v-8a11 11 0 0 1 22 0v8" stroke={locked ? '#9aa3ab' : '#34d399'} strokeWidth="2.5" />
          </g>
          {stage === 'unlocked' && (
            <text x="42" y="118" textAnchor="middle" fill="#34d399" fontSize="11" fontFamily="monospace">
              UNLOCKED
            </text>
          )}
          {stage === 'verified' && (
            <text x="42" y="118" textAnchor="middle" fill="#34d399" fontSize="11" fontFamily="monospace">
              SECURITY VERIFIED
            </text>
          )}
        </svg>
        <div className="absolute -inset-3 overflow-hidden rounded-full">
          <div
            className={`radar-sweep absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_60deg,rgba(0,229,255,0.18)_120deg,transparent_180deg)] ${
              running && locked && !reduced ? '' : '[animation-play-state:paused]'
            }`}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest">
        {stage === 'verified' ? (
          <>
            <CheckIcon size={13} className="text-mint" />
            <span className="text-mint">SECURITY VERIFIED</span>
          </>
        ) : stage === 'unlocked' ? (
          <span className="text-cyan">CREDENTIALS VALIDATED</span>
        ) : (
          <span className="text-ghost">VERIFYING SECURITY</span>
        )}
      </div>
      {stage === 'scan' && running && !reduced && (
        <span className="flex items-center gap-2 font-mono text-[9px] text-ghost/70">
          <LockIcon size={11} className="text-cyan" />
          SCANNING ACCESS TOKENS...
        </span>
      )}
    </div>
  )
}
