import type { CSSProperties, ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  as?: 'div' | 'section' | 'article' | 'li' | 'figure' | 'header'
  style?: CSSProperties
}

export function Reveal({ children, className = '', delay = 0, direction = 'up', as: Tag = 'div', style }: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>()

  const hidden =
    direction === 'up'
      ? 'translate-y-8'
      : direction === 'left'
        ? '-translate-x-10'
        : direction === 'right'
          ? 'translate-x-10'
          : ''

  return (
    <Tag
      ref={ref as never}
      className={`transition-all duration-700 ease-out will-change-transform ${inView ? 'translate-x-0 translate-y-0 opacity-100' : `${hidden} opacity-0`} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  )
}
