import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function usePausableRaf(cb: (delta: number, t: number) => void, running: boolean, resetKey: number) {
  const reduced = useReducedMotion()
  const cbRef = useRef(cb)
  cbRef.current = cb

  useEffect(() => {
    if (reduced) return
    let raf = 0
    let last = performance.now()

    const tick = (t: number) => {
      const delta = Math.min(t - last, 50)
      last = t
      cbRef.current(delta, t)
      raf = requestAnimationFrame(tick)
    }

    if (running) {
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }

    return () => cancelAnimationFrame(raf)
  }, [running, reduced, resetKey])
}
