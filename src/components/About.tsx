import { config } from '../config'
import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'
import { BotIcon, CpuIcon, CodeIcon, GlobeIcon, SparklesIcon, ZapIcon, ShieldIcon, LayersIcon } from './timeline-icons'

const interests = [
  { icon: BotIcon, label: 'Discord bots' },
  { icon: CpuIcon, label: 'Node.js' },
  { icon: CodeIcon, label: 'JavaScript / TypeScript' },
  { icon: GlobeIcon, label: 'Web development' },
  { icon: SparklesIcon, label: 'AI experiments' },
  { icon: ZapIcon, label: 'Automation' },
  { icon: ShieldIcon, label: 'Cybersecurity' },
  { icon: LayersIcon, label: 'Full-stack development' },
]

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading
        kicker="// ABOUT"
        title="The developer behind the screen"
        description="A curious mind building bots, software and defensive security visualizations — one experiment at a time."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <Reveal direction="left">
          <div className="glass relative overflow-hidden rounded-2xl p-8">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan/5 blur-3xl" aria-hidden="true" />
            <h3 className="mb-4 font-mono text-sm tracking-widest text-cyan">PROFILE.DIGEST</h3>
            <p className="text-sm leading-relaxed text-ghost">
              {config.name} is a developer focused on the intersection of Discord automation, web
              software and cybersecurity-inspired engineering. The mission is simple: build tools that
              feel polished, secure and slightly futuristic.
            </p>
            <ul className="mt-6 space-y-2 font-mono text-xs">
              <li className="flex gap-3 text-ghost">
                <span className="text-cyan">▸</span> ALIAS: <span className="text-white">{config.displayName}</span>
              </li>
              <li className="flex gap-3 text-ghost">
                <span className="text-cyan">▸</span> DISCORD ID: <span className="text-white">{config.discordId}</span>
              </li>
              <li className="flex gap-3 text-ghost">
                <span className="text-cyan">▸</span> MODE: <span className="text-mint">BUILDING</span>
              </li>
              <li className="flex gap-3 text-ghost">
                <span className="text-cyan">▸</span> THREAT LEVEL: <span className="text-mint">LOW</span>
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal direction="right">
          <div className="glass rounded-2xl p-8">
            <h3 className="mb-4 font-mono text-sm tracking-widest text-cyan">INTERESTS.DIRECTORY</h3>
            <div className="flex flex-wrap gap-3">
              {interests.map((item) => {
                const Icon = item.icon
                return (
                  <span
                    key={item.label}
                    className="tilt-card flex items-center gap-2 rounded-lg border border-line bg-white/[0.02] px-3 py-2 font-mono text-xs text-ghost transition hover:text-white"
                  >
                    <Icon size={15} className="text-cyan/70" />
                    {item.label}
                  </span>
                )
              })}
            </div>
            <p className="mt-6 text-xs leading-relaxed text-ghost/70">
              Everything here is driven by curiosity: when a problem looks interesting, it becomes the
              next project.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
