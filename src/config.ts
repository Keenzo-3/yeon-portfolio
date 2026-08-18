export interface Bot {
  id: string
  name: string
  tagline: string
  description: string
  category: 'Security' | 'Economy' | 'Music' | 'Utility' | 'AI' | 'Moderation' | 'Other'
  technologies: string[]
  status: 'Online' | 'Beta' | 'Concept' | 'Archived'
  features: string[]
  artwork: string
  invite?: string
  website?: string
  screenshots?: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  category: string
  technologies: string[]
  status: string
  links?: { label: string; url: string }[]
}

export interface SocialLink {
  platform: 'Discord' | 'Instagram' | 'Facebook' | 'TikTok' | 'Twitter' | 'YouTube' | 'Telegram' | 'Email'
  username: string
  description: string
  url: string
}

export interface Statistic {
  value: number
  suffix: string
  label: string
}

export interface TimelineEntry {
  year: string
  title: string
  description: string
}

export interface MusicSettings {
  ambientTrack: string
  defaultEnabled: boolean
  defaultVolume: number
  enableSfx: boolean
}

export interface SiteConfig {
  name: string
  displayName: string
  discordId: string
  discordUsername: string
  email: string
  bio: string
  roleLines: string[]
  bootLogs: string[]
  statistics: Statistic[]
  skills: Record<string, string[]>
  timeline: TimelineEntry[]
  discordBots: Bot[]
  projects: Project[]
  socialLinks: SocialLink[]
  musicSettings: MusicSettings
  navLinks: { label: string; target: string }[]
}

