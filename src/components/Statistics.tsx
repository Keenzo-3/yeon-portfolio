import { useEffect, useState } from 'react'
import { config } from '../config'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { Reveal } from './Reveal'

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 })
  const reduced = useReducedMotion()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setCurrent(value)
      return
    }
    const duration = 1600
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCurrent(Math.round(eased * value))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, reduced])

  return (
    <span ref={ref} className="text-gradient text-5xl font-bold tracking-tight sm:text-6xl">
      {current}
      <span className="text-cyan">{suffix}</span>
    </span>
  )
}

export function Statistics() {
  return (
    <section aria-label="Statistics" className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="glass relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.06),transparent_70%)]" aria-hidden="true" />
        <div className="relative grid grid-cols-2 gap-8 p-8 sm:p-12 lg:grid-cols-4">
          {config.statistics.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 100} className="flex flex-col items-center gap-2 text-center">
              <Counter value={stat.value} suffix={stat.suffix} />
              <span className="font-mono text-[11px] tracking-[0.3em] text-ghost">{stat.label.toUpperCase()}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
