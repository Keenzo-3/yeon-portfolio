import { useState } from 'react'
import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'
import { NetworkVis } from './animations/NetworkVis'
import { Firewall } from './animations/Firewall'
import { EncryptionVis } from './animations/EncryptionVis'
import { ThreatRadar } from './animations/ThreatRadar'
import { DigitalLock } from './animations/DigitalLock'
import { SecurityShield } from './animations/SecurityShield'
import { DataStream } from './animations/DataStream'
import { useAudio } from '../audio/AudioProvider'
import { PlayIcon, PauseIcon, RefreshIcon, ShieldIcon, MonitorIcon } from './icons'

function CyberHud() {
  const rows = [
    { label: 'SYSTEM STATUS', value: 'SECURE', color: 'text-mint', dot: 'bg-mint' },
    { label: 'FIREWALL', value: 'ACTIVE', color: 'text-mint', dot: 'bg-mint' },
    { label: 'ENCRYPTION', value: 'ENABLED', color: 'text-mint', dot: 'bg-mint' },
    { label: 'THREAT LEVEL', value: 'LOW', color: 'text-mint', dot: 'bg-mint' },
    { label: 'NETWORK', value: 'PROTECTED', color: 'text-mint', dot: 'bg-mint' },
  ]
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="mb-4 flex items-center gap-2 font-mono text-xs tracking-widest text-cyan">
        <MonitorIcon size={16} /> CYBER HUD
      </h3>
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between border-b border-line/50 pb-2 font-mono text-[11px]">
            <span className="flex items-center gap-2 text-ghost">
              <span className={`h-1.5 w-1.5 rounded-full ${r.dot} animate-pulse-glow`} />
              {r.label}
            </span>
            <span className={`tracking-widest ${r.color}`}>{r.value}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 font-mono text-[9px] leading-relaxed tracking-widest text-ghost/50">
        DEMO VALUES ONLY · SIMULATED FOR VISUALIZATION
      </p>
    </div>
  )
}

function WorkstationArt() {
  return (
    <div className="glass relative flex h-full min-h-[220px] flex-col justify-center gap-3 overflow-hidden rounded-2xl p-6">
      <div className="flex items-center gap-3">
        <img
          src="/kali-logo-white.svg"
          alt="Kali Linux logo"
          className="h-8 w-auto opacity-90"
          width={128}
          height={72}
          loading="lazy"
        />
        <span className="font-mono text-xs tracking-widest text-ghost">CYBERSECURITY WORKSTATION</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="relative overflow-hidden rounded-lg border border-line bg-black/50 p-3 font-mono text-[10px] leading-relaxed text-cyan/70">
          <p>$ hexdump packet.bin</p>
          <p className="text-mint/70">0x0A2F 0x77B4 0x00FF</p>
          <p className="text-ghost/50">0x8C21 0xDEAD 0xBEEF</p>
          <p className="text-ghost/50">0x00E5 0xFF00 0x1234</p>
          <div className="absolute inset-x-0 bottom-0 h-px animate-scan bg-gradient-to-r from-transparent via-cyan/70 to-transparent" />
        </div>
        <div className="relative overflow-hidden rounded-lg border border-line bg-black/50 p-3">
          <div className="relative mx-auto h-24 w-24">
            <div className="absolute inset-0 rounded-full border border-mint/40" />
            <div className="absolute inset-4 rounded-full border border-mint/30" />
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="radar-sweep absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,rgba(52,211,153,0.4),transparent_80deg)]" />
            </div>
            <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint" />
          </div>
        </div>
      </div>
      <p className="flex items-center gap-2 font-mono text-[9px] tracking-widest text-ghost/50">
        <ShieldIcon size={12} className="text-mint" />
        VISUAL REPRESENTATION · NO LIVE NETWORK ACTIVITY
      </p>
    </div>
  )
}

