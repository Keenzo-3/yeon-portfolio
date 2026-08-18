import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  pulse: number
}

interface Packet {
  from: number
  to: number
  progress: number
  speed: number
  color: string
}

export function NetworkVis({ running, resetKey }: { running: boolean; resetKey: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let nodes: Node[] = []
    let packets: Packet[] = []
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
    }

    const init = () => {
      const count = Math.max(7, Math.floor(width / 46))
      nodes = Array.from({ length: count }, (_, i) => ({
        x: 24 + (i / (count - 1)) * (width - 48) + (Math.random() - 0.5) * 30,
        y: 24 + Math.random() * (height - 48),
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: 2 + Math.random() * 2.5,
        pulse: Math.random() * Math.PI * 2,
      }))
      packets = []
    }

    const frame = (delta: number, t: number) => {
      ctx.clearRect(0, 0, width, height)
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        n.pulse += 0.02
        if (n.x < 14 || n.x > width - 14) n.vx *= -1
        if (n.y < 14 || n.y > height - 14) n.vy *= -1
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < 120) {
            ctx.strokeStyle = `rgba(0,229,255,${0.16 * (1 - dist / 120)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      if (running && packets.length < 4 && Math.random() < 0.02) {
        const from = Math.floor(Math.random() * nodes.length)
        let to = Math.floor(Math.random() * nodes.length)
        if (to === from) to = (to + 1) % nodes.length
        packets.push({ from, to, progress: 0, speed: 0.006 + Math.random() * 0.008, color: Math.random() > 0.5 ? '#00e5ff' : '#34d399' })
      }
      packets = packets.filter((p) => p.progress < 1)
      for (const p of packets) {
        p.progress += p.speed * (delta / 16)
        const a = nodes[p.from]
        const b = nodes[p.to]
        const x = a.x + (b.x - a.x) * p.progress
        const y = a.y + (b.y - a.y) * p.progress
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 6
        ctx.beginPath()
        ctx.arc(x, y, 2.2, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0
      for (const n of nodes) {
        const glow = 0.5 + 0.3 * Math.sin(n.pulse * 2)
        ctx.fillStyle = `rgba(0,229,255,${glow})`
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }
      void t
    }

    resize()
    init()
    window.addEventListener('resize', resize)

    let raf = 0
    let last = performance.now()
    const tick = (time: number) => {
      const delta = Math.min(time - last, 50)
      last = time
      frame(delta, time)
      raf = requestAnimationFrame(tick)
    }
    if (running) {
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }

    const onVis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden && running) {
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [running, resetKey])

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
}
