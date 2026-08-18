import { useEffect, useState } from 'react'
import { config } from '../config'
import { useAudio } from '../audio/AudioProvider'
import { AudioControls } from './AudioControls'
import { MenuIcon, CloseIcon } from './icons'

export function Navbar() {
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const audio = useAudio()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = config.navLinks.map((l) => l.target.replace('#', ''))
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    audio.playSfx('click')
    if (mobileOpen) setMobileOpen(false)
    // fallback for JS-driven smooth scroll
    if (target.startsWith('#')) {
      const el = document.querySelector(target)
      if (el) {
        e.preventDefault()
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] transition-all duration-300 ${
        scrolled ? 'border-b border-line bg-void/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="Primary">
        <a
          href="#home"
          onClick={(e) => handleNav(e, '#home')}
          className="flex items-center gap-2 font-mono text-sm font-bold tracking-widest text-white transition hover:text-cyan"
        >
          <span className="text-cyan">&gt;_</span>
          {config.displayName}
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {config.navLinks.map((link) => (
            <a
              key={link.target}
              href={link.target}
              onClick={(e) => handleNav(e, link.target)}
              className={`relative rounded px-3 py-2 font-mono text-[11px] tracking-widest transition ${
                active === link.target.replace('#', '')
                  ? 'text-cyan'
                  : 'text-ghost hover:text-white'
              }`}
              aria-current={active === link.target.replace('#', '') ? 'true' : undefined}
            >
              {link.label}
              {active === link.target.replace('#', '') && (
                <span className="absolute inset-x-3 -bottom-0.5 h-px bg-cyan shadow-glow-sm" />
              )}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <AudioControls compact />
          </div>
          <button
            className="glass flex h-10 w-10 items-center justify-center rounded-md text-white lg:hidden"
            onClick={() => {
              audio.playSfx('click')
              setMobileOpen((o) => !o)
            }}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          id="mobile-menu"
          className="border-t border-line bg-void/95 backdrop-blur-xl lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">
            {config.navLinks.map((link) => (
              <a
                key={link.target}
                href={link.target}
                onClick={(e) => handleNav(e, link.target)}
                className={`border-b border-line/60 py-3 font-mono text-xs tracking-widest transition ${
                  active === link.target.replace('#', '') ? 'text-cyan' : 'text-ghost hover:text-white'
                }`}
                aria-current={active === link.target.replace('#', '') ? 'true' : undefined}
              >
                <span className="mr-2 text-cyan/50">▸</span>
                {link.label}
              </a>
            ))}
            <div className="mt-4 flex justify-start">
              <AudioControls compact />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
