interface ArtworkProps {
  id: string
  className?: string
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 320 320" className="h-full w-full" role="img" aria-hidden="true">
      <defs>
        <radialGradient id="bgArt" cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#151b22" />
          <stop offset="55%" stopColor="#0a0d11" />
          <stop offset="100%" stopColor="#05070a" />
        </radialGradient>
        <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="redGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <rect width="320" height="320" fill="url(#bgArt)" />
      <g opacity="0.12" stroke="#9aa3ab" strokeWidth="1">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="320" y2={i * 40} />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="320" />
        ))}
      </g>
      <rect width="320" height="320" fill="url(#bgArt)" opacity="0" />
      {children}
      <rect x="1" y="1" width="318" height="318" fill="none" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="2" rx="0" />
    </svg>
  )
}

function XrdArt() {
  return (
    <Shell>
      <g stroke="url(#lineGlow)" strokeWidth="2" fill="none">
        <polygon points="160,60 230,100 230,180 160,220 90,180 90,100" />
        <polygon points="160,95 207,122 207,176 160,203 113,176 113,122" opacity="0.5" />
      </g>
      <circle cx="160" cy="150" r="34" stroke="url(#lineGlow)" strokeWidth="2" fill="rgba(0,229,255,0.05)" />
      <circle cx="160" cy="150" r="20" stroke="#00e5ff" strokeWidth="1.5" fill="none" opacity="0.7" strokeDasharray="4 5" />
      <ellipse cx="160" cy="150" rx="74" ry="22" fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.4" transform="rotate(-20 160 150)" />
      <ellipse cx="160" cy="150" rx="74" ry="22" fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.4" transform="rotate(20 160 150)" />
      {[
        [160, 150],
        [230, 100],
        [230, 180],
        [90, 180],
        [90, 100],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4" fill="#00e5ff" opacity="0.9">
          <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.6 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <text x="160" y="286" textAnchor="middle" fill="#e5e7eb" fontSize="22" fontFamily="monospace" fontWeight="700" letterSpacing="6">
        XRD
      </text>
    </Shell>
  )
}

function AkioArt() {
  return (
    <Shell>
      <path
        d="M160 62 236 92v64c0 46-30 70-76 86-46-16-76-40-76-86V92z"
        fill="rgba(0,229,255,0.04)"
        stroke="url(#lineGlow)"
        strokeWidth="2.5"
      />
      <path d="M160 82 214 104v50c0 32-20 50-54 62-34-12-54-30-54-62v-50z" fill="none" stroke="#00e5ff" strokeWidth="1.2" opacity="0.45" />
      <circle cx="160" cy="150" r="48" fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.25" />
      <g clipPath="url(#clipRadar)">
        <circle cx="160" cy="150" r="48" fill="rgba(0,229,255,0.06)" />
        <path d="M160 150 L160 102 A48 48 0 0 1 202 122 Z" fill="rgba(0,229,255,0.35)">
          <animateTransform attributeName="transform" type="rotate" from="0 160 150" to="360 160 150" dur="3.2s" repeatCount="indefinite" />
        </path>
      </g>
      <clipPath id="clipRadar">
        <circle cx="160" cy="150" r="48" />
      </clipPath>
      <circle cx="160" cy="150" r="5" fill="#00e5ff" />
      <rect x="147" y="218" width="26" height="20" rx="4" fill="none" stroke="#00e5ff" strokeWidth="1.5" />
      <path d="M153 222v4M167 222v4" stroke="#00e5ff" strokeWidth="1.5" strokeLinecap="round" />
      <text x="160" y="286" textAnchor="middle" fill="#e5e7eb" fontSize="22" fontFamily="monospace" fontWeight="700" letterSpacing="6">
        AKIO
      </text>
    </Shell>
  )
}

function YeniArt() {
  return (
    <Shell>
      <circle cx="160" cy="150" r="58" fill="rgba(0,229,255,0.04)" stroke="url(#lineGlow)" strokeWidth="2" />
      <circle cx="160" cy="150" r="46" fill="none" stroke="#00e5ff" strokeWidth="1.2" opacity="0.4" strokeDasharray="5 6" />
      <circle cx="160" cy="150" r="28" fill="rgba(52,211,153,0.06)" stroke="#34d399" strokeWidth="2" />
      <text x="160" y="166" textAnchor="middle" fill="#34d399" fontSize="30" fontFamily="monospace" fontWeight="700">
        ¥
      </text>
      <g stroke="#34d399" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M96 214h16v-14M144 222h16" opacity="0.6" />
        <polyline points="196 200 210 186 226 196 244 176" />
      </g>
      {[
        [238, 168],
        [228, 186],
        [206, 198],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#34d399">
          <animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.2 + i * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <text x="160" y="286" textAnchor="middle" fill="#e5e7eb" fontSize="22" fontFamily="monospace" fontWeight="700" letterSpacing="6">
        YENI
      </text>
    </Shell>
  )
}

function AiryArt() {
  return (
    <Shell>
      <g stroke="url(#redGlow)" strokeWidth="2" fill="none">
        <circle cx="160" cy="150" r="70" opacity="0.25" />
        <circle cx="160" cy="150" r="50" opacity="0.4" />
        <circle cx="160" cy="150" r="30" opacity="0.6" />
      </g>
      <g fill="none" stroke="#f43f5e" strokeWidth="1.5" opacity="0.5">
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2
          const x = 160 + Math.cos(a) * 70
          const y = 150 + Math.sin(a) * 70
          return <line key={i} x1="160" y1="150" x2={x} y2={y} />
        })}
      </g>
      <g clipPath="url(#clipAiry)">
        <path d="M160 150 L160 100 A50 50 0 0 1 200 124 Z" fill="rgba(244,63,94,0.35)">
          <animateTransform attributeName="transform" type="rotate" from="0 160 150" to="360 160 150" dur="3.6s" repeatCount="indefinite" />
        </path>
      </g>
      <clipPath id="clipAiry">
        <circle cx="160" cy="150" r="50" />
      </clipPath>
      <circle cx="160" cy="150" r="4" fill="#f43f5e" />
      <text x="160" y="286" textAnchor="middle" fill="#e5e7eb" fontSize="22" fontFamily="monospace" fontWeight="700" letterSpacing="6">
        AIRY
      </text>
    </Shell>
  )
}

function GenericArt({ name }: { name: string }) {
  return (
    <Shell>
      <g stroke="url(#lineGlow)" strokeWidth="2" fill="none">
        <rect x="95" y="95" width="130" height="130" rx="12" transform="rotate(45 160 160)" opacity="0.5" />
        <rect x="125" y="125" width="70" height="70" rx="8" transform="rotate(45 160 160)" />
      </g>
      <circle cx="160" cy="160" r="26" fill="rgba(0,229,255,0.05)" stroke="#00e5ff" strokeWidth="1.5" />
      <circle cx="160" cy="160" r="12" fill="#00e5ff" opacity="0.3" />
      <text x="160" y="286" textAnchor="middle" fill="#e5e7eb" fontSize="20" fontFamily="monospace" fontWeight="700" letterSpacing="5">
        {name.slice(0, 10)}
      </text>
    </Shell>
  )
}

export function BotArtwork({ id, className = '' }: ArtworkProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-line bg-carbon ${className}`}>
      {id === 'xrd' && <XrdArt />}
      {id === 'akio' && <AkioArt />}
      {id === 'yeni' && <YeniArt />}
      {id === 'airy' && <AiryArt />}
      {!['xrd', 'akio', 'yeni', 'airy'].includes(id) && <GenericArt name={id} />}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-black/50 via-transparent to-transparent" aria-hidden="true" />
    </div>
  )
}
