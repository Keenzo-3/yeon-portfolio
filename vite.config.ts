import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['.monkeycode-ai.live'],
  },
  build: {
    target: 'es2019',
    cssTarget: 'es2019',
    chunkSizeWarningLimit: 700,
  },
})
