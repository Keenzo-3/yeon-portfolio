import { config } from '../config'
import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'
import { DiscordIcon, InstagramIcon, FacebookIcon, TikTokIcon, XIcon, YouTubeIcon, TelegramIcon } from './brand-icons'
import { MailIcon, ExternalIcon, CopyIcon, CheckIcon } from './icons'
import { useAudio } from '../audio/AudioProvider'
import { useState } from 'react'

const brandIcons = {
  Discord: DiscordIcon,
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  TikTok: TikTokIcon,
  Twitter: XIcon,
  YouTube: YouTubeIcon,
  Telegram: TelegramIcon,
  Email: MailIcon,
}

export function Socials() {
  const audio = useAudio()
  const [copied, setCopied] = useState(false)

  return (
    <section id="socials" className="relative mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading
        kicker="// SOCIALS"
        title="Connect across the grid"
        description="Hubs, handles and direct channels. Links are placeholders — edit them in src/config.ts."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {config.socialLinks.map((social, i) => {
          const Icon = brandIcons[social.platform] ?? MailIcon
          const isDiscord = social.platform === 'Discord'
          const isEmail = social.platform === 'Email'
          const isCopy = isDiscord || isEmail

          const handleClick = (e: React.MouseEvent) => {
            if (!social.url) {
              e.preventDefault()
              if (isCopy) {
                audio.playSfx('click')
                const value = isDiscord ? config.discordId : config.email
                if (navigator.clipboard) void navigator.clipboard.writeText(value).catch(() => undefined)
                setCopied(true)
                window.setTimeout(() => setCopied(false), 2000)
              }
            } else {
              audio.playSfx('click')
            }
          }

          return (
            <Reveal key={social.platform} delay={i * 60}>
              <div
                className="glass tilt-card group flex h-full flex-col rounded-2xl p-6"
                data-cursor="hover"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-line text-ghost transition group-hover:border-cyan/40 group-hover:text-cyan group-hover:shadow-glow-sm">
                  <Icon size={22} />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{social.platform}</h3>
                  {isDiscord && (
                    <button
                      onClick={handleClick}
                      className="rounded border border-line p-1 text-ghost transition hover:border-cyan/50 hover:text-cyan"
                      aria-label={`Copy Discord ID ${config.discordId}`}
                      title="Copy Discord ID"
                    >
                      {copied ? <CheckIcon size={12} className="text-mint" /> : <CopyIcon size={12} />}
                    </button>
                  )}
                </div>
                <p className="mt-1 font-mono text-xs tracking-widest text-cyan/80">{social.username}</p>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-ghost">{social.description}</p>
                <a
                  href={social.url || '#'}
                  onClick={handleClick}
                  target={social.url ? '_blank' : undefined}
                  rel={social.url ? 'noopener noreferrer' : undefined}
                  className="mt-5 flex items-center gap-2 font-mono text-[11px] tracking-widest text-ghost transition group-hover:text-cyan"
                  aria-label={social.url ? `Visit ${social.platform}` : `Copy ${isEmail ? 'email' : social.platform} contact`}
                >
                  {social.url ? (
                    <>
                      VISIT <ExternalIcon size={13} />
                    </>
                  ) : isCopy ? (
                    <>
                      {copied ? 'COPIED' : 'COPY CONTACT'} <CopyIcon size={13} />
                    </>
                  ) : (
                    <>
                      COMING SOON
                    </>
                  )}
                </a>
              </div>
            </Reveal>
          )
        })}
      </div>

      {copied && (
        <p className="mt-6 text-center font-mono text-xs tracking-widest text-mint" aria-live="polite">
          Discord ID copied.
        </p>
      )}
    </section>
  )
}
