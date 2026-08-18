# YEON — Portfolio

Premium futuristic black cybersecurity portfolio for **Yeon**, a developer, Discord bot creator
and cybersecurity enthusiast.

Built with **React + TypeScript + Vite + Tailwind CSS**. Fully static and Netlify-ready.

## Features

- Cinematic hacking-style boot intro with skip + local preference memory
- Optional synthesized cyberpunk ambient music and sound effects (default: muted)
- Glassmorphism black futuristic UI with animated grid, particles, binary streams, scanlines,
  digital noise, glitch effects and smooth scrolling
- Discord bots showcase with filters, search, tilt cards and a detail modal
- Discord Development Terminal (visual demo only — never executes real commands)
- Safe easter eggs: `sudo yeon`, `matrix`, `coffee`, `bots`
- Cyber Lab: animation-only cybersecurity visualizations (network, firewall, encryption, threat
  radar, digital lock, security shield, data stream) with START / PAUSE / RESET controls
- Hacker Mode: matrix particles, scanlines, terminal overlay and simulated logs
- Custom cursor (desktop), statistics counters, animated timeline, social hub, contact demo form
- Accessibility: semantic HTML, keyboard navigation, focus states, ARIA, `prefers-reduced-motion`
- SEO: meta description, Open Graph, favicon, robots.txt, sitemap.xml
- Kali Linux visual identity (official logo asset, properly credited)

## Quick start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Production build
npm run build

# Preview the production build
npm run preview
```

## Editing content

All editable content lives in a single configuration file:

```
src/config.ts
```

Edit `discordId`, `discordUsername`, `email`, `socialLinks`, `skills`, `projects`,
`discordBots`, `statistics`, `timeline`, `musicSettings` and more from that one file.

## Netlify deployment

1. Push this repository to your Git provider.
2. In Netlify, add a new site from Git (or drag-and-drop the `dist/` folder after `npm run build`).
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

The included `netlify.toml` and `public/_redirects` configure SPA redirects and security headers.

## Security & honesty

- All cybersecurity visuals are **simulated for demonstration purposes only**.
- The demo terminal and Cyber Lab never interact with real systems, networks or tools.
- No real Discord invite URLs, social accounts or API keys are hardcoded — everything is a
  placeholder that you replace with your own.
- Private API keys are never committed. Keep secrets out of `src/config.ts`.
