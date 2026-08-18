import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { config } from '../config'
import { useLocalStorage } from '../hooks/useLocalStorage'

type SfxType =
  | 'typing'
  | 'key'
  | 'click'
  | 'boot'
  | 'scan'
  | 'ok'
  | 'glitch'
  | 'access'

interface AudioState {
  soundEnabled: boolean
  musicEnabled: boolean
  volume: number
  toggleSound: () => void
  toggleMusic: () => void
  setVolume: (v: number) => void
  playSfx: (type?: SfxType) => void
  enableOnUserGesture: () => void
}

const AudioContextCtx = createContext<AudioState | null>(null)

const DEFAULTS = {
  soundEnabled: false,
  musicEnabled: config.musicSettings.defaultEnabled,
  volume: config.musicSettings.defaultVolume,
}

function makeNoiseBuffer(ctx: AudioContext) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return buffer
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const { value: prefs, setValue: setPrefs } = useLocalStorage('yeon-audio-prefs', DEFAULTS)

  const [soundEnabled, setSoundEnabled] = useState(DEFAULTS.soundEnabled)
  const [musicEnabled, setMusicEnabled] = useState(DEFAULTS.musicEnabled)
  const [volume, setVolumeState] = useState(DEFAULTS.volume)

  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const ambientGainRef = useRef<GainNode | null>(null)
  const ambientNodesRef = useRef<AudioNode[]>([])
  const trackRef = useRef<HTMLAudioElement | null>(null)
  const noiseBufferRef = useRef<AudioBuffer | null>(null)
  const userGesturedRef = useRef(false)

  useEffect(() => {
    if (prefs && typeof prefs.soundEnabled === 'boolean') setSoundEnabled(prefs.soundEnabled)
    setMusicEnabled(true)
    setVolumeState(1)
  }, [])

  useEffect(() => {
    setPrefs({ soundEnabled, musicEnabled, volume })
  }, [soundEnabled, musicEnabled, volume, setPrefs])

  const ensureContext = useCallback(() => {
    if (ctxRef.current) {
      if (ctxRef.current.state === 'suspended') void ctxRef.current.resume()
      return ctxRef.current
    }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    const ctx = new AC()
    const master = ctx.createGain()
    master.gain.value = volume
    master.connect(ctx.destination)
    noiseBufferRef.current = makeNoiseBuffer(ctx)
    ctxRef.current = ctx
    masterRef.current = master
    return ctx
  }, [volume])

  const startAmbient = useCallback(() => {
    const ctx = ensureContext()
    const master = masterRef.current
    if (!ctx || !master) return

    const track = config.musicSettings.ambientTrack
    if (track && /^(https?:\/\/|\/)/.test(track)) {
      if (trackRef.current) return
      const el = new Audio(track)
      el.loop = true
      el.preload = 'auto'
      el.volume = volume
      trackRef.current = el
      el.play().catch(() => undefined)
      return
    }

    const ambientGain = ctx.createGain()
    ambientGain.gain.value = 0
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 420
    ambientGain.connect(filter)
    filter.connect(master)
    ambientGainRef.current = ambientGain

    const scale = [55, 65.41, 82.41, 98, 110, 130.81] as const
    const oscs: OscillatorNode[] = []
    scale.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = i % 2 === 0 ? 'sine' : 'triangle'
      osc.frequency.value = freq
      const g = ctx.createGain()
      g.gain.value = 0.035 + i * 0.004
      const lfo = ctx.createOscillator()
      lfo.frequency.value = 0.05 + i * 0.021
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 0.012
      lfo.connect(lfoGain)
      lfoGain.connect(g.gain)
      osc.connect(g)
      g.connect(ambientGain)
      osc.start()
      lfo.start()
      oscs.push(osc, lfo)
    })
    ambientNodesRef.current = [...oscs]
    ambientGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 3)
  }, [ensureContext])

  const stopAmbient = useCallback(() => {
    if (trackRef.current) {
      trackRef.current.pause()
      trackRef.current = null
    }
    const ctx = ctxRef.current
    if (!ctx || !ambientGainRef.current) return
    const g = ambientGainRef.current
    g.gain.cancelScheduledValues(ctx.currentTime)
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6)
    const nodes = ambientNodesRef.current
    window.setTimeout(() => {
      nodes.forEach((n) => {
        try {
          n.disconnect()
        } catch {
          /* noop */
        }
      })
    }, 800)
    ambientGainRef.current = null
    ambientNodesRef.current = []
  }, [])

  useEffect(() => {
    if (musicEnabled && userGesturedRef.current) startAmbient()
    else if (!musicEnabled) stopAmbient()
  }, [musicEnabled, startAmbient, stopAmbient])

  useEffect(() => {
    if (trackRef.current) trackRef.current.volume = volume
    if (masterRef.current) masterRef.current.gain.value = volume
  }, [volume])

  const playSfx = useCallback(
    (type: SfxType = 'click') => {
      if (!soundEnabled && type !== 'boot') return
      const ctx = ensureContext()
      const master = masterRef.current
      if (!ctx || !master || ctx.state !== 'running') return

      const now = ctx.currentTime
      const out = ctx.createGain()
      out.gain.value = 0.5
      out.connect(master)

      const noise = noiseBufferRef.current

      switch (type) {
        case 'typing':
        case 'key': {
          if (!noise) return
          const src = ctx.createBufferSource()
          src.buffer = noise
          const bp = ctx.createBiquadFilter()
          bp.type = 'bandpass'
          bp.frequency.value = type === 'typing' ? 2400 : 1400
          bp.Q.value = 1.4
          const g = ctx.createGain()
          g.gain.setValueAtTime(type === 'typing' ? 0.16 : 0.2, now)
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
          src.connect(bp).connect(g).connect(out)
          src.start(now, Math.random() * 0.2, 0.08)
          src.stop(now + 0.1)
          break
        }
        case 'click': {
          const osc = ctx.createOscillator()
          osc.type = 'square'
          osc.frequency.setValueAtTime(880, now)
          osc.frequency.exponentialRampToValueAtTime(520, now + 0.06)
          const g = ctx.createGain()
          g.gain.setValueAtTime(0.12, now)
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.07)
          osc.connect(g).connect(out)
          osc.start(now)
          osc.stop(now + 0.08)
          break
        }
        case 'scan': {
          const osc = ctx.createOscillator()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(220, now)
          osc.frequency.exponentialRampToValueAtTime(1320, now + 0.5)
          const g = ctx.createGain()
          g.gain.setValueAtTime(0.05, now)
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.55)
          osc.connect(g).connect(out)
          osc.start(now)
          osc.stop(now + 0.6)
          break
        }
        case 'ok': {
          const f = [660, 990]
          f.forEach((freq, i) => {
            const osc = ctx.createOscillator()
            osc.type = 'triangle'
            osc.frequency.value = freq
            const g = ctx.createGain()
            const t = now + i * 0.09
            g.gain.setValueAtTime(0.09, t)
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.22)
            osc.connect(g).connect(out)
            osc.start(t)
            osc.stop(t + 0.24)
          })
          break
        }
        case 'access': {
          const osc = ctx.createOscillator()
          osc.type = 'sawtooth'
          osc.frequency.setValueAtTime(180, now)
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.4)
          const g = ctx.createGain()
          g.gain.setValueAtTime(0.08, now)
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.45)
          osc.connect(g).connect(out)
          osc.start(now)
          osc.stop(now + 0.5)
          break
        }
        case 'glitch': {
          const osc = ctx.createOscillator()
          osc.type = 'square'
          osc.frequency.setValueAtTime(70, now)
          osc.frequency.linearRampToValueAtTime(320, now + 0.1)
          osc.frequency.linearRampToValueAtTime(90, now + 0.2)
          const g = ctx.createGain()
          g.gain.setValueAtTime(0.07, now)
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
          osc.connect(g).connect(out)
          osc.start(now)
          osc.stop(now + 0.28)
          break
        }
        case 'boot': {
          const osc = ctx.createOscillator()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(60, now)
          osc.frequency.linearRampToValueAtTime(220, now + 0.7)
          const g = ctx.createGain()
          g.gain.setValueAtTime(0.16, now)
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.8)
          osc.connect(g).connect(out)
          osc.start(now)
          osc.stop(now + 0.85)
          break
        }
      }
    },
    [ensureContext, soundEnabled],
  )

  const enableOnUserGesture = useCallback(() => {
    ensureContext()
    if (!userGesturedRef.current) {
      userGesturedRef.current = true
      if (musicEnabled) startAmbient()
      if (soundEnabled) playSfx('boot')
    }
  }, [ensureContext, playSfx, soundEnabled])

  const toggleSound = useCallback(() => {
    enableOnUserGesture()
    setSoundEnabled((s) => {
      if (!s) playSfx('click')
      return !s
    })
  }, [enableOnUserGesture, playSfx])

  const toggleMusic = useCallback(() => {
    enableOnUserGesture()
    setMusicEnabled(true)
  }, [enableOnUserGesture])

  const setVolume = useCallback((v: number) => {
    const next = Math.max(0, Math.min(1, v))
    setVolumeState(next)
    if (masterRef.current) masterRef.current.gain.value = next
    if (trackRef.current) trackRef.current.volume = next
  }, [])

  const value = useMemo<AudioState>(
    () => ({
      soundEnabled,
      musicEnabled,
      volume,
      toggleSound,
      toggleMusic,
      setVolume,
      playSfx,
      enableOnUserGesture,
    }),
    [soundEnabled, musicEnabled, volume, toggleSound, toggleMusic, setVolume, playSfx, enableOnUserGesture],
  )

  return <AudioContextCtx.Provider value={value}>{children}</AudioContextCtx.Provider>
}

export function useAudio() {
  const ctx = useContext(AudioContextCtx)
  if (!ctx) throw new Error('useAudio must be used within AudioProvider')
  return ctx
}
