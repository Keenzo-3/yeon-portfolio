import { useEffect, useRef, useState } from 'react'
import { useAudio } from '../audio/AudioProvider'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface Line {
  text: string
  kind: 'ok' | 'info' | 'online' | 'input' | 'output' | 'error' | 'warn' | 'typing'
}

const BOOT_SEQUENCE = [
  { text: '[KAIXEL SYSTEM]', kind: 'info' },
  { text: 'Loading Discord Bot Environment...', kind: 'typing' },
  { text: '[OK] Discord.js initialized', kind: 'ok' },
  { text: '[OK] MongoDB connection ready', kind: 'ok' },
  { text: '[OK] Command handler loaded', kind: 'ok' },
  { text: '[OK] Event handler loaded', kind: 'ok' },
  { text: '[OK] Security module loaded', kind: 'ok' },
  { text: '[OK] Music module loaded', kind: 'ok' },
  { text: '[ONLINE] Bot systems operational', kind: 'online' },
] as const

const kindColor: Record<Line['kind'], string> = {
  ok: 'text-mint',
  info: 'text-cyan',
  online: 'text-mint font-bold',
  input: 'text-white',
  output: 'text-ghost',
  error: 'text-alert',
  warn: 'text-amberx',
  typing: 'text-ghost',
}

interface DemoTerminalProps {
  onMatrix: () => void
  onBots: () => void
}

export function DemoTerminal({ onMatrix, onBots }: DemoTerminalProps) {
  const audio = useAudio()
  const reduced = useReducedMotion()
  const [lines, setLines] = useState<Line[]>([])
  const [input, setInput] = useState('')
  const [booting, setBooting] = useState(true)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const reducedRef = useRef(reduced)
  reducedRef.current = reduced
  const playSfxRef = useRef(audio.playSfx)
  playSfxRef.current = audio.playSfx

  useEffect(() => {
    let cancelled = false
    const reducedNow = reducedRef.current
    const at = (i: number) => (reducedNow ? i * 40 : i === 0 ? 400 : i === 1 ? 700 : 700 + (i - 1) * 380)
    BOOT_SEQUENCE.forEach((line, i) => {
      window.setTimeout(() => {
        if (cancelled) return
        setLines((prev) => [...prev, { text: line.text, kind: line.kind as Line['kind'] }])
        if (i === 1) {
          // typing animation for the loading line
          playSfxRef.current('typing')
        } else if (line.text.startsWith('[OK]')) {
          playSfxRef.current('ok')
        } else if (line.text.startsWith('[ONLINE]')) {
          playSfxRef.current('access')
        }
        if (i === BOOT_SEQUENCE.length - 1) setBooting(false)
      }, at(i))
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [lines, booting])

  const runCommand = (raw: string) => {
    const cmd = raw.trim()
    setLines((prev) => [...prev, { text: `kaixel@system:~$ ${cmd}`, kind: 'input' }])
    if (!cmd) return
    setHistory((h) => [...h, cmd])
    setHistoryIndex(-1)

    const lower = cmd.toLowerCase()
    let reply: Line | null = null
    let scrollTo: string | null = null
    let matrix = false

    if (lower === 'sudo kaixel') {
      reply = { text: 'Nice try. This is a portfolio simulation.', kind: 'warn' }
    } else if (lower === 'matrix') {
      matrix = true
      reply = { text: '[!] Matrix visual effect activated.', kind: 'online' }
    } else if (lower === 'coffee') {
      reply = { text: 'Coffee module initialized. energy levels: nominal', kind: 'ok' }
    } else if (lower === 'bots') {
      scrollTo = '#works'
      reply = { text: 'Opening MY WORKS — Discord Bots...', kind: 'output' }
    } else if (lower === 'help') {
      reply = {
        text: 'Commands: help, sudo kaixel, matrix, coffee, bots, clear',
        kind: 'output',
      }
    } else if (lower === 'clear') {
      setLines([])
      return
    } else if (/^\/\w+/.test(cmd)) {
      reply = { text: `[ERROR] "${cmd}" is not a bot command. Simulation only.`, kind: 'error' }
    } else {
      reply = { text: `[ERROR] Command not recognized: ${cmd}`, kind: 'error' }
    }

    audio.playSfx('key')
    window.setTimeout(() => {
      if (reply) {
        setLines((prev) => [...prev, reply!])
        if (reply.kind === 'ok') audio.playSfx('ok')
        if (reply.kind === 'error') audio.playSfx('glitch')
      }
      if (matrix) window.setTimeout(onMatrix, 400)
      if (scrollTo) window.setTimeout(onBots, 600)
    }, 350)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      runCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const idx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(idx)
      setInput(history[idx])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      const idx = historyIndex + 1
      if (idx >= history.length) {
        setHistoryIndex(-1)
        setInput('')
      } else {
        setHistoryIndex(idx)
        setInput(history[idx])
      }
    }
  }

  return (
    <div className="glass overflow-hidden rounded-2xl shadow-panel">
      <div className="flex items-center justify-between border-b border-line bg-white/[0.02] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-alert/70" />
          <span className="h-3 w-3 rounded-full bg-amberx/70" />
          <span className="h-3 w-3 rounded-full bg-mint/70" />
        </div>
        <p className="font-mono text-[11px] tracking-widest text-ghost">DISCORD DEVELOPMENT TERMINAL — SIMULATION</p>
        <div className="flex h-3 w-3 items-center justify-center">
          <span className="animate-blink text-mint">●</span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="h-72 overflow-y-auto px-4 py-4 font-mono text-[13px] leading-relaxed sm:h-80"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <p key={i} className={`whitespace-pre-wrap ${kindColor[line.kind]}`}>
            {line.text}
          </p>
        ))}
        {booting && (
          <p className="text-ghost">
            {BOOT_SEQUENCE[1].text}
            <span className="animate-blink text-cyan">_</span>
          </p>
        )}
        {!booting && (
          <div className="flex items-center gap-2">
            <span className="text-cyan">kaixel@system:~$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              className="flex-1 bg-transparent font-mono text-white caret-cyan outline-none"
              aria-label="Demo terminal command input"
              autoComplete="off"
              spellCheck={false}
            />
            <span className="animate-blink text-cyan">▊</span>
          </div>
        )}
      </div>

      <div className="border-t border-line bg-black/30 px-4 py-2 font-mono text-[10px] tracking-widest text-ghost/60">
        SAFE MODE · VISUAL DEMO ONLY · TRY: help | sudo kaixel | matrix | coffee | bots
      </div>
    </div>
  )
}