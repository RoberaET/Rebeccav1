'use client'

import React, { useEffect, useRef, useState, createContext, useContext } from 'react'

// ─── Theme Context ────────────────────────────────────────────────────────────
const ThemeContext = createContext<{ dark: boolean; toggle: () => void }>({ dark: true, toggle: () => {} })
const useTheme = () => useContext(ThemeContext)

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(true)
  const toggle = () => setDark(d => !d)
  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      <div className={dark ? 'dark' : ''} style={{ colorScheme: dark ? 'dark' : 'light' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────
function useScrollReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  const style: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
  }
  return { ref, style }
}

function useSlideReveal<T extends HTMLElement>(delay = 0, dir: 'left' | 'right' | 'up' = 'up') {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  const tx = dir === 'left' ? '-24px' : dir === 'right' ? '24px' : '0'
  const ty = dir === 'up' ? '28px' : '0'
  const style: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translate(0,0)' : `translate(${tx},${ty})`,
    transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
  }
  return { ref, style }
}

// ─── Dot Helpers ──────────────────────────────────────────────────────────────
const DotCluster = () => (
  <div className="grid grid-cols-3 gap-1 w-fit">
    {[...Array(9)].map((_, i) => (
      <div key={i} className="w-1.5 h-1.5 rounded-full bg-red-600" />
    ))}
  </div>
)

const LogoDotCluster = () => (
  <div className="grid grid-cols-3 gap-[3px] w-fit -rotate-45">
    {[...Array(9)].map((_, i) => (
      <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 4 ? 'bg-transparent' : 'bg-red-600'}`} />
    ))}
  </div>
)

// ─── Nav Links ────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Home',       href: '#home' },
  { label: 'Portfolio',  href: '#portfolio' },
  { label: 'About',      href: '#about' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Contact',    href: '#contact' },
]

// ─── Header ───────────────────────────────────────────────────────────────────
const Header = () => {
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { dark, toggle } = useTheme()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sections = NAV_LINKS.map(l => l.href.slice(1))
    const observers: IntersectionObserver[] = []
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { threshold: 0.3 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    const id = href.slice(1)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled || isMobileMenuOpen
        ? dark ? 'bg-[#141212]/90 backdrop-blur-md border-b border-white/5 shadow-lg' : 'bg-white/90 backdrop-blur-md border-b border-black/10 shadow-lg'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 md:py-5 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" onClick={e => handleNav(e, '#home')} className="flex items-center gap-2 cursor-pointer z-50">
          <LogoDotCluster />
          <span className="text-lg font-bold text-red-600 tracking-wide">REBECCA ABEBE</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={e => handleNav(e, href)}
              className={`font-medium transition-colors duration-200 relative pb-0.5 ${
                active === href.slice(1)
                  ? 'text-red-500 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-red-500 after:rounded-full'
                  : dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 z-50">
          {/* Dark / Light toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition border ${
              dark ? 'border-white/10 bg-white/5 hover:bg-white/10 text-yellow-300' : 'border-black/10 bg-black/5 hover:bg-black/10 text-gray-700'
            }`}
          >
            {dark ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-10H21M3 12H2m15.07-7.07-.71.71M6.64 17.36l-.71.71M17.36 17.36l.71.71M6.64 6.64l-.71-.71M12 7a5 5 0 100 10A5 5 0 0012 7z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
              </svg>
            )}
          </button>

          {/* Desktop CTA */}
          <a
            href="#contact"
            onClick={e => handleNav(e, '#contact')}
            className="hidden md:inline-flex bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold text-sm transition shadow-[0_0_15px_rgba(220,38,38,0.5)]"
          >
            Get in Touch
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden w-10 h-10 rounded-full flex items-center justify-center transition border ${
              dark ? 'border-white/10 bg-white/5 text-white' : 'border-black/10 bg-black/5 text-gray-900'
            }`}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu - CSS animated */}
      <div
        className={`md:hidden border-b overflow-hidden transition-all duration-300 ${dark ? 'bg-[#141212] border-white/10' : 'bg-white border-black/10'}`}
        style={{ maxHeight: isMobileMenuOpen ? '400px' : '0', opacity: isMobileMenuOpen ? 1 : 0 }}
      >
        <div className="px-6 py-6 flex flex-col gap-6">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={e => handleNav(e, href)}
              className={`text-lg font-medium transition-colors duration-200 ${
                active === href.slice(1)
                  ? 'text-red-500'
                  : dark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={e => handleNav(e, '#contact')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold text-center transition shadow-[0_0_15px_rgba(220,38,38,0.5)] mt-2"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const { dark } = useTheme()
  const heroRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t) }, [])

  const heroText: React.CSSProperties = {
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0)' : 'translateY(30px)',
    transition: 'opacity 0.8s ease, transform 0.8s ease',
  }
  const heroImg: React.CSSProperties = {
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'scale(1)' : 'scale(0.92)',
    transition: 'opacity 1s ease 0.2s, transform 1s ease 0.2s',
  }
  const heroStats: React.CSSProperties = {
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
  }

  return (
  <section className={`pt-28 md:pt-32 pb-8 px-6 md:px-8 relative overflow-hidden ${dark ? '' : 'bg-white'}`} ref={heroRef}>
    <div className="max-w-7xl mx-auto relative min-h-[550px] flex flex-col justify-center md:justify-between">
      {/* Background Typography */}
      <div className="absolute right-0 top-0 opacity-[0.04] pointer-events-none z-0 hidden md:block">
        <span className="text-[250px] font-black leading-none tracking-tighter"
          style={{ WebkitTextStroke: `2px ${dark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}`, color: 'transparent' }}>RBCABE</span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between relative z-10 mt-8 md:mt-0 gap-8 xl:gap-16">
        <div style={heroText} className="pt-4 max-w-xl text-center md:text-left z-20">
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold mb-6 leading-[1.2] tracking-tight">
            <span className={dark ? 'text-white' : 'text-gray-900'}>Turning </span>
            <span className="text-red-600 border border-red-600/50 px-2 py-0 inline-block relative mx-1">
              Ideas
              <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-red-600 rounded-full"/>
              <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-red-600 rounded-full"/>
              <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-600 rounded-full"/>
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-red-600 rounded-full"/>
            </span>
            <span className={dark ? 'text-white' : 'text-gray-900'}> Into</span>
            <br />
            <span className={dark ? 'text-white' : 'text-gray-900'}>Digital Reality</span>
          </h1>

          <p className={`text-sm mb-10 leading-relaxed max-w-md mx-auto md:mx-0 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            I craft digital experiences with a focus on clean design, performance, and user satisfaction.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 sm:gap-6">
            <button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold text-sm transition shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105">
              Start a Project
            </button>
            <a href="#portfolio" className={`hover:text-red-500 transition font-semibold text-sm flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-800'}`}>
              See My Work <span>↗</span>
            </a>
          </div>
        </div>

        <div style={heroImg} className="hidden md:block w-[320px] lg:w-[400px] shrink-0 z-10">
          <img src="/rebecca-hero-black.png" alt="Rebecca Abebe" className="object-cover w-full aspect-[4/5] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white/10" />
        </div>
      </div>

    
  </section>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ title, desc }: { title: string, desc: string }) => {
  const { dark } = useTheme()
  const { ref, style } = useScrollReveal<HTMLDivElement>()
  return (
  <div ref={ref} style={style} className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-10 md:mb-12">
    <div>
      <h2 className={`text-3xl xl:text-4xl font-bold mb-4 flex items-center gap-3 ${dark ? 'text-white' : 'text-gray-900'}`}>
        {title}
        <div className="opacity-80 scale-75"><DotCluster /></div>
      </h2>
      <p className={`text-sm max-w-xl leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>
    </div>
    <button className={`w-full sm:w-auto border px-6 py-2 rounded-full text-xs font-semibold transition mt-2 ${
      dark ? 'border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white' : 'border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-900'
    }`}>
      Show All
    </button>
  </div>
  )
}

// ─── TikTok Embed Component ───────────────────────────────────────────────────
const TikTokEmbed = ({ videoId }: { videoId: string }) => {
  return (
    <div className="flex justify-center w-full max-w-full overflow-hidden rounded-3xl shadow-lg border border-gray-200/20 bg-black/5 dark:bg-white/5">
      <iframe
        src={`https://www.tiktok.com/embed/v2/${videoId}`}
        className="w-full h-[600px] sm:h-[720px] max-w-[605px] rounded-2xl"
        frameBorder="0"
        allow="encrypted-media;"
        allowFullScreen
      ></iframe>
    </div>
  )
}

// ─── Projects ─────────────────────────────────────────────────────────────────
const Projects = () => {
  const { dark } = useTheme()
  const works = [
    { type: 'image', src: '/1.jpg', title: 'Content Creation' },
    { type: 'image', src: '/2.jpg', title: 'Visual Branding' },
    { type: 'image', src: '/3.jpg', title: 'Marketing Design' },
    { type: 'image', src: '/4.jpg', title: 'Graphic Design' },
    { type: 'image', src: '/5.jpg', title: 'Photo Editing' },
    { type: 'image', src: '/6.jpg', title: 'Social Media Post' },
    { type: 'image', src: '/7.jpg', title: 'Brand Identity' },
    { type: 'image', src: '/8.jpg', title: 'Campaign Graphic' },
    { type: 'image', src: '/9.jpg', title: 'Engagement Content' },
  ]
  return (
    <section className="px-6 md:px-8 py-16 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="My Work"
          desc="I specialize in digital marketing campaigns, visual content creation, and brand design. Check out some of my recent graphics."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {works.map((work, index) => {
            const { ref, style } = useScrollReveal<HTMLDivElement>(index * 50)
            
            return (
              <div
                ref={ref}
                style={style}
                key={index}
                className={`relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer group border ${dark ? 'border-white/10' : 'border-gray-200 shadow-sm'}`}
              >
                <img src={work.src} alt={work.title} className="w-full h-[250px] md:h-[300px] object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute bottom-6 left-6 right-6 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-lg font-bold text-white mb-1">{work.title}</h3>
                  <p className="text-white/70 text-xs flex items-center justify-between">
                    View Image
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm text-white">↗</span>
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-20 md:mt-28">
          <SectionHeader
            title="Featured Campaigns"
            desc="Take a deeper look at my viral TikTok campaigns and video content strategies that drive massive engagement."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start justify-center">
             <TikTokEmbed videoId="7654637007133560085" />
             <TikTokEmbed videoId="7649686348143709460" />
             <TikTokEmbed videoId="7654065505824705799" />
             <TikTokEmbed videoId="7654067077954702599" />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Skills ───────────────────────────────────────────────────────────────────
const Skills = () => {
  const { dark } = useTheme()
  const skillGroups = [
    { category: 'Digital Marketing', icon: '📣', skills: ['Social Media Marketing', 'Content Strategy', 'Email Marketing', 'Lead Generation', 'Marketing Analytics', 'Inbound Marketing'] },
    { category: 'Creative & Design', icon: '🎨', skills: ['Photo Editing', 'Graphic Design', 'Content Creation', 'Visual Branding', 'Fashion Design'] },
    { category: 'SEO & Growth', icon: '📈', skills: ['Search Engine Optimization', 'SEM', 'Web Analytics', 'Brand Awareness', 'Customer Engagement'] },
    { category: 'Other Expertise', icon: '💼', skills: ['Real Estate', 'Client Relations', 'Negotiation', 'Healthcare (Nursing)'] },
  ]
  const { ref: headRef, style: headStyle } = useScrollReveal<HTMLDivElement>()

  return (
    <section className="px-6 md:px-8 py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto">
        <div ref={headRef} style={headStyle} className="mb-10 md:mb-12">
          <h2 className={`text-3xl font-bold mb-4 flex items-center gap-3 ${dark ? 'text-white' : 'text-gray-900'}`}>
            My Skills
            <div className="opacity-80 scale-75"><DotCluster /></div>
          </h2>
          <p className={`text-sm max-w-xl leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            A creative and multi-disciplinary professional with hands-on experience in digital marketing, design, and client services.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillGroups.map((group, gi) => {
            const { ref, style } = useScrollReveal<HTMLDivElement>(gi * 100)
            return (
              <div ref={ref} style={style} key={gi} className={`rounded-2xl p-6 border hover:border-red-600/30 transition-colors duration-300 ${
                dark ? 'bg-[#1a1717] border-white/5' : 'bg-white border-gray-200 shadow-sm'
              }`}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">{group.icon}</span>
                  <h3 className={`font-semibold text-base ${dark ? 'text-white' : 'text-gray-900'}`}>{group.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill, si) => (
                    <span key={si} className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                      si === 0
                        ? 'bg-red-600/20 text-red-500 border-red-600/40'
                        : dark ? 'bg-[#141212] text-gray-400 border-white/5' : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>{skill}</span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Education & Certificates ─────────────────────────────────────────────────
const EducationAndCertificates = () => {
  const { dark } = useTheme()
  const heading = dark ? 'text-white' : 'text-gray-900'
  const body = dark ? 'text-gray-400' : 'text-gray-600'
  const card = dark ? 'bg-[#1a1717] border-white/5' : 'bg-white border-gray-200 shadow-sm'
  const { ref: eduRef, style: eduStyle } = useScrollReveal<HTMLHeadingElement>()
  const { ref: certRef, style: certStyle } = useScrollReveal<HTMLHeadingElement>()

  return (
  <section className="px-6 md:px-8 py-16 relative">
    <div className="max-w-7xl mx-auto">

      {/* Education */}
      <div className="mb-20">
        <h2 ref={eduRef} style={eduStyle} className={`text-3xl font-bold mb-12 flex items-center gap-3 ${heading}`}>
          Education
          <div className="opacity-80 scale-75"><DotCluster /></div>
        </h2>
        <div className="space-y-10">
          {[
            { title: 'Digital Marketing Certificate', school: 'Qiyas Digital Marketing', desc: 'Creative digital marketer and designer with a focus on photo editing, graphic design, and content creation. I help brands grow through visuals that are clean, modern, and effective.', completed: false },
            { title: 'Nursing', school: 'Kea-Med Medical College', desc: '', completed: true },
            { title: 'Fashion Design', school: 'Fashtex Design School', desc: '', completed: true },
          ].map((item, i) => {
            const { ref, style } = useSlideReveal<HTMLDivElement>(i * 150, 'left')
            return (
              <div ref={ref} style={style} key={i} className={`relative pl-8 border-l-2 ${item.completed ? 'border-emerald-500/40' : 'border-amber-500/40'}`}>
                <div className={`absolute -left-[9px] top-1.5 w-4 h-4 border-2 rounded-full flex items-center justify-center ${item.completed ? 'bg-emerald-500 border-emerald-400' : 'bg-amber-500 border-amber-400'}`}>
                  <span className="text-white text-[8px] font-bold">{item.completed ? '✓' : '…'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <h4 className={`text-lg font-semibold ${heading}`}>{item.title}</h4>
                    <p className="text-red-500 text-sm font-medium mt-0.5">{item.school}</p>
                  </div>
                  {item.completed ? (
                    <span className="w-fit text-emerald-500 text-xs bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-1">
                      ✓ Completed
                    </span>
                  ) : (
                    <span className="w-fit text-amber-500 text-xs bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-1">
                      In Progress
                    </span>
                  )}
                </div>
                {item.desc && <p className={`text-sm leading-relaxed max-w-2xl ${body}`}>{item.desc}</p>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Certificates */}
      <div>
        <h2 ref={certRef} style={certStyle} className={`text-3xl font-bold mb-12 flex items-center gap-3 ${heading}`}>
          Certificates
          <div className="opacity-80 scale-75"><DotCluster /></div>
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {[
            { name: 'Digital Marketing Certification', issuer: 'HubSpot Academy', desc: 'Gained practical knowledge in digital marketing strategy, content creation, social media marketing, lead generation, customer journey optimization, SEO, and marketing analytics. Developed skills in planning, creating, managing, and optimizing data-driven campaigns that support business growth and customer acquisition.' },
            { name: 'Fundamentals of Digital Marketing', issuer: 'Google Digital Garage', desc: 'Completed comprehensive training in digital marketing, including SEO, SEM, social media marketing, content marketing, email marketing, web analytics, and online advertising. Developed skills in creating effective digital marketing strategies to grow brand awareness and customer engagement.', link: 'https://skillshop.exceedlms.com/student/award/3Zw5Cq2V7V3Dnwf96wzTBwTt' },
          ].map((cert, i) => {
            const { ref, style } = useScrollReveal<HTMLDivElement>(i * 150)
            return (
              <div ref={ref} style={style} key={i} className={`p-6 rounded-2xl border group hover:border-red-600/30 transition-colors duration-300 ${card}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className={`font-semibold mb-1 ${heading}`}>{cert.name}</h4>
                    <p className="text-red-500 text-xs font-medium">{cert.issuer}</p>
                  </div>
                  {cert.link ? (
                    <a href={cert.link} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-red-600/10 text-red-500 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition shrink-0 ml-4">
                      <span className="text-xs">↗</span>
                    </a>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-red-600/10 text-red-500 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition shrink-0 ml-4">
                      <span className="text-xs">↗</span>
                    </div>
                  )}
                </div>
                <p className={`text-sm leading-relaxed ${body}`}>{cert.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  </section>
  )
}

// ─── Work Experience ──────────────────────────────────────────────────────────
const WorkExperience = () => {
  const { dark } = useTheme()
  const heading = dark ? 'text-white' : 'text-gray-900'
  const body = dark ? 'text-gray-400' : 'text-gray-600'
  const card = dark ? 'bg-[#1a1717] border-white/5' : 'bg-white border-gray-200 shadow-sm'
  const tag = dark ? 'text-gray-400 bg-[#141212] border-white/5' : 'text-gray-600 bg-gray-100 border-gray-200'
  const badge = dark ? 'text-gray-500 bg-[#141212] border-white/5' : 'text-gray-500 bg-gray-100 border-gray-200'
  const { ref: titleRef, style: titleStyle } = useScrollReveal<HTMLHeadingElement>()

  return (
  <section className="px-6 md:px-8 py-16 relative">
    <div className="max-w-7xl mx-auto">
      <h2 ref={titleRef} style={titleStyle} className={`text-3xl font-bold mb-12 flex items-center gap-3 ${heading}`}>
        Work Experience
        <div className="opacity-80 scale-75"><DotCluster /></div>
      </h2>
      <div className="space-y-6">
        {[
          {
            title: 'Digital Marketing Specialist',
            company: 'Haymi Makeup & Fashion Design School',
            current: true,
            desc: 'Developing and executing digital marketing strategies to grow brand presence and attract new students. Responsibilities include creating and managing social media content, designing visual assets, running targeted ad campaigns, and analyzing performance metrics to drive enrollment and engagement.',
            skills: ['Social Media Marketing', 'Graphic Design', 'Content Creation', 'SEO', 'Photo Editing']
          },
          {
            title: 'Real Estate Agent',
            company: 'Kangaroo Real Estate',
            current: false,
            desc: 'Assisted clients in buying, selling, and renting properties by providing expert market knowledge, property listings, and personalized guidance throughout the real estate transaction process.',
            skills: ['Client Relations', 'Market Analysis', 'Negotiation', 'Property Listings']
          }
        ].map((exp, idx) => {
          const { ref, style } = useScrollReveal<HTMLDivElement>(idx * 150)
          return (
            <div ref={ref} style={style} key={idx} className={`p-6 md:p-8 rounded-2xl border hover:border-red-600/20 transition-colors duration-300 ${card}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h4 className={`text-xl font-semibold ${heading}`}>{exp.title}</h4>
                  <p className="text-red-500 text-sm font-medium mt-1">{exp.company}</p>
                </div>
                {exp.current && <span className={`w-fit text-xs border px-3 py-1 rounded-full whitespace-nowrap ${badge}`}>Current</span>}
              </div>
              <p className={`text-sm leading-relaxed ${body}`}>{exp.desc}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {exp.skills.map(t => (
                  <span key={t} className={`text-xs border px-3 py-1 rounded-full ${tag}`}>{t}</span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  </section>
  )
}

// ─── Footer CTA ───────────────────────────────────────────────────────────────
const FooterCTA = () => {
  const { dark } = useTheme()
  const { ref, style } = useScrollReveal<HTMLDivElement>()
  return (
  <section className="px-6 md:px-8 pt-20 md:pt-32 pb-16 relative">
    <div
      ref={ref}
      style={{ ...style, transition: 'opacity 0.8s ease, transform 0.8s ease' }}
      className={`max-w-7xl mx-auto rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 relative overflow-hidden border ${
        dark ? 'bg-gradient-to-br from-[#2a1b1b] to-[#141212] border-white/5' : 'bg-gradient-to-br from-red-50 to-white border-red-100'
      }`}
    >
      <div className="max-w-xl relative z-10">
        <h2 className={`text-4xl md:text-5xl font-bold mb-6 leading-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
          Let's Build<br/>
          Something <span className="text-red-600 relative inline-block">
            Amazing
            <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-red-600" />
          </span>
        </h2>
        <p className={`text-sm mb-10 max-w-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          Ready to start your next big project? Drop your email below and let's get in touch.
        </p>
        <div className={`flex items-center rounded-full p-2 max-w-md border ${
          dark ? 'bg-[#1a1717] border-white/10' : 'bg-gray-100 border-gray-200 shadow-sm'
        }`}>
          <input type="email" placeholder="Email" className={`bg-transparent border-none outline-none px-4 flex-1 text-sm ${
            dark ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'
          }`} />
          <button className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-lg shrink-0 transition">
            <span className="text-white">→</span>
          </button>
        </div>
      </div>
      <div className="hidden lg:flex absolute right-10 bottom-10 w-[240px] h-[320px] items-end pointer-events-none">
        <img src="/rebecca-hero-black.png" alt="Rebecca Abebe" className="object-cover w-full h-full rounded-3xl shadow-xl border-4 border-white/5 opacity-80" />
      </div>
    </div>
  </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = () => {
  const { dark } = useTheme()
  return (
  <footer className={`px-6 md:px-8 py-12 border-t ${ dark ? 'border-gray-800/30' : 'border-gray-200'}`}>
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
      <div className="max-w-sm">
        <div className="flex items-center gap-2 mb-4">
          <LogoDotCluster />
          <span className="text-xl font-bold text-red-600">REBECCA ABEBE</span>
        </div>
        <p className={`text-xs leading-relaxed mb-4 ${ dark ? 'text-gray-500' : 'text-gray-400'}`}>
          Creative digital marketer and designer focused on photo editing, graphic design, and content creation.
        </p>
        <div className={`flex flex-wrap items-center gap-3 text-xs ${ dark ? 'text-gray-500' : 'text-gray-400'}`}>
          <a href="mailto:rebika4553@gmail.com" className="hover:text-red-500 transition">rebika4553@gmail.com</a>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-8 sm:flex sm:gap-16">
        <div className={`flex flex-col gap-3 text-xs ${ dark ? 'text-gray-400' : 'text-gray-500'}`}>
          <span className={`font-semibold mb-1 ${ dark ? 'text-white' : 'text-gray-900'}`}>Navigation</span>
          <a href="#about" className="hover:text-red-500 transition">About</a>
          <a href="#skills" className="hover:text-red-500 transition">Skills</a>
          <a href="#portfolio" className="hover:text-red-500 transition">Portfolio</a>
        </div>
        <div className={`flex flex-col gap-3 text-xs ${ dark ? 'text-gray-400' : 'text-gray-500'}`}>
          <span className={`font-semibold mb-1 ${ dark ? 'text-white' : 'text-gray-900'}`}>Contact</span>
          <a href="mailto:rebika4553@gmail.com" className="hover:text-red-500 transition">Email Me</a>
          <a href="#contact" className="hover:text-red-500 transition">Get in Touch</a>
        </div>
      </div>
    </div>
    <div className={`max-w-7xl mx-auto mt-12 pt-6 border-t flex flex-col sm:flex-row gap-4 justify-between items-center text-xs ${
      dark ? 'border-gray-800/30 text-gray-600' : 'border-gray-200 text-gray-400'
    }`}>
      <span>© 2026 Rebecca Abebe. All rights reserved.</span>
      <span>rebika4553@gmail.com</span>
    </div>
  </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <ThemeProvider>
      <ThemedPage />
    </ThemeProvider>
  )
}

function ThemedPage() {
  const { dark } = useTheme()
  return (
    <main
      className={`overflow-x-hidden min-h-screen font-sans transition-colors duration-300 ${
        dark ? 'bg-[#141212] text-white' : 'bg-gray-50 text-gray-900'
      }`}
      style={{ scrollBehavior: 'smooth' }}
    >
      <Header />
      <section id="home"><Hero /></section>
      <section id="portfolio">
        <Projects />
      </section>
      <section id="about">
      </section>
      <section id="skills">
        <Skills />
        <EducationAndCertificates />
        <WorkExperience />
      </section>
      <section id="contact">
        <FooterCTA />
      </section>
      <Footer />
    </main>
  )
}
