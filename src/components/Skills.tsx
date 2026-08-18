import { config } from '../config'
import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'
import { CodeIcon, BotIcon, GlobeIcon, ServerIcon, ShieldIcon, SettingsIcon } from './icons'

const icons = {
  Programming: CodeIcon,
  Discord: BotIcon,
  Web: GlobeIcon,
  Backend: ServerIcon,
  Cybersecurity: ShieldIcon,
  Tools: SettingsIcon,
}

export function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading
        kicker="// SKILLS"
        title="Arsenal of technologies"
        description="The tools and languages powering the builds — grouped, animated and editable."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(config.skills).map(([category, items], ci) => {
          const Icon = icons[category as keyof typeof icons] ?? CodeIcon
          return (
            <Reveal key={category} delay={ci * 80}>
              <div className="glass tilt-card group h-full rounded-2xl p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan/30 bg-cyan/5 text-cyan transition group-hover:shadow-glow-sm">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-mono text-sm tracking-widest text-white">{category.toUpperCase()}</h3>
                </div>
                <ul className="space-y-2.5">
                  {items.map((skill, i) => (
                    <li key={skill} className="group/item flex items-center gap-3">
                      <span className="flex-1 font-mono text-xs text-ghost transition group-hover/item:text-white">
                        {skill}
                      </span>
                      <span className="flex gap-0.5" aria-hidden="true">
                        {Array.from({ length: 5 }).map((_, bar) => (
                          <span
                            key={bar}
                            className={`h-1.5 w-3 rounded-sm transition-colors ${
                              bar < ((i + 2) % 5) + 1 ? 'bg-cyan/60' : 'bg-white/10'
                            }`}
                            style={{ transitionDelay: `${bar * 40}ms` }}
                          />
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
