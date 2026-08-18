import { useEffect, useRef, useState } from 'react'
import type { Bot } from '../config'
import { BotArtwork } from './BotArtwork'
import { useAudio } from '../audio/AudioProvider'
import { CloseIcon, ExternalIcon, CheckIcon, AlertIcon, SparklesIcon } from './icons'

interface BotModalProps {
  bot: Bot
  onClose: () => void
}

const statusColor: Record<Bot['status'], string> = {
  Online: 'text-mint border-mint/40 bg-mint/10',
  Beta: 'text-amberx border-amberx/40 bg-amberx/10',
  Concept: 'text-cyan border-cyan/40 bg-cyan/10',
  Archived: 'text-ghost border-line bg-white/5',
}

export function BotModal({ bot, onClose }: BotModalProps) {
  const audio = useAudio()
  const closeRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const [copied, setCopied] = useState(false)

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${bot.name} details`}
    >
      <div
        className="glass my-8 w-full max-w-3xl overflow-hidden rounded-2xl shadow-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <BotArtwork id={bot.artwork} className="h-44 w-full rounded-none sm:h-52" />
          <div className="absolute left-5 top-5">
            <span className={`rounded border px-2 py-1 font-mono text-[10px] tracking-widest ${statusColor[bot.status]}`}>
              ● {bot.status.toUpperCase()}
            </span>
          </div>
          <button
            ref={closeRef}
            onClick={() => {
              audio.playSfx('click')
              onClose()
            }}
            className="glass absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-md text-white transition hover:border-cyan/50 hover:text-cyan"
            aria-label="Close details"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline gap-3">
            <h3 className="glitch text-3xl font-bold tracking-tight text-white sm:text-4xl" data-text={bot.name}>
              {bot.name}
            </h3>
            <span className="font-mono text-xs tracking-widest text-ghost">{bot.tagline.toUpperCase()}</span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ghost sm:text-base">{bot.description}</p>

          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <div>
              <h4 className="mb-3 font-mono text-xs tracking-widest text-cyan">FEATURES.MODULES</h4>
              <ul className="space-y-2">
                {bot.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 font-mono text-xs text-ghost">
                    <CheckIcon size={13} className="shrink-0 text-mint" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-5">
              <div>
                <h4 className="mb-3 font-mono text-xs tracking-widest text-cyan">TECHNOLOGY.STACK</h4>
                <div className="flex flex-wrap gap-2">
                  {bot.technologies.map((t) => (
                    <span key={t} className="rounded border border-line bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-ghost">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-mono text-xs tracking-widest text-cyan">CLASSIFICATION</h4>
                <span className="rounded border border-cyan/30 bg-cyan/5 px-2 py-1 font-mono text-[11px] tracking-widest text-cyan">
                  {bot.category.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="mb-3 font-mono text-xs tracking-widest text-cyan">SCREENSHOTS.PREVIEW</h4>
            {bot.screenshots && bot.screenshots.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {bot.screenshots.map((src, i) => (
                  <img key={i} src={src} alt={`${bot.name} screenshot ${i + 1}`} className="rounded-lg border border-line" loading="lazy" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex h-24 items-center justify-center rounded-lg border border-line bg-white/[0.02] font-mono text-[10px] tracking-widest text-ghost/60"
                  >
                    <div className="flex items-center gap-2">
                      <SparklesIcon size={14} className="text-cyan/50" />
                      DEMO SHOT {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-2 font-mono text-[10px] tracking-widest text-ghost/50">
              Placeholder visuals — replace via config screenshot URLs.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
            {bot.invite ? (
              <a
                href={bot.invite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md border border-cyan/50 bg-cyan/10 px-4 py-2 font-mono text-xs tracking-widest text-cyan transition hover:bg-cyan/20 hover:shadow-glow"
              >
                <ExternalIcon size={14} /> DISCORD INVITE
              </a>
            ) : (
              <span className="flex items-center gap-2 rounded-md border border-line px-4 py-2 font-mono text-xs tracking-widest text-ghost/70">
                <AlertIcon size={14} /> INVITE: NOT AVAILABLE YET
              </span>
            )}
            {bot.website ? (
              <a
                href={bot.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md border border-line px-4 py-2 font-mono text-xs tracking-widest text-white transition hover:border-cyan/40 hover:text-cyan"
              >
                <ExternalIcon size={14} /> WEBSITE
              </a>
            ) : null}
            <button
              onClick={() => {
                audio.playSfx('click')
                if (navigator.clipboard) void navigator.clipboard.writeText(bot.name).catch(() => undefined)
                setCopied(true)
                window.setTimeout(() => setCopied(false), 1800)
              }}
              className="flex items-center gap-2 rounded-md border border-line px-4 py-2 font-mono text-xs tracking-widest text-ghost transition hover:border-cyan/40 hover:text-white"
            >
              {copied ? <CheckIcon size={14} className="text-mint" /> : <SparklesIcon size={14} />}
              {copied ? 'NAME COPIED' : 'COPY NAME'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
