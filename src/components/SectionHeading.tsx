import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface SectionHeadingProps {
  kicker: string
  title: ReactNode
  description?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ kicker, title, description, align = 'center' }: SectionHeadingProps) {
  const alignCls = align === 'center' ? 'text-center items-center' : 'text-left items-start'
  return (
    <Reveal className={`mb-12 flex flex-col gap-4 ${alignCls}`}>
      <span className="font-mono text-xs tracking-[0.4em] text-cyan/80">{kicker}</span>
      <h2 className="text-gradient text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{title}</h2>
      {description && <p className="max-w-2xl text-sm leading-relaxed text-ghost sm:text-base">{description}</p>}
      <div className="h-px w-24 bg-gradient-to-r from-cyan/70 to-transparent" />
    </Reveal>
  )
}
