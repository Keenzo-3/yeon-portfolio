import { useCallback, useState } from 'react'
import { AudioProvider } from './audio/AudioProvider'
import { Background } from './components/Background'
import { BootIntro } from './components/BootIntro'
import { CustomCursor } from './components/CustomCursor'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Journey } from './components/Journey'
import { Works } from './components/Works'
import { DemoTerminal } from './components/DemoTerminal'
import { Skills } from './components/Skills'
import { Statistics } from './components/Statistics'
import { CyberLab } from './components/CyberLab'
import { Socials } from './components/Socials'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { SectionHeading } from './components/SectionHeading'
import { Reveal } from './components/Reveal'
import { HackerModeOverlay, MatrixBurst } from './components/HackerMode'
import { HackerToggle } from './components/HackerToggle'
import { TerminalIcon } from './components/icons'

function TerminalSection() {
  const [matrixBurst, setMatrixBurst] = useState(false)
  const onMatrix = useCallback(() => {
    setMatrixBurst(true)
  }, [])
  const onBots = useCallback(() => {
    document.querySelector('#works')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <section id="terminal" className="relative mx-auto max-w-5xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading
        kicker="// DISCORD DEVELOPMENT"
        title="Discord Development Terminal"
        description="A visual demo of a bot boot sequence. Purely cosmetic — it never executes a real command."
      />
      <Reveal>
        <DemoTerminal onMatrix={onMatrix} onBots={onBots} />
      </Reveal>
      <Reveal className="mt-6">
        <p className="flex items-center justify-center gap-2 font-mono text-[11px] tracking-widest text-ghost/60">
          <TerminalIcon size={14} className="text-cyan/60" />
          SAFE EASTER EGGS: sudo yeon · matrix · coffee · bots
        </p>
      </Reveal>
      {matrixBurst && <MatrixBurst onDone={() => setMatrixBurst(false)} />}
    </section>
  )
}

function Site() {
  const [hackerMode, setHackerMode] = useState(false)

  return (
    <>
      <Background intensity={hackerMode ? 'matrix' : 'normal'} />
      <Navbar />

      <main className="relative z-10">
        <Hero />
        <About />
        <Works />
        <TerminalSection />
        <Statistics />
        <Skills />
        <CyberLab />
        <Journey />
        <Socials />
        <Contact />
      </main>

      <Footer />

      <HackerToggle active={hackerMode} onToggle={() => setHackerMode((h) => !h)} />
      {hackerMode && <HackerModeOverlay onExit={() => setHackerMode(false)} />}
      <CustomCursor />
    </>
  )
}

function App() {
  return (
    <AudioProvider>
      <BootIntro onComplete={() => undefined} />
      <Site />
    </AudioProvider>
  )
}

export default App
