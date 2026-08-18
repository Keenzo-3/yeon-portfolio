/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#050607',
        carbon: '#0b0e11',
        panel: '#11151a',
        line: 'rgba(255,255,255,0.08)',
        ghost: '#9aa3ab',
        cyan: '#22d3ee',
        neon: '#00e5ff',
        matrix: '#00ff9d',
        mint: '#34d399',
        alert: '#f43f5e',
        amberx: '#fbbf24',
        viol: '#a78bfa',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(0,229,255,0.18), 0 0 60px rgba(0,229,255,0.06)',
        'glow-sm': '0 0 12px rgba(0,229,255,0.25)',
        panel: '0 20px 60px -20px rgba(0,0,0,0.8)',
      },
      animation: {
        blink: 'blink 1.1s step-end infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        floaty: 'floaty 8s ease-in-out infinite',
        scan: 'scan 6s linear infinite',
        'grid-move': 'gridMove 18s linear infinite',
        glitch: 'glitch 3.2s infinite',
        shimmer: 'shimmer 2.4s linear infinite',
      },
      keyframes: {
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        pulseGlow: {
          '0%,100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        scan: { '0%': { top: '0%' }, '100%': { top: '100%' } },
        gridMove: { '0%': { backgroundPosition: '0 0' }, '100%': { backgroundPosition: '0 40px' } },
        glitch: {
          '0%': { textShadow: '0 0 transparent' },
          '20%': { textShadow: '-2px 0 #00e5ff, 2px 0 #f43f5e' },
          '40%': { textShadow: '2px 0 #00e5ff, -2px 0 #f43f5e' },
          '60%': { textShadow: '0 0 transparent' },
          '100%': { textShadow: '0 0 transparent' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