function VisualCard({
  title,
  hint,
  children,
}: {
  title: string
  hint: string
  children: React.ReactNode
}) {
  return (
    <div className="glass flex flex-col overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <h3 className="font-mono text-[11px] tracking-widest text-ghost">{title}</h3>
        <span className="font-mono text-[9px] tracking-widest text-ghost/50">{hint}</span>
      </div>
      <div className="h-56 p-2">{children}</div>
    </div>
  )
}

export function CyberLab() {
  const audio = useAudio()
  const [running, setRunning] = useState(true)
  const [resetKey, setResetKey] = useState(0)

  const toggleRunning = () => {
    audio.playSfx('click')
    setRunning((r) => !r)
  }

  const reset = () => {
    audio.playSfx('click')
    setResetKey((k) => k + 1)
    setRunning(true)
  }

  return (
    <section id="cyberlab" className="relative mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading
        kicker="// CYBER LAB"
        title={
          <>
            CYBER LAB — <span className="text-gradient-cyan">ANIMATION ONLY</span>
          </>
        }
        description="Pure visual cybersecurity animations. No real tools, no real traffic, no real scanning. Everything here is simulated for demonstration."
      />

      <Reveal className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="glass flex items-center gap-2 rounded-xl border-mint/30 px-4 py-2.5">
          <span className="h-2 w-2 animate-pulse-glow rounded-full bg-mint" />
          <span className="font-mono text-xs tracking-widest text-mint">
            CYBERSECURITY VISUALIZATION — SIMULATION ONLY
          </span>
        </div>
        <div className="flex gap-2" role="group" aria-label="Cyber Lab controls">
          <button
            onClick={toggleRunning}
            className="flex items-center gap-2 rounded-md border border-cyan/50 bg-cyan/10 px-5 py-2.5 font-mono text-xs tracking-widest text-cyan transition hover:bg-cyan/20 hover:shadow-glow-sm"
            aria-pressed={running}
          >
            {running ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
            {running ? 'PAUSE' : 'START'}
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-md border border-line px-5 py-2.5 font-mono text-xs tracking-widest text-white transition hover:border-cyan/40 hover:text-cyan"
          >
            <RefreshIcon size={14} />
            RESET
          </button>
        </div>
      </Reveal>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Reveal direction="left">
          <WorkstationArt />
        </Reveal>
        <Reveal direction="right">
          <CyberHud />
        </Reveal>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Reveal>
          <VisualCard title="NETWORK VISUALIZATION" hint="SIM">
            <NetworkVis running={running} resetKey={resetKey} />
          </VisualCard>
        </Reveal>
        <Reveal delay={60}>
          <VisualCard title="FIREWALL" hint="SIM">
            <Firewall running={running} resetKey={resetKey} />
          </VisualCard>
        </Reveal>
        <Reveal delay={120}>
          <VisualCard title="ENCRYPTION" hint="SIM">
            <EncryptionVis running={running} resetKey={resetKey} />
          </VisualCard>
        </Reveal>
        <Reveal delay={60}>
          <VisualCard title="THREAT DETECTION" hint="SIM">
            <ThreatRadar running={running} resetKey={resetKey} />
          </VisualCard>
        </Reveal>
        <Reveal delay={120}>
          <VisualCard title="DIGITAL LOCK" hint="SIM">
            <DigitalLock running={running} resetKey={resetKey} />
          </VisualCard>
        </Reveal>
        <Reveal delay={180}>
          <VisualCard title="SECURITY SHIELD" hint="SIM">
            <SecurityShield running={running} />
          </VisualCard>
        </Reveal>
      </div>

      <Reveal className="mt-6">
        <VisualCard title="DATA STREAM" hint="SIM">
          <DataStream running={running} resetKey={resetKey} />
        </VisualCard>
      </Reveal>

      <Reveal className="mt-8">
        <p className="glass rounded-xl border-alert/20 p-4 text-center font-mono text-xs leading-relaxed text-ghost">
          All animations are <span className="text-cyan">simulated</span>. No real hacking, scanning,
          exploitation or network interaction occurs. The controls only animate and pause the visuals.
        </p>
      </Reveal>
    </section>
  )
}
