import { useState } from 'react'
import { config } from '../config'
import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'
import { useAudio } from '../audio/AudioProvider'
import { MailIcon, SendIcon, TerminalIcon, CheckIcon, AlertIcon } from './contact-icons'
import { DiscordIcon, TelegramIcon, XIcon } from './brand-icons'

export function Contact() {
  const audio = useAudio()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    audio.playSfx('access')
    setSent(true)
    window.setTimeout(() => setSent(false), 4000)
    setForm({ name: '', email: '', message: '' })
  }

  const inputCls =
    'w-full rounded-md border border-line bg-white/[0.03] px-4 py-3 font-mono text-sm text-white placeholder:text-ghost/40 focus:border-cyan/50 transition'

  return (
    <section id="contact" className="relative mx-auto max-w-5xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading
        kicker="// CONTACT"
        title="Open a secure channel"
        description="Reach out for collaborations, commissions or just to talk about bots and security."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <Reveal direction="left">
          <form onSubmit={handleSubmit} className="glass space-y-4 rounded-2xl p-6 sm:p-8" aria-label="Contact form">
            <div className="mb-2 flex items-center gap-2 font-mono text-xs tracking-widest text-ghost">
              <TerminalIcon size={14} className="text-cyan" />
              MESSAGE.TRANSMIT
            </div>
            <div>
              <label htmlFor="contact-name" className="mb-1.5 block font-mono text-[11px] tracking-widest text-ghost">
                NAME
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={inputCls}
                placeholder="Your handle"
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-1.5 block font-mono text-[11px] tracking-widest text-ghost">
                EMAIL
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={inputCls}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="mb-1.5 block font-mono text-[11px] tracking-widest text-ghost">
                MESSAGE
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className={inputCls}
                placeholder="Type your message..."
              />
            </div>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-md border border-cyan/50 bg-cyan/10 px-6 py-3 font-mono text-xs tracking-widest text-cyan transition hover:bg-cyan/20 hover:shadow-glow"
            >
              <SendIcon size={15} />
              TRANSMIT
            </button>

            <div className="flex items-center gap-2 rounded-lg border border-amberx/25 bg-amberx/5 p-3">
              <AlertIcon size={14} className="shrink-0 text-amberx" />
              <p className="text-[11px] leading-relaxed text-ghost">
                <span className="font-bold text-amberx">DEMO MODE</span> — no backend is connected. Messages are
                simulated locally. Connect a service (Formspree, Netlify Forms, etc.) for real delivery.
              </p>
            </div>
            {sent && (
              <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-mint" aria-live="polite">
                <CheckIcon size={14} /> MESSAGE QUEUED (DEMO) — THANK YOU.
              </p>
            )}
          </form>
        </Reveal>

        <Reveal direction="right">
          <div className="flex h-full flex-col gap-4">
            <div className="glass flex items-center gap-4 rounded-2xl p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan/30 bg-cyan/5 text-cyan">
                <DiscordIcon size={22} />
              </div>
              <div>
                <p className="font-mono text-xs tracking-widest text-ghost">DISCORD</p>
                <p className="font-mono text-sm text-white">{config.discordId}</p>
              </div>
            </div>
            <div className="glass flex items-center gap-4 rounded-2xl p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan/30 bg-cyan/5 text-cyan">
                <MailIcon size={22} />
              </div>
              <div>
                <p className="font-mono text-xs tracking-widest text-ghost">EMAIL</p>
                <p className="font-mono text-sm text-white">{config.email}</p>
              </div>
            </div>
            <div className="glass flex items-center gap-4 rounded-2xl p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan/30 bg-cyan/5 text-cyan">
                <TelegramIcon size={22} />
              </div>
              <div>
                <p className="font-mono text-xs tracking-widest text-ghost">TELEGRAM</p>
                <p className="font-mono text-sm text-white">@USERNAME</p>
              </div>
            </div>
            <div className="glass flex items-center gap-4 rounded-2xl p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan/30 bg-cyan/5 text-cyan">
                <XIcon size={22} />
              </div>
              <div>
                <p className="font-mono text-xs tracking-widest text-ghost">X / TWITTER</p>
                <p className="font-mono text-sm text-white">@USERNAME</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}