import { useEffect, useRef, useState } from 'react'
import { ShieldIcon, LockIcon, AlertIcon } from '../icons'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface Packet {
  id: number
  x: number
  status: 'flying' | 'blocked' | 'allowed'
  color: string
}

export function Firewall({ running, resetKey }: { running: boolean; resetKey: number }) {
  const reduced = useReducedMotion()
  const [packets, setPackets] = useState<Packet[]>([])
  const [stats, setStats] = useState({ blocked: 0, allowed: 0 })
  const packetsRef = useRef<Packet[]>([])
  const idRef = useRef(0)
  const runningRef = useRef(running)
  runningRef.current = running

  useEffect(() => {
    packetsRef.current = []
    idRef.current = 0
    setStats({ blocked: 0, allowed: 0 })
    if (reduced) {
      setPackets([
        { id: 1, x: 90, status: 'blocked', color: '#f43f5e' },
        { id: 2, x: 25, status: 'allowed', color: '#34d399' },
      ])
      return
    }
    setPackets([])

    let raf = 0
    let last = performance.now()
    const speed = 0.22

    const tick = (t: number) => {
      const delta = Math.min(t - last, 50)
      last = t
      if (runningRef.current) {
        let next = packetsRef.current.map((p) => ({ ...p, x: p.x + speed * delta }))
        if (Math.random() < 0.03 && next.length < 8) {
          idRef.current += 1
          next = [...next, { id: idRef.current, x: -10, status: 'flying' as const, color: Math.random() > 0.5 ? '#e5e7eb' : '#00e5ff' }]
        }
        let blocked = 0
        let allowed = 0
        const processed: Packet[] = []
        next.forEach((p) => {
          if (p.status === 'flying' && p.x >= 46) {
            if (Math.random() > 0.55) {
              processed.push({ ...p, status: 'blocked', color: '#f43f5e' })
              blocked += 1
            } else {
              processed.push({ ...p, status: 'allowed', color: '#34d399' })
              allowed += 1
            }
          } else if (p.status === 'blocked' && p.x > 0) {
            processed.push({ ...p, x: p.x - speed * delta * 1.6 })
          } else if (p.status === 'allowed' && p.x < 108) {
            processed.push({ ...p, x: p.x + speed * delta })
          } else if (p.status === 'flying' && p.x < 108) {
            processed.push(p)
          }
        })
        packetsRef.current = processed.slice(-10)
        setPackets(packetsRef.current)
        if (blocked > 0 || allowed > 0) {
          setStats((s) => ({ blocked: s.blocked + blocked, allowed: s.allowed + allowed }))
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, resetKey, reduced])

  return (
    <div className="relative h-full w-full overflow-hidden" aria-hidden="true">
      {packets.map((p) => (
        <span
          key={`${resetKey}-${p.id}`}
          className={`absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${
            p.status === 'blocked' ? 'bg-alert' : p.status === 'allowed' ? 'bg-mint' : 'bg-white/70'
          }`}
          style={{ left: `${p.x}%`, boxShadow: `0 0 8px ${p.color}` }}
        />
      ))}
      <div className="absolute left-[42%] top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1">
        <div className={`rounded-lg border p-3 ${running ? 'border-cyan/50 bg-cyan/10 shadow-glow-sm' : 'border-line bg-white/5'}`}>
          <ShieldIcon size={26} className="text-cyan" />
        </div>
        <span className="font-mono text-[8px] tracking-widest text-cyan/70">FIREWALL</span>
      </div>
      <div className="absolute bottom-2 left-2 flex gap-2 font-mono text-[9px]">
        <span className="flex items-center gap-1 text-alert">
          <AlertIcon size={10} /> BLOCKED {stats.blocked}
        </span>
        <span className="flex items-center gap-1 text-mint">
          <LockIcon size={10} /> ALLOWED {stats.allowed}
        </span>
      </div>
      <span className="absolute left-2 top-2 font-mono text-[9px] tracking-widest text-ghost/50">PACKET FLOW</span>
    </div>
  )
}
