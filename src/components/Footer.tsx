import { config } from '../config'
import { useAudio } from '../audio/AudioProvider'
import { DiscordIcon, InstagramIcon, FacebookIcon, TikTokIcon, XIcon, YouTubeIcon, TelegramIcon } from './brand-icons'
import { MailIcon } from './icons'

const icons = {
  Discord: DiscordIcon,
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  TikTok: TikTokIcon,
  Twitter: XIcon,
  YouTube: YouTubeIcon,
  Telegram: TelegramIcon,
  Email: MailIcon,
}

export function Footer() {
  const audio = useAudio()
  return (
    <footer className="relative border-t border-line bg-void/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center gap-6">
          <a
            href="#home"
            onClick={() => audio.playSfx('click')}
            className="font-mono text-xl font-bold tracking-widest text-white transition hover:text-cyan"
          >
            <span className="text-cyan">&gt;_</span> {config.displayName}
          </a>

          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-4">
            {config.navLinks.map((link) => (
              <a
                key={link.target}
                href={link.target}
                onClick={() => audio.playSfx('click')}
                className="font-mono text-[11px] tracking-widest text-ghost transition hover:text-cyan"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {config.socialLinks.map((social) => {
              const Icon = icons[social.platform] ?? MailIcon
              const cls =
                'flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ghost transition hover:border-cyan/40 hover:text-cyan hover:shadow-glow-sm'
              if (!social.url) {
                return (
                  <span
                    key={social.platform}
                    className={cls}
                    title={`${social.platform} — placeholder, add a link in config`}
                    aria-label={`${social.platform} (no link configured)`}
                  >
                    <Icon size={18} />
                  </span>
                )
              }
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cls}
                  aria-label={social.platform}
                >
                  <Icon size={18} />
                </a>
              )
            })}
          </div>

          <div className="h-px w-48 bg-gradient-to-r from-transparent via-line to-transparent" />

          <p className="text-center font-mono text-xs text-ghost">
            © 2026 {config.name}. Built with curiosity and code.
          </p>
          <p className="max-w-md text-center font-mono text-[10px] leading-relaxed tracking-widest text-ghost/60">
            Cybersecurity visuals are simulated for demonstration purposes.
          </p>
        </div>
      </div>
    </footer>
  )
}
