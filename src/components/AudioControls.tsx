import { useState } from 'react'
import { config } from '../config'
import { useAudio } from '../audio/AudioProvider'
import { MusicIcon, VolumeOnIcon, VolumeOffIcon } from './icons'

export function AudioControls({ compact = false }: { compact?: boolean }) {
  const audio = useAudio()
  const [open, setOpen] = useState(false)

  if (compact) {
    return (
      <div className="relative flex items-center gap-2">
        <button
          onClick={audio.toggleSound}
          className="glass flex h-10 w-10 items-center justify-center rounded-md text-ghost transition hover:border-cyan/40 hover:text-cyan"
          aria-label={audio.soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
          aria-pressed={audio.soundEnabled}
          title={audio.soundEnabled ? 'Sound: ON' : 'Sound: OFF'}
        >
          {audio.soundEnabled ? <VolumeOnIcon size={18} /> : <VolumeOffIcon size={18} />}
        </button>
        <button
          onClick={() => setOpen((o) => !o)}
          className={`glass flex h-10 w-10 items-center justify-center rounded-md transition hover:border-cyan/40 ${
            audio.musicEnabled ? 'border-cyan/50 text-cyan' : 'text-ghost hover:text-cyan'
          }`}
          aria-label="Music controls"
          aria-expanded={open}
          aria-pressed={audio.musicEnabled}
          title={audio.musicEnabled ? 'Music: ON' : 'Music: OFF'}
        >
          <MusicIcon size={18} />
        </button>
        {open && (
          <div className="glass absolute right-0 top-12 z-50 w-52 rounded-lg p-4 shadow-panel">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-widest text-ghost">AMBIENT MUSIC</span>
              <span className="rounded border border-cyan/50 px-2 py-0.5 font-mono text-[10px] tracking-widest text-cyan">
                ALWAYS ON
              </span>
            </div>
            <label className="mb-1 block font-mono text-[10px] tracking-widest text-ghost">
              VOLUME · 100%
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={1}
              disabled
              className="w-full accent-cyan opacity-60"
              aria-label="Master volume"
            />
            <p className="mt-3 text-[9px] leading-relaxed text-ghost/70">
              {config.musicSettings.ambientTrack} · looping at full volume. Starts after your first interaction.
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={audio.toggleSound}
          className="glass flex h-10 w-10 items-center justify-center rounded-md text-ghost transition hover:border-cyan/40 hover:text-cyan"
          aria-label={audio.soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
          aria-pressed={audio.soundEnabled}
        >
          {audio.soundEnabled ? <VolumeOnIcon size={18} /> : <VolumeOffIcon size={18} />}
        </button>
        <button
          onClick={() => setOpen((o) => !o)}
          className={`glass flex h-10 w-10 items-center justify-center rounded-md transition hover:border-cyan/40 ${
            audio.musicEnabled ? 'border-cyan/50 text-cyan' : 'text-ghost hover:text-cyan'
          }`}
          aria-label="Music controls"
          aria-expanded={open}
          aria-pressed={audio.musicEnabled}
        >
          <MusicIcon size={18} />
        </button>
      </div>
      {open && (
        <div className="glass absolute right-0 top-12 z-50 w-56 rounded-lg p-4 shadow-panel">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-xs tracking-widest text-ghost">AMBIENT MUSIC</span>
            <span className="rounded border border-cyan/50 px-2 py-0.5 font-mono text-[10px] tracking-widest text-cyan">
              ALWAYS ON
            </span>
          </div>
          <label className="mb-1 block font-mono text-[10px] tracking-widest text-ghost">
            VOLUME · 100%
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={1}
            disabled
            className="w-full accent-cyan opacity-60"
            aria-label="Master volume"
          />
          <p className="mt-3 text-[10px] leading-relaxed text-ghost/70">
            {config.musicSettings.ambientTrack} · looping at full volume. Starts after your first interaction.
          </p>
        </div>
      )}
    </div>
  )
}
