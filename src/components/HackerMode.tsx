import { useEffect, useRef, useState } from 'react'
import { useAudio } from '../audio/AudioProvider'

const LOGS = [
  '[SIM] Loading virtual terminal...',
  '[SIM] Matrix engine engaged',
  '[SIM] Scanline overlay: enabled',
  '[SIM] Simulated packet stream: demo',
  '[SIM] Encryption layer: visual only',
  '[SIM] Threat radar: fictional data',
  '[SIM] Network graph: decorative nodes',
  '[SIM] All operations are simulations',
]

export function HackerModeOverlay({ onExit }: { onExit: () => void }) {
  const audio = useAudio()
  const [count, setCount] = useState(0)
  const feedRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const id = window.setInterval(() => setCount((c) => c + 1), 1600)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight
  }, [count])

  const lines = Array.from({ length: count + 1 }, (_, i) => LOGS[i % LOGS.length]).slice(-7)

  return (
    <div aria-label="Hacker mode simulation overlay" className="pointer-events-none fixed inset-0 z-[70]">
      <div className="matrix-grid absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

      <div className="absolute left-4 top-24 max-w-xs">
        <div className="pointer-events-auto rounded-lg border border-mint/30 bg-black/70 p-3 font-mono text-[10px] leading-relaxed backdrop-blur-sm">
          <p className="mb-1 tracking-widest text-mint">SIMULATION FEED</p>
          <div ref={feedRef} className="max-h-40 overflow-hidden space-y-0.5">
            {lines.map((l, i) => (
              <p key={i} className={i === lines.length - 1 ? 'text-white' : 'text-mint/60'}>
                {l}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-24 flex flex-col items-end gap-3">
        <div className="pointer-events-auto flex items-center gap-2 rounded-lg border border-mint/40 bg-black/70 px-4 py-2 font-mono text-xs tracking-widest text-mint backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse-glow rounded-full bg-mint" />
          SIMULATION MODE
        </div>
        <button
          onClick={() => {
            audio.playSfx('glitch')
            onExit()
          }}
          className="pointer-events-auto rounded-md border border-alert/50 bg-black/70 px-4 py-2 font-mono text-xs tracking-widest text-alert backdrop-blur-sm transition hover:bg-alert/10 hover:shadow-glow"
        >
          EXIT SIMULATION
        </button>
      </div>

      <div className="absolute inset-0 scanlines opacity-60" aria-hidden="true" />
    </div>
  )
}

export function MatrixBurst({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = window.setTimeout(onDone, 8000)
    return () => window.clearTimeout(id)
  }, [onDone])

  return (
    <div aria-label="Matrix visual effect" className="pointer-events-none fixed inset-0 z-[70]">
      <div className="matrix-grid absolute inset-0" aria-hidden="true" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-sm tracking-[0.4em] text-mint">
        WAKE UP, kaixel...
      </div>
      <div className="absolute inset-0 scanlines opacity-40" aria-hidden="true" />
    </div>
  )
}
