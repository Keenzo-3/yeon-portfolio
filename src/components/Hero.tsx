import { useEffect, useRef, useState } from 'react'
import { config } from '../config'
import { useAudio } from '../audio/AudioProvider'
import { CopyIcon, CheckIcon, ChevronDownIcon } from './icons'

const roles = config.roleLines

export function Hero() {
  const audio = useAudio()
  const [copied, setCopied] = useState(false)
  const [roleIndex, setRoleIndex] = useState(0)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const id = window.setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), 3200)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 14
      const y = (e.clientY / window.innerHeight - 0.5) * 14
      setParallax({ x, y })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const copyDiscord = async () => {
    audio.playSfx('click')
    try {
      await navigator.clipboard.writeText(config.discordId)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = config.discordId
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2200)
  }

  const scrollTo = (target: string) => {
    audio.playSfx('click')
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-20 pt-28"
    >
      <div
        className="pointer-events-none absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: `translate(${parallax.x}px, ${parallax.y}px)` }}
        aria-hidden="true"
      >
        <div className="absolute left-[6%] top-[18%] hidden font-mono text-xs leading-relaxed text-white/25 sm:block">
          <p>{'const kaixel = {'}</p>
          <p className="pl-4">role: 'developer',</p>
          <p className="pl-4">craft: 'discord.bots',</p>
          <p className="pl-4">mind: 'cybersecurity',</p>
          <p>{'};'}</p>
        </div>
        <div className="absolute bottom-[20%] right-[8%] hidden font-mono text-xs leading-relaxed text-white/20 md:block">
          <p>&gt; ./kaixel --status</p>
          <p className="text-cyan/40">STATUS: BUILDING IN PUBLIC</p>
        </div>
      </div>

      <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
        <p className="mb-5 font-mono text-xs tracking-[0.45em] text-cyan/80 sm:text-sm">
          <span className="animate-pulse-glow">●</span> SYSTEM ONLINE · WELCOME
        </p>

        <h1
          className="glitch text-7xl font-bold tracking-tight text-white sm:text-8xl md:text-9xl"
          data-text={config.displayName}
        >
          {config.displayName}
        </h1>

        <div className="mt-6 h-7 font-mono text-sm tracking-[0.25em] text-ghost sm:text-base md:text-lg" aria-live="polite">
          <span className="text-cyan">&gt;</span> {roles[roleIndex]}
          <span className="animate-blink text-cyan">_</span>
        </div>

        <p className="mt-6 max-w-xl text-sm leading-relaxed text-ghost sm:text-base">{config.bio}</p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <div className="glass flex items-center gap-3 rounded-lg px-4 py-3">
            <div className="text-left">
              <p className="font-mono text-[10px] tracking-widest text-ghost">DISCORD ID</p>
              <p className="font-mono text-sm text-white">{config.discordId}</p>
            </div>
            <button
              onClick={copyDiscord}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-ghost transition hover:border-cyan/50 hover:text-cyan"
              aria-label={`Copy Discord ID ${config.discordId}`}
              title="Copy Discord ID"
            >
              {copied ? <CheckIcon size={16} className="text-mint" /> : <CopyIcon size={16} />}
            </button>
          </div>
          <div className="glass rounded-lg px-4 py-3 text-left">
            <p className="font-mono text-[10px] tracking-widest text-ghost">USERNAME</p>
            <p className="font-mono text-sm text-white">{config.discordUsername}</p>
          </div>
        </div>

        <p
          className={`mt-3 font-mono text-xs tracking-widest transition-opacity duration-300 ${
            copied ? 'text-mint opacity-100' : 'opacity-0'
          }`}
          aria-live="polite"
        >
          Discord ID copied.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => scrollTo('#works')}
            className="rounded-md border border-cyan/50 bg-cyan/10 px-6 py-3 font-mono text-xs tracking-widest text-cyan transition hover:bg-cyan/20 hover:shadow-glow"
          >
            EXPLORE MY WORKS
          </button>
          <button
            onClick={() => scrollTo('#cyberlab')}
            className="rounded-md border border-line px-6 py-3 font-mono text-xs tracking-widest text-white transition hover:border-cyan/40 hover:text-cyan"
          >
            CYBER LAB
          </button>
          <button
            onClick={() => scrollTo('#socials')}
            className="rounded-md border border-line px-6 py-3 font-mono text-xs tracking-widest text-white transition hover:border-cyan/40 hover:text-cyan"
          >
            SOCIALS
          </button>
          <button
            onClick={() => scrollTo('#contact')}
            className="rounded-md border border-line px-6 py-3 font-mono text-xs tracking-widest text-white transition hover:border-cyan/40 hover:text-cyan"
          >
            CONTACT
          </button>
        </div>
      </div>

      <button
        onClick={() => scrollTo('#about')}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ghost transition hover:text-cyan"
        aria-label="Scroll to About section"
      >
        <ChevronDownIcon size={28} className="animate-bounce" />
      </button>
    </section>
  )
}
