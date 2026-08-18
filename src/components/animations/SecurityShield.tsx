import { ShieldIcon, ServerIcon } from '../icons'

export function SecurityShield({ running }: { running: boolean }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden" aria-hidden="true">
      <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan/10" />
      <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan/5" />

      <div
        className={`absolute left-[16%] top-[20%] text-ghost/60 ${running ? 'animate-floaty' : ''}`}
        style={{ animationDelay: '0s' }}
      >
        <ServerIcon size={22} />
      </div>
      <div
        className={`absolute right-[18%] top-[26%] text-ghost/60 ${running ? 'animate-floaty' : ''}`}
        style={{ animationDelay: '1.2s' }}
      >
        <ServerIcon size={18} />
      </div>
      <div
        className={`absolute bottom-[20%] left-[24%] text-ghost/50 ${running ? 'animate-floaty' : ''}`}
        style={{ animationDelay: '0.6s' }}
      >
        <ServerIcon size={16} />
      </div>
      <div
        className={`absolute bottom-[24%] right-[20%] text-ghost/50 ${running ? 'animate-floaty' : ''}`}
        style={{ animationDelay: '1.8s' }}
      >
        <ServerIcon size={20} />
      </div>

      <div className="relative">
        <div
          className={`absolute -inset-6 rounded-full blur-2xl transition-opacity ${running ? 'animate-pulse-glow bg-cyan/10' : 'bg-cyan/5'}`}
        />
        <div className="relative rounded-2xl border border-cyan/40 bg-cyan/5 p-6 shadow-glow">
          <ShieldIcon size={52} className={running ? 'animate-pulse-glow text-cyan' : 'text-cyan/80'} />
        </div>
      </div>

      <span className="absolute bottom-3 font-mono text-[9px] tracking-widest text-mint">NETWORK PROTECTED</span>
    </div>
  )
}
