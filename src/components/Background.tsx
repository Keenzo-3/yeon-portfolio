import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  life: number
  hue: number
}

interface Stream {
  x: number
  y: number
  speed: number
  chars: number
  charsDrawn: number
  accent: boolean
}

const BIN = ['0', '1']
const HEX = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']

export function Background({ intensity = 'normal' }: { intensity?: 'normal' | 'matrix' }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let particles: Particle[] = []
    let streams: Stream[] = []
    let width = 0
    let height = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const isMatrix = intensity === 'matrix'

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const initParticles = () => {
      const count = reducedMotion ? 10 : isMatrix ? 90 : 60
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -(0.1 + Math.random() * 0.25),
        r: 0.6 + Math.random() * 1.8,
        life: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.6 ? 1 : 0,
      }))
    }

    const initStreams = () => {
      const count = reducedMotion ? 0 : isMatrix ? 34 : 14
      const cols = Math.max(2, Math.floor(width / 42))
      streams = Array.from({ length: Math.min(count, cols) }, () => {
        const x = Math.random() * width
        const chars = 6 + Math.floor(Math.random() * 10)
        return {
          x,
          y: -Math.random() * height,
          speed: 0.6 + Math.random() * 1.3,
          chars,
          charsDrawn: 0,
          accent: Math.random() > 0.75,
        }
      })
    }

    const drawParticles = (t: number) => {
      for (const p of particles) {
        p.life += 0.01
        p.x += p.vx + Math.sin(p.life) * 0.15
        p.y += p.vy
        if (p.y < -10) {
          p.y = height + 10
          p.x = Math.random() * width
        }
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        const alpha = 0.35 + 0.3 * Math.sin(p.life * 2)
        const color = isMatrix ? '#00ff9d' : p.hue ? '#00e5ff' : '#e5e7eb'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = alpha
        ctx.shadowColor = color
        ctx.shadowBlur = 6
        ctx.fill()
      }
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
      void t
    }

    const drawStreams = (delta: number) => {
      ctx.font = isMatrix ? '13px JetBrains Mono, monospace' : '12px JetBrains Mono, monospace'
      for (const s of streams) {
        s.y += s.speed * delta * 0.016 * (reducedMotion ? 0.2 : 1)
        if (s.y > height + 40) {
          s.y = -40
          s.x = Math.random() * width
        }
        s.charsDrawn = Math.min(s.chars, Math.floor(s.y / 18) + 1)
        for (let i = 0; i < s.charsDrawn; i++) {
          const glyph = s.accent ? HEX[Math.floor(Math.random() * HEX.length)] : BIN[Math.floor(Math.random() * 2)]
          const yy = s.y - i * 18
          if (yy < 0 || yy > height) continue
          const head = i === s.charsDrawn - 1
          ctx.fillStyle = isMatrix
            ? head
              ? 'rgba(220,255,240,0.9)'
              : 'rgba(0,255,157,0.28)'
            : head
              ? 'rgba(255,255,255,0.8)'
              : s.accent
                ? 'rgba(0,229,255,0.25)'
                : 'rgba(180,190,200,0.16)'
          ctx.fillText(glyph, s.x, yy)
        }
      }
    }

    let last = performance.now()
    const tick = (t: number) => {
      const delta = Math.min(t - last, 50)
      last = t
      ctx.clearRect(0, 0, width, height)
      drawStreams(delta)
      drawParticles(t)
      raf = requestAnimationFrame(tick)
    }

    resize()
    initParticles()
    initStreams()

    if (reducedMotion) {
      ctx.clearRect(0, 0, width, height)
      drawParticles(0)
    } else {
      raf = requestAnimationFrame(tick)
    }

    const onResize = () => {
      resize()
      initParticles()
      initStreams()
    }
    window.addEventListener('resize', onResize)

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf)
      } else if (!reducedMotion) {
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reducedMotion, intensity])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div
        className={
          intensity === 'matrix'
            ? 'matrix-grid absolute inset-0 opacity-70'
            : 'animated-grid absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_78%)]'
        }
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.05)_0%,transparent_55%)]" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="scanlines absolute inset-0" />
      <div className="noise absolute inset-0" />
      <div className="vignette absolute inset-0" />
    </div>
  )
}
