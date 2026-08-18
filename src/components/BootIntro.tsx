import { useCallback, useEffect, useRef, useState } from 'react'
import { config } from '../config'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useAudio } from '../audio/AudioProvider'
import { VolumeOnIcon, VolumeOffIcon } from './icons'

type Phase = 'cursor' | 'typing' | 'logs' | 'scan' | 'progress' | 'access' | 'reveal' | 'done'

const SPEED = 28
const LOG_DELAY = 300

export function BootIntro({ onComplete }: { onComplete: () => void }) {
  const { value: pref, setValue: setPref } = useLocalStorage('kaixel-intro-done', false)
  const reduced = useReducedMotion()
  const audio = useAudio()

  const [phase, setPhase] = useState<Phase>('cursor')
  const [typed, setTyped] = useState('')
  const [logCount, setLogCount] = useState(0)
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const [displayed, setDisplayed] = useState(true)
  const timersRef = useRef<number[]>([])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t))
    timersRef.current = []
  }, [])

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timersRef.current.push(id)
  }, [])

  // cursor -> typing
  useEffect(() => {
    if (phase !== 'cursor') return
    later(() => setPhase('typing'), reduced ? 250 : 750)
  }, [phase, later, reduced])

  // typing header
  useEffect(() => {
    if (phase !== 'typing') return
    const target = `INITIALIZING ${config.name.toUpperCase()} SYSTEM...`
    if (typed.length < target.length) {
      const id = window.setTimeout(() => {
        setTyped(target.slice(0, typed.length + 1))
        if (!reduced) audio.playSfx('typing')
      }, reduced ? SPEED * 0.4 : SPEED)
      timersRef.current.push(id)
      return () => window.clearTimeout(id)
    }
    later(() => setPhase('logs'), 350)
  }, [phase, typed, later, reduced, audio])

  // boot logs
  useEffect(() => {
    if (phase !== 'logs') return
    if (logCount < config.bootLogs.length) {
      const id = window.setTimeout(() => {
        setLogCount((c) => c + 1)
        if (!reduced) audio.playSfx('ok')
      }, reduced ? LOG_DELAY * 0.4 : LOG_DELAY)
      timersRef.current.push(id)
      return () => window.clearTimeout(id)
    }
    later(() => setPhase('scan'), 400)
  }, [phase, logCount, later, reduced, audio])

  // scan phase -> progress
  useEffect(() => {
    if (phase !== 'scan') return
    if (!reduced) audio.playSfx('scan')
    later(() => setPhase('progress'), reduced ? 800 : 2200)
  }, [phase, later, reduced, audio])

  // progress
  useEffect(() => {
    if (phase !== 'progress') return
    const stepMs = reduced ? 12 : 24
    const interval = window.setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + (reduced ? 6 : 2))
        if (next >= 100) window.clearInterval(interval)
        return next
      })
    }, stepMs)
    timersRef.current.push(interval)
    return () => window.clearInterval(interval)
  }, [phase, reduced])

  // progress -> access
  useEffect(() => {
    if (phase !== 'progress' || progress < 100) return
    later(() => setPhase('access'), 300)
  }, [phase, progress, later])

  // access -> reveal
  useEffect(() => {
    if (phase !== 'access') return
    if (!reduced) audio.playSfx('access')
    later(() => setPhase('reveal'), reduced ? 500 : 1100)
  }, [phase, later, reduced, audio])

  const finish = useCallback(() => {
    setPref(true)
    audio.enableOnUserGesture()
    clearTimers()
    setFadeOut(true)
    later(() => {
      setDisplayed(false)
      onComplete()
    }, 600)
  }, [setPref, audio, clearTimers, later, onComplete])

  const skip = useCallback(() => {
    setPref(true)
    audio.enableOnUserGesture()
    clearTimers()
    setFadeOut(true)
    later(() => {
      setDisplayed(false)
      onComplete()
    }, 200)
  }, [setPref, audio, clearTimers, later, onComplete])

  if (pref || !displayed) return null

  const progressBlocks = Math.round(progress / 6.25)
  const logDone = Math.min(logCount, config.bootLogs.length)

  return (
    <div
      role="dialog"
      aria-label="System boot intro"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030405] px-6 transition-opacity duration-700 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="absolute right-4 top-4 z-10 flex items-center gap-3">
        <button
          onClick={() => (audio.soundEnabled ? audio.toggleSound() : (audio.enableOnUserGesture(), audio.toggleSound()))}
          className="glass flex h-10 w-10 items-center justify-center rounded-md text-ghost transition hover:text-cyan focus-visible:text-cyan"
          aria-label={audio.soundEnabled ? 'Disable boot sounds' : 'Enable boot sounds'}
        >
          {audio.soundEnabled ? <VolumeOnIcon size={18} /> : <VolumeOffIcon size={18} />}
        </button>
        <button
          onClick={skip}
          className="glass rounded-md px-4 py-2 font-mono text-xs tracking-widest text-ghost transition hover:border-cyan/40 hover:text-cyan"
        >
          SKIP INTRO
        </button>
      </div>

      <div className="w-full max-w-xl font-mono text-sm sm:text-base">
        {phase === 'cursor' && (
          <div className="flex items-center gap-2 text-cyan">
            <span className="h-5 w-3 animate-blink bg-cyan/80" />
            <span className="text-ghost">waiting for operator…</span>
          </div>
        )}

        {phase === 'typing' && (
          <div className="flex items-center gap-2 text-white">
            <span className="text-cyan">&gt;</span>
            <span>{typed}</span>
            <span className="h-5 w-3 animate-blink bg-cyan/80" />
          </div>
        )}

        {phase === 'logs' && (
          <div className="space-y-1.5">
            <div className="text-white">
              <span className="text-cyan">&gt;</span> INITIALIZING {config.name.toUpperCase()} SYSTEM...
            </div>
            {config.bootLogs.slice(0, logDone).map((log, i) => (
              <div key={i} className={log.startsWith('[OK]') ? 'text-mint/90' : 'text-ghost'}>
                <span className="mr-2 text-cyan/50">▸</span>
                {log}
              </div>
            ))}
            <span className="inline-block h-5 w-3 animate-blink bg-cyan/80" />
          </div>
        )}

        {phase === 'scan' && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="relative h-44 w-44 sm:h-52 sm:w-52">
              <div className="absolute inset-0 rounded-full border border-cyan/30" />
              <div className="absolute inset-4 rounded-full border border-cyan/20" />
              <div className="absolute inset-8 rounded-full border border-cyan/15" />
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="radar-sweep absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,rgba(0,229,255,0.5),transparent_70deg)]" />
              </div>
              <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan shadow-glow-sm" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border border-cyan/40" style={{ width: '30%', height: '30%' }} />
            </div>
            <p className="animate-pulse-glow tracking-[0.3em] text-cyan">SECURITY SCAN IN PROGRESS</p>
          </div>
        )}

        {phase === 'progress' && (
          <div className="space-y-3 py-4">
            <div className="flex justify-between text-xs text-ghost">
              <span>SYSTEM INITIALIZATION</span>
              <span className="text-cyan">{progress}%</span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-sm border border-line bg-black/40">
              <div
                className="h-full bg-gradient-to-r from-cyan/70 to-cyan shadow-glow-sm transition-[width] duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="font-mono text-xs tracking-widest text-cyan/80">
              {'█'.repeat(progressBlocks)}
              <span className="text-white/20">{'█'.repeat(16 - progressBlocks)}</span>
            </div>
          </div>
        )}

        {phase === 'access' && (
          <div className="py-4 text-center">
            <p className="glitch text-lg font-bold tracking-[0.4em] text-mint" data-text="ACCESS GRANTED">
              ACCESS GRANTED
            </p>
          </div>
        )}

        {phase === 'reveal' && (
          <div className="flex flex-col items-center gap-8 py-6 text-center">
            <p className="glitch font-mono text-6xl font-bold tracking-[0.2em] text-white sm:text-8xl" data-text={config.displayName}>
              {config.displayName}
            </p>
            <div className="h-px w-40 bg-gradient-to-r from-transparent via-cyan/60 to-transparent" />
            <p className="font-mono text-xs tracking-[0.35em] text-ghost">
              DEVELOPER · DISCORD BOT CREATOR · CYBERSECURITY
            </p>
            <button
              onClick={finish}
              className="group relative rounded-md border border-cyan/40 px-8 py-3 font-mono text-sm tracking-[0.3em] text-cyan transition hover:bg-cyan/10 hover:shadow-glow"
            >
              ENTER PORTFOLIO
              <span className="absolute inset-0 -z-10 animate-pulse-glow bg-cyan/10 opacity-0 blur-xl transition group-hover:opacity-100" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
