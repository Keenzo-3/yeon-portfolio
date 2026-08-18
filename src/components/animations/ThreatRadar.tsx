import { useEffect, useState } from 'react'
import { RadarIcon, AlertIcon, CheckIcon } from '../icons'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const PHASES = [
  { label: 'THREAT DETECTED', color: 'text-alert', blip: true },
  { label: 'ANALYZING', color: 'text-amberx', blip: true },
  { label: 'THREAT BLOCKED', color: 'text-mint', blip: false },
] as const

export function ThreatRadar({ running, resetKey }: { running: boolean; resetKey: number }) {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    setPhase(0)
    if (reduced) return
    const interval = window.setInterval(() => {
      if (running) setPhase((p) => (p + 1) % PHASES.length)
    }, 2000)
    return () => window.clearInterval(interval)
  }, [running, resetKey, reduced])

  const current = PHASES[phase]
  const Icon = phase === 0 ? AlertIcon : phase === 1 ? RadarIcon : CheckIcon

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4" aria-hidden="true">
      <div className="relative h-36 w-36 sm:h-40 sm:w-40">
        <div className="absolute inset-0 rounded-full border border-line" />
        <div className="absolute inset-[18%] rounded-full border border-line/70" />
        <div className="absolute inset-[36%] rounded-full border border-line/50" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-line/60" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-line/60" />
        {phase === 0 && running && !reduced && (
          <span className="absolute left-[22%] top-[24%] h-2.5 w-2.5 animate-ping rounded-full bg-alert" />
        )}
        {phase === 0 && running && !reduced && (
          <span className="absolute left-[22%] top-[24%] h-2.5 w-2.5 rounded-full bg-alert shadow-[0_0_10px_#f43f5e]" />
        )}
        {phase === 2 && running && !reduced && (
          <span className="absolute left-[64%] top-[58%] h-2 w-2 rounded-full bg-mint shadow-[0_0_10px_#34d399]" />
        )}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div
            className={`radar-sweep absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,rgba(0,229,255,0.35),transparent_75deg)] ${
              running ? '' : '[animation-play-state:paused]'
            }`}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest">
        <Icon size={14} className={current.color} />
        <span className={`${current.color} transition-colors`}>{current.label}</span>
      </div>
    </div>
  )
}
