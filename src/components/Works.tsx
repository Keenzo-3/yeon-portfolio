import { useMemo, useRef, useState } from 'react'
import { config } from '../config'
import type { Bot } from '../config'
import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'
import { BotArtwork } from './BotArtwork'
import { BotModal } from './BotModal'
import { useAudio } from '../audio/AudioProvider'
import { SearchIcon, CheckIcon, ExternalIcon, SparklesIcon, AlertIcon, BotIcon, LayersIcon } from './icons'

const CATEGORIES = ['All', 'Security', 'Economy', 'Music', 'Utility', 'AI', 'Moderation', 'Other'] as const

const statusColor: Record<Bot['status'], string> = {
  Online: 'text-mint border-mint/40 bg-mint/10',
  Beta: 'text-amberx border-amberx/40 bg-amberx/10',
  Concept: 'text-cyan border-cyan/40 bg-cyan/10',
  Archived: 'text-ghost border-line bg-white/5',
}

function useTilt() {
  const ref = useRef<HTMLDivElement | null>(null)
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || !window.matchMedia('(pointer: fine)').matches) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-2px)`
  }
  const onMouseLeave = () => {
    const el = ref.current
    if (el) el.style.transform = ''
  }
  return { ref, onMouseMove, onMouseLeave }
}

function BotCard({ bot, onOpen }: { bot: Bot; onOpen: (b: Bot) => void }) {
  const audio = useAudio()
  const tilt = useTilt()
  const [inviteCopied, setInviteCopied] = useState(false)

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="tilt-card glass flex flex-col overflow-hidden rounded-2xl transition-shadow"
      data-cursor="hover"
    >
      <div className="relative">
        <BotArtwork id={bot.artwork} className="h-40 w-full rounded-none" />
        <span className={`absolute left-3 top-3 rounded border px-2 py-1 font-mono text-[10px] tracking-widest ${statusColor[bot.status]}`}>
          ● {bot.status.toUpperCase()}
        </span>
        <span className="absolute right-3 top-3 rounded border border-line bg-black/50 px-2 py-1 font-mono text-[10px] tracking-widest text-ghost backdrop-blur-sm">
          {bot.category.toUpperCase()}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="glitch text-xl font-bold tracking-tight text-white" data-text={bot.name}>
            {bot.name}
          </h3>
        </div>
        <p className="mt-1 font-mono text-[11px] tracking-widest text-cyan/80">{bot.tagline.toUpperCase()}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ghost">{bot.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {bot.technologies.slice(0, 4).map((t) => (
            <span key={t} className="rounded border border-line bg-white/[0.02] px-1.5 py-0.5 font-mono text-[10px] text-ghost">
              {t}
            </span>
          ))}
          {bot.technologies.length > 4 && (
            <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ghost/60">
              +{bot.technologies.length - 4}
            </span>
          )}
        </div>

        <ul className="mt-4 grid grid-cols-1 gap-1.5">
          {bot.features.slice(0, 4).map((f) => (
            <li key={f} className="flex items-center gap-2 font-mono text-[11px] text-ghost">
              <CheckIcon size={11} className="shrink-0 text-mint" />
              <span className="truncate">{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          <button
            onClick={() => {
              audio.playSfx('click')
              onOpen(bot)
            }}
            className="rounded-md border border-cyan/50 bg-cyan/10 px-3 py-1.5 font-mono text-[11px] tracking-widest text-cyan transition hover:bg-cyan/20 hover:shadow-glow-sm"
          >
            DETAILS
          </button>
          {bot.invite ? (
            <a
              href={bot.invite}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] tracking-widest text-white transition hover:border-cyan/40 hover:text-cyan"
            >
              INVITE
            </a>
          ) : (
            <button
              onClick={() => {
                audio.playSfx('click')
                setInviteCopied(true)
                window.setTimeout(() => setInviteCopied(false), 1600)
              }}
              className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] tracking-widest text-ghost/70 transition hover:border-cyan/40 hover:text-cyan"
              title="Invite link not configured"
            >
              {inviteCopied ? 'PENDING...' : 'INVITE SOON'}
            </button>
          )}
          {bot.website ? (
            <a
              href={bot.website}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto rounded-md p-1.5 text-ghost transition hover:text-cyan"
              aria-label={`Open ${bot.name} website`}
            >
              <ExternalIcon size={15} />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function CustomProjectCard({ project }: { project: (typeof config.projects)[number] }) {
  return (
    <div className="tilt-card glass flex flex-col rounded-2xl p-5" data-cursor="hover">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan/30 bg-cyan/5 text-cyan">
          <SparklesIcon size={20} />
        </div>
        <div>
          <h3 className="font-bold text-white">{project.name}</h3>
          <p className="font-mono text-[11px] tracking-widest text-cyan/70">{project.category.toUpperCase()}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ghost">{project.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.technologies.map((t) => (
          <span key={t} className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ghost">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-auto flex items-center gap-3 pt-5">
        <span className="rounded border border-amberx/30 bg-amberx/5 px-2 py-1 font-mono text-[10px] tracking-widest text-amberx">
          {project.status.toUpperCase()}
        </span>
        {project.links?.map((l) => (
          <a
            key={l.url}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto font-mono text-[11px] tracking-widest text-cyan hover:underline"
          >
            {l.label.toUpperCase()}
          </a>
        ))}
      </div>
    </div>
  )
}

export function Works() {
  const audio = useAudio()
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Bot | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return config.discordBots.filter((bot) => {
      const matchesCategory = category === 'All' || bot.category === category
      const haystack = [bot.name, bot.tagline, bot.description, ...bot.technologies, ...bot.features]
        .join(' ')
        .toLowerCase()
      return matchesCategory && (q === '' || haystack.includes(q))
    })
  }, [category, query])

  return (
    <section id="works" className="relative mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading
        kicker="// MY WORKS"
        title={
          <>
            MY WORKS —{' '}
            <span className="text-gradient-cyan">Discord Bots &amp; Software Projects</span>
          </>
        }
        description="Premium Discord bot ecosystems built with care. Everything below is editable from the central configuration file."
      />

      <Reveal className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                audio.playSfx('click')
                setCategory(c)
              }}
              className={`rounded-md border px-3 py-1.5 font-mono text-[11px] tracking-widest transition ${
                category === c
                  ? 'border-cyan/60 bg-cyan/10 text-cyan shadow-glow-sm'
                  : 'border-line text-ghost hover:border-cyan/40 hover:text-white'
              }`}
              aria-pressed={category === c}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="relative lg:w-72">
          <SearchIcon size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ghost" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects..."
            aria-label="Search projects"
            className="w-full rounded-md border border-line bg-white/[0.03] py-2 pl-10 pr-3 font-mono text-xs text-white placeholder:text-ghost/50 focus:border-cyan/50"
          />
        </div>
      </Reveal>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((bot, i) => (
            <Reveal key={bot.id} delay={Math.min(i, 6) * 70}>
              <BotCard bot={bot} onOpen={setSelected} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="glass flex flex-col items-center gap-3 rounded-2xl py-16 text-center">
          <BotIcon size={36} className="text-ghost/50" />
          <p className="font-mono text-sm text-ghost">No projects match that filter.</p>
          <button
            onClick={() => {
              setQuery('')
              setCategory('All')
            }}
            className="rounded border border-cyan/40 px-4 py-2 font-mono text-xs tracking-widest text-cyan transition hover:bg-cyan/10"
          >
            RESET FILTERS
          </button>
        </div>
      )}

      <Reveal className="mt-20">
        <div className="mb-8 flex items-center gap-3">
          <LayersIcon size={20} className="text-cyan" />
          <h3 className="text-gradient text-xl font-bold tracking-tight sm:text-2xl">CUSTOM DISCORD PROJECTS</h3>
          <span className="font-mono text-xs text-ghost">— add unlimited projects in config</span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {config.projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 80}>
              <CustomProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-12">
        <div className="glass flex items-start gap-3 rounded-xl border-amberx/20 p-4">
          <AlertIcon size={18} className="mt-0.5 shrink-0 text-amberx" />
          <p className="text-xs leading-relaxed text-ghost">
            Invite links and websites are placeholders. No real invitation URLs are fabricated — configure
            them in <code className="text-cyan">src/config.ts</code>.
          </p>
        </div>
      </Reveal>

      {selected && <BotModal bot={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