export const config: SiteConfig = {
  name: 'kaixel',
  displayName: 'kaixel',
  discordId: '1245077803792334890',
  discordUsername: 'kremix.exe',
  email: 'kaixelbagang@gmail.com',
  bio: 'Building Discord bots, software experiments and cybersecurity-inspired projects.',
  roleLines: ['Developer', 'Discord Bot Creator', 'Cybersecurity Enthusiast'],

  bootLogs: [
    '[BOOT] Loading core...',
    '[OK] Interface initialized',
    '[OK] Security visualization loaded',
    '[OK] Discord modules loaded',
    '[OK] Portfolio loaded',
    '[OK] Environment verified',
  ],

  statistics: [
    { value: 25, suffix: '+', label: 'Projects' },
    { value: 10, suffix: '+', label: 'Discord Bots' },
    { value: 15, suffix: '+', label: 'Technologies' },
    { value: 50, suffix: '+', label: 'Experiments' },
  ],

  skills: {
    Programming: ['JavaScript', 'TypeScript', 'Node.js', 'Python'],
    Discord: ['Discord.js', 'Slash Commands', 'Prefix Commands', 'Discord APIs', 'Lavalink'],
    Web: ['HTML', 'CSS', 'React', 'Vite', 'Tailwind'],
    Backend: ['Node.js', 'REST APIs', 'MongoDB'],
    Cybersecurity: ['Security concepts', 'Threat modeling', 'Authentication', 'Network fundamentals'],
    Tools: ['Netlify', 'VS Code', 'Git'],
  },

  timeline: [
    {
      year: '2019',
      title: 'First line of code',
      description: 'Wrote the first scripts out of pure curiosity and never stopped experimenting.',
    },
    {
      year: '2020',
      title: 'Discovered Discord development',
      description: 'Built the first bot to automate a small server and fell in love with Discord.js.',
    },
    {
      year: '2021',
      title: 'Web development',
      description: 'Learned HTML, CSS, JavaScript and started building interfaces for bot dashboards.',
    },
    {
      year: '2022',
      title: 'Node.js & backend',
      description: 'Moved into full-stack territory with Node.js, REST APIs and MongoDB.',
    },
    {
      year: '2023',
      title: 'Cybersecurity interest',
      description: 'Started studying security concepts, threat modeling and defensive tooling.',
    },
    {
      year: '2024',
      title: 'Security-focused bots',
      description: 'Released enterprise-style security bots with anti-raid and threat detection modules.',
    },
    {
      year: '2025',
      title: 'AI experiments',
      description: 'Exploring AI-powered bots, automation and generative experiments.',
    },
    {
      year: '2026',
      title: 'Building in public',
      description: 'Launching polished, production-grade projects and sharing the journey.',
    },
  ],

  discordBots: [
    {
      id: 'xrd',
      name: 'XRD',
      tagline: 'Advanced Discord bot ecosystem',
      description:
        'A comprehensive Discord bot ecosystem that brings together moderation, security, economy, music, utility, AI and custom commands in one powerful, well-organized system.',
      category: 'Other',
      technologies: ['Discord.js', 'TypeScript', 'Node.js', 'MongoDB'],
      status: 'Online',
      features: [
        'Full moderation suite',
        'Security modules',
        'Economy system',
        'Music playback',
        'Utility commands',
        'AI assistant commands',
        'Custom commands',
        'Server management',
      ],
      artwork: 'xrd',
      invite: '',
      website: '',
      screenshots: [],
    },
    {
      id: 'akio',
      name: 'AKIO',
      tagline: 'Enterprise Discord security bot',
      description:
        'An enterprise-grade Discord security bot focused on protecting communities against raids, nukes and malicious activity with layered defensive systems.',
      category: 'Security',
      technologies: ['Discord.js', 'TypeScript', 'Node.js', 'Redis', 'MongoDB'],
      status: 'Online',
      features: [
        'Anti-raid protection',
        'Anti-nuke defenses',
        'Moderation toolkit',
        'CAPTCHA verification',
        'Security logs',
        'Threat detection',
        'Server protection',
        'Recovery tools',
      ],
      artwork: 'akio',
      invite: '',
      website: '',
      screenshots: [],
    },
    {
      id: 'yeni',
      name: 'YENI',
      tagline: 'Discord economy & entertainment bot',
      description:
        'A polished economy and entertainment bot with daily rewards, profiles, leaderboards, inventory and games — designed to keep communities engaged.',
      category: 'Economy',
      technologies: ['Discord.js', 'JavaScript', 'Node.js', 'MongoDB'],
      status: 'Online',
      features: [
        'Economy system',
        'Daily rewards',
        'User profiles',
        'Leaderboards',
        'Inventory',
        'Mini-games',
        'Premium systems',
      ],
      artwork: 'yeni',
      invite: '',
      website: '',
      screenshots: [],
    },
    {
      id: 'airy',
      name: 'AIRY',
      tagline: 'Discord security bot concept',
      description:
        'A security bot concept focused on monitoring, alerts and defensive automation for communities that want proactive protection without heavy configuration.',
      category: 'Security',
      technologies: ['Discord.js', 'TypeScript', 'Node.js'],
      status: 'Concept',
      features: [
        'Moderation basics',
        'Security logs',
        'Anti-raid alerts',
        'Anti-nuke measures',
        'Protection roles',
        'Alert notifications',
      ],
      artwork: 'airy',
      invite: '',
      website: '',
      screenshots: [],
    },
  ],

  projects: [
    {
      id: 'custom-1',
      name: 'Custom Discord Project',
      description:
        'A customizable slot for your upcoming Discord bot. Simply replace this placeholder information with your specific project name, category, and tech stack upon client commission.',
      category: 'Utility',
      technologies: ['Discord.js', 'TypeScript'],
      status: 'In Development',
      links: [],
    },
  ],

  socialLinks: [
    {
      platform: 'Discord',
      username: 'kremix.exe',
      description: 'The hub for all things kaixel.',
      url: '',
    },
    {
      platform: 'Instagram',
      username: '@koala.8076508',
      description: 'Behind-the-scenes and builds.',
      url: 'https://www.instagram.com/koala.8076508?igsh=MTRjdm9vODExZmR5ag==',
    },
    {
      platform: 'Facebook',
      username: 'SOON!',
      description: 'Community and updates.',
      url: '',
    },
    {
      platform: 'TikTok',
      username: 'SOON!',
      description: 'Short clips and experiments.',
      url: '',
    },
    {
      platform: 'Twitter',
      username: 'SOON!',
      description: 'Dev thoughts and threads.',
      url: '',
    },
    {
      platform: 'YouTube',
      username: 'SOON!',
      description: 'Tutorials and showcases.',
      url: '',
    },
    {
      platform: 'Telegram',
      username: '@Arkieezx',
      description: 'Direct line to the crew.',
      url: '',
    },
    {
      platform: 'Email',
      username: 'kaixelbagang@gmail.com',
      description: 'For business and collaborations.',
      url: '',
    },
  ],

  musicSettings: {
    ambientTrack: '/audio/kaixel-theme.mp3',
    defaultEnabled: true,
    defaultVolume: 1,
    enableSfx: true,
  },

  navLinks: [
    { label: 'HOME', target: '#home' },
    { label: 'ABOUT', target: '#about' },
    { label: 'WORKS', target: '#works' },
    { label: 'SKILLS', target: '#skills' },
    { label: 'CYBER LAB', target: '#cyberlab' },
    { label: 'JOURNEY', target: '#journey' },
    { label: 'SOCIALS', target: '#socials' },
    { label: 'CONTACT', target: '#contact' },
  ],
}
