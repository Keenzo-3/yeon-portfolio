import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const [enabled, setEnabled] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (coarse || reduced) return
    setEnabled(true)
    document.documentElement.classList.add('cursor-active')

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let hovering = false
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`
      const target = e.target as HTMLElement
      hovering = !!target.closest('a, button, [role="button"], input, textarea, select, .tilt-card, [data-cursor="hover"]')
    }

    const loop = () => {
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18
      const scale = hovering ? 1.6 : 1
      ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px) scale(${scale})`
      ring.style.borderColor = hovering ? 'rgba(0,229,255,0.7)' : 'rgba(255,255,255,0.35)'
      raf = requestAnimationFrame(loop)
    }

    const onDown = () => ring && (ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px) scale(0.8)`)
    const onUp = () => ring && (ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px) scale(${hovering ? 1.6 : 1})`)
    const onLeave = () => {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }
    const onEnter = () => {
      dot.style.opacity = '1'
      ring.style.opacity = '1'
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.documentElement.classList.remove('cursor-active')
    }
  }, [reduced])

  if (!enabled) return null

  return (
    <div aria-hidden="true" className="custom-cursor pointer-events-none fixed inset-0 z-[200]">
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-2 w-2 rounded-full bg-cyan shadow-glow-sm"
        style={{ transition: 'opacity 0.2s ease' }}
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-9 w-9 rounded-full border transition-colors duration-200"
        style={{ borderColor: 'rgba(255,255,255,0.35)' }}
      />
    </div>
  )
}
