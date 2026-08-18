import { useEffect, useState } from 'react'
import { LockIcon } from '../icons'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const BINARY = ['0', '1', '1', '0', '1', '0', '0', '1']

export function EncryptionVis({ running, resetKey }: { running: boolean; resetKey: number }) {
  const reduced = useReducedMotion()
  const [step, setStep] = useState(0)
  const [jitter, setJitter] = useState(false)

  useEffect(() => {
    setStep(0)
    if (reduced) return
    const interval = window.setInterval(() => {
      if (running) setStep((s) => (s + 1) % 3)
    }, 1800)
    return () => window.clearInterval(interval)
  }, [running, resetKey, reduced])

  useEffect(() => {
    if (running && step === 1 && !reduced) {
      setJitter(true)
      const id = window.setTimeout(() => setJitter(false), 600)
      return () => window.clearTimeout(id)
    }
  }, [step, running, reduced])

  const locks = [0, 1, 2].map((i) => i <= step)

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-3" aria-hidden="true">
      <div className="flex items-center gap-3">
        <span className={`font-mono text-[10px] tracking-widest text-ghost ${step >= 0 ? 'opacity-100' : 'opacity-30'}`}>
          DATA
        </span>
        <span className="font-mono text-cyan">&rarr;</span>
        <div className={`relative rounded-md border px-3 py-2 transition ${step === 1 ? 'border-cyan/60 shadow-glow-sm' : 'border-line'}`}>
          <span className="font-mono text-[10px] tracking-widest text-cyan">ENCRYPTION</span>
          {step === 1 && !reduced && (
            <span className="absolute inset-0 flex items-center justify-center gap-1 rounded-md bg-black/70">
              {BINARY.map((b, i) => (
                <span key={i} className="animate-blink font-mono text-[10px]" style={{ animationDelay: `${i * 80}ms` }} >
                  {b}
                </span>
              ))}
            </span>
          )}
        </div>
        <span className="font-mono text-mint">&rarr;</span>
        <div className={`flex items-center gap-1.5 rounded-md border px-3 py-2 transition ${step === 2 ? 'border-mint/60 bg-mint/5 shadow-glow-sm' : 'border-line opacity-40'}`}>
          <LockIcon size={13} className="text-mint" />
          <span className="font-mono text-[10px] tracking-widest text-mint">SECURE DATA</span>
        </div>
      </div>

      <div className="flex gap-3">
        {locks.map((open, i) => (
          <div key={i} className={`flex flex-col items-center gap-1 transition ${open ? 'opacity-100' : 'opacity-25'}`}>
            <LockIcon size={18} className={open ? 'text-mint' : 'text-ghost'} />
            <span className="font-mono text-[8px] text-ghost/60">L{i + 1}</span>
          </div>
        ))}
      </div>

      <div className={`flex items-center gap-2 font-mono text-[9px] tracking-widest transition ${jitter ? 'text-cyan' : 'text-ghost/60'}`}>
        <span>AES-256 · SIMULATED</span>
        {step === 2 && <span className="text-mint">[VERIFIED]</span>}
      </div>
    </div>
  )
}
