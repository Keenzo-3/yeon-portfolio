import { config } from '../config'
import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'
import { useInView } from '../hooks/useInView'

export function Journey() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 })

  return (
    <section id="journey" className="relative mx-auto max-w-5xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading
        kicker="// JOURNEY"
        title="Developer timeline"
        description="An editable map of the path so far — from first script to shipped projects."
      />

      <div ref={ref} className="relative ml-3 border-l border-line sm:ml-5">
        {config.timeline.map((entry, i) => (
          <Reveal key={entry.year} delay={i * 80} className="relative pb-10 pl-8 sm:pl-12">
            <span
              className={`absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border transition-colors ${
                inView ? 'border-cyan bg-cyan shadow-glow-sm' : 'border-line bg-carbon'
              }`}
              aria-hidden="true"
            />
            <div className="flex flex-col gap-1">
              <span className="font-mono text-xs tracking-widest text-cyan">{entry.year}</span>
              <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
              <p className="max-w-xl text-sm leading-relaxed text-ghost">{entry.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
