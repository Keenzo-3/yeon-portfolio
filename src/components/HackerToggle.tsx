import { useAudio } from '../audio/AudioProvider'
import { EyeIcon, ZapIcon } from './icons'

export function HackerToggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  const audio = useAudio()
  return (
    <button
      onClick={() => {
        audio.playSfx('glitch')
        onToggle()
      }}
      className={`fixed bottom-6 right-6 z-[65] flex items-center gap-2 rounded-full border px-4 py-2.5 font-mono text-xs tracking-widest backdrop-blur-md transition ${
        active
          ? 'border-mint/60 bg-mint/10 text-mint shadow-glow'
          : 'border-line bg-black/60 text-ghost hover:border-mint/40 hover:text-mint'
      }`}
      aria-pressed={active}
      aria-label={active ? 'Exit simulation mode' : 'Enable hacker mode'}
      title="Hacker Mode — visual simulation"
    >
      {active ? <EyeIcon size={15} /> : <ZapIcon size={15} />}
      {active ? 'EXIT SIM' : 'HACKER MODE'}
    </button>
  )
}
