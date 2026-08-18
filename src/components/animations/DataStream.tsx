import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const GLYPHS = ['0', '1', 'A', 'B', 'C', 'D', 'E', 'F', '9', '7', '3', '5', '2', 'F', '0', '1', '8', '4', '6', 'C']

export function DataStream({ running, resetKey }: { running: boolean; resetKey: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let drops: number[] = []
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      width = rect?.width ?? 320
      height = rect?.height ?? 220
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cols = Math.max(4, Math.floor(width / 14))
      drops = Array.from({ length: cols }, () => Math.random() * -height)
    }

    const frame = (delta: number) => {
      ctx.fillStyle = 'rgba(5,7,10,0.12)'
      ctx.fillRect(0, 0, width, height)
      ctx.font = '11px JetBrains Mono, monospace'
      const step = (delta / 16) * 1.1
      for (let i = 0; i < drops.length; i++) {
        const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        const x = i * 14 + 4
        const y = drops[i]
        const head = Math.random() > 0.92
        ctx.fillStyle = head ? 'rgba(0,229,255,0.9)' : 'rgba(0,229,255,0.28)'
        ctx.fillText(glyph, x, y)
        drops[i] += step
        if (drops[i] > height && Math.random() > 0.975) drops[i] = Math.random() * -100
      }
    }

    resize()
    window.addEventListener('resize', resize)

    if (reduced) {
      ctx.clearRect(0, 0, width, height)
      ctx.font = '11px JetBrains Mono, monospace'
      for (let i = 0; i < drops.length; i++) {
        ctx.fillStyle = 'rgba(0,229,255,0.35)'
        ctx.fillText(GLYPHS[i % GLYPHS.length], i * 14 + 4, 12)
      }
    } else {
      let raf = 0
      let last = performance.now()
      const tick = (t: number) => {
        const delta = Math.min(t - last, 50)
        last = t
        if (running) frame(delta)
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
      return () => {
        cancelAnimationFrame(raf)
        window.removeEventListener('resize', resize)
      }
    }

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [running, resetKey, reduced])

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
}
