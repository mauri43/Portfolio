"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// --- DESIGN RATIONALE ---
// The previous iteration was Dark Brutalist. This iteration is "Editorial Elegance".
// It relies on a warm paper-like background, classic serif typography for display text,
// strict grid alignments, and hairline dividers. It frames the developer's work
// not as "tech products" but as curated case studies in an art/design magazine.

// --- UTILITY COMPONENTS ---

const Hairline = () => (
  <div className="w-full h-[1px] bg-stone-300/60 my-16 md:my-24" />
);

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const ParallaxImage = ({ src, alt, className = "", objectFit = "cover" }: { src: string, alt: string, className?: string, objectFit?: "cover" | "contain" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden bg-stone-100 ${className}`}>
      <motion.img
        style={{ y, scale: 1.05 }}
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-${objectFit}`}
      />
    </div>
  );
};

// CSS-Only Phone Mockup
const PhoneMockup = ({ src, alt }: { src: string, alt: string }) => (
  <div className="relative w-[280px] sm:w-[320px] aspect-[9/19.5] bg-stone-800 rounded-[3rem] p-3 shadow-2xl shrink-0 ring-1 ring-stone-900/10">
    <div className="absolute top-0 inset-x-0 h-7 w-32 bg-stone-800 mx-auto rounded-b-3xl z-20 shadow-inner" />
    <div className="relative w-full h-full bg-stone-950 rounded-[2.25rem] overflow-hidden isolate">
       <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
    </div>
  </div>
);


// --- MAIN PAGE COMPONENT ---

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] font-sans selection:bg-stone-300 selection:text-stone-900">

      {/* Navigation - Minimalist */}
      <nav className="fixed top-0 w-full px-6 py-8 flex justify-between items-center z-50 mix-blend-difference text-stone-200">
        <span className="font-serif text-xl tracking-tight">M.</span>
        <div className="flex gap-6 text-sm font-medium tracking-wide uppercase">
          <a href="#work" className="hover:opacity-70 transition-opacity">Work</a>
          <a href="#philosophy" className="hover:opacity-70 transition-opacity">Philosophy</a>
          <a href="#contact" className="hover:opacity-70 transition-opacity">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-48 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-[85vh] flex flex-col justify-end">
        <FadeIn>
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tighter mb-8">
            Mauricio
            <br />
            <span className="text-stone-400 italic">Technologist.</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2} className="flex flex-col md:flex-row justify-between items-end gap-12 border-t border-stone-300 pt-8 mt-12">
          <p className="max-w-xl text-lg md:text-xl text-stone-600 leading-relaxed font-light">
            Architecting intelligent systems and beautiful interfaces.
            A portfolio of selected works exploring artificial intelligence,
            spatial interfaces, and native engineering.
          </p>
          <div className="text-sm font-mono text-stone-400 uppercase tracking-widest text-right">
            <p>Based in</p>
            <p className="text-stone-900">Washington, D.C.</p>
          </div>
        </FadeIn>
      </header>


      <main id="work" className="px-6 md:px-12 max-w-7xl mx-auto pb-32">

        {/* --- PROJECT 1: TRAVEL GLOBE --- */}
        <section className="py-24">
          <Hairline />
          <FadeIn>
            <div className="flex flex-col lg:flex-row justify-between items-baseline mb-12 gap-8">
              <h2 className="font-serif text-5xl md:text-7xl tracking-tight">Travel Globe</h2>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-stone-500 uppercase tracking-wider">
                <span>Interactive 3D Web App</span>
                <span>—</span>
                <span>2025</span>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            <FadeIn delay={0.1} className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <p className="text-lg text-stone-700 leading-relaxed mb-8">
                  A 3D interactive globe where you pin every city you&apos;ve visited and watch animated flight paths arc across the planet. Custom GLSL shaders render a glowing atmosphere, shooting stars streak through the background, and tiny plane icons trace your routes in real-time.
                </p>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Features</h4>
                    <ul className="space-y-3">
                      <li className="flex gap-4 items-start"><span className="font-serif text-stone-400">1.</span> <span className="text-stone-800">Animated flight paths with particle trails.</span></li>
                      <li className="flex gap-4 items-start"><span className="font-serif text-stone-400">2.</span> <span className="text-stone-800">Custom GLSL atmosphere & shaders.</span></li>
                      <li className="flex gap-4 items-start"><span className="font-serif text-stone-400">3.</span> <span className="text-stone-800">Social sharing & explorer profiles.</span></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 mt-8">Tech Stack</h4>
                    <p className="text-sm font-mono text-stone-600 leading-relaxed">React, Three.js, React Three Fiber, Firebase, Zustand, TypeScript</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-stone-200">
                <a href="https://github.com/mauri43/travel-globe" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest hover:text-stone-500 transition-colors group">
                  View Repository
                  <span className="block transform group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={0.2} className="lg:col-span-7">
              <ParallaxImage src="/projects/travel-globe/hero.png" alt="Travel Globe Hero" className="aspect-[4/3] w-full" />
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FadeIn delay={0.3}>
               <ParallaxImage src="/projects/travel-globe/globe.png" alt="3D Globe View" className="aspect-square w-full" />
            </FadeIn>
            <FadeIn delay={0.4}>
               <ParallaxImage src="/projects/travel-globe/landing.png" alt="Landing Page Layout" className="aspect-square w-full object-top" objectFit="cover" />
            </FadeIn>
          </div>
        </section>


        {/* --- PROJECT 2: INKLINE --- */}
        <section className="py-24">
          <Hairline />
          <FadeIn>
            <div className="flex flex-col lg:flex-row justify-between items-baseline mb-12 gap-8">
              <h2 className="font-serif text-5xl md:text-7xl tracking-tight">Inkline</h2>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-stone-500 uppercase tracking-wider">
                <span>AI Creative Tool</span>
                <span>—</span>
                <span>2025</span>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            <FadeIn delay={0.1} className="lg:col-span-8 order-2 lg:order-1">
               <ParallaxImage src="/projects/inkline/hero.png" alt="Inkline Hero View" className="aspect-video w-full mb-6" />
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <img src="/projects/inkline/original.jpg" alt="Original Photo" className="w-full aspect-square object-cover bg-stone-100" />
                  <img src="/projects/inkline/vangogh.jpg" alt="Van Gogh Style" className="w-full aspect-square object-cover bg-stone-100" />
                  <img src="/projects/inkline/warhol.jpg" alt="Warhol Style" className="w-full aspect-square object-cover bg-stone-100" />
                  <img src="/projects/inkline/app.png" alt="App Interface" className="w-full aspect-square object-cover object-top bg-stone-100" />
               </div>
            </FadeIn>

            <FadeIn delay={0.2} className="lg:col-span-4 order-1 lg:order-2 flex flex-col justify-between">
              <div>
                <p className="text-lg text-stone-700 leading-relaxed mb-8">
                  Transform any photograph into stunning artwork using Google Gemini&apos;s generative AI. Ships as both a polished web app and a native iOS app with a shared serverless backend.
                </p>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Features</h4>
                    <ul className="space-y-3">
                      <li className="flex gap-4 items-start"><span className="font-serif text-stone-400">1.</span> <span className="text-stone-800">8 distinct AI art styles driven by Gemini.</span></li>
                      <li className="flex gap-4 items-start"><span className="font-serif text-stone-400">2.</span> <span className="text-stone-800">Side-by-side &apos;Compare All&apos; mode.</span></li>
                      <li className="flex gap-4 items-start"><span className="font-serif text-stone-400">3.</span> <span className="text-stone-800">Gamified achievement system.</span></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 mt-8">Tech Stack</h4>
                    <p className="text-sm font-mono text-stone-600 leading-relaxed">React, React Native, Python, FastAPI, Gemini, Firebase</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-stone-200 flex flex-col gap-4">
                <a href="https://line-art-phi.vercel.app" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest hover:text-stone-500 transition-colors group">
                  View Live Site
                  <span className="block transform group-hover:translate-x-1 transition-transform">→</span>
                </a>
                <a href="https://github.com/mauri43/inkline" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest hover:text-stone-500 transition-colors group text-stone-400">
                  View Repository
                  <span className="block transform group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </FadeIn>
          </div>
        </section>


        {/* --- PROJECT 3: DC METRO WIDGET --- */}
        <section className="py-24">
          <Hairline />
          <FadeIn>
            <div className="flex flex-col lg:flex-row justify-between items-baseline mb-12 gap-8">
              <h2 className="font-serif text-5xl md:text-7xl tracking-tight">DC Metro</h2>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-stone-500 uppercase tracking-wider">
                <span>Native iOS App</span>
                <span>—</span>
                <span>2025</span>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <FadeIn delay={0.1} className="lg:col-span-5 flex flex-col justify-center">
              <div>
                <p className="text-lg text-stone-700 leading-relaxed mb-8">
                  Real-time DC Metro arrivals directly on your home screen, lock screen, and Dynamic Island. Built against the WMATA API with zero backend costs, featuring a live map with animated train positions and smart commute-mode direction filtering.
                </p>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Features</h4>
                    <ul className="space-y-3">
                      <li className="flex gap-4 items-start"><span className="font-serif text-stone-400">1.</span> <span className="text-stone-800">Dynamic Island Live Activities with 15s polling.</span></li>
                      <li className="flex gap-4 items-start"><span className="font-serif text-stone-400">2.</span> <span className="text-stone-800">Interactive MapKit view with pulsing live trains.</span></li>
                      <li className="flex gap-4 items-start"><span className="font-serif text-stone-400">3.</span> <span className="text-stone-800">Smart Commute Mode filtering based on time of day.</span></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 mt-8">Tech Stack</h4>
                    <p className="text-sm font-mono text-stone-600 leading-relaxed">Swift, SwiftUI, WidgetKit, ActivityKit, MapKit</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-stone-200">
                <a href="https://github.com/mauri43/DCMetroWidget" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest hover:text-stone-500 transition-colors group">
                  View Repository
                  <span className="block transform group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={0.2} className="lg:col-span-7 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
              <div className="flex gap-8 w-max lg:w-full lg:justify-end px-4 lg:px-0">
                <div className="snap-center"><PhoneMockup src="/projects/dc-metro/livemap.png" alt="Live Map View" /></div>
                <div className="snap-center mt-12 lg:mt-24"><PhoneMockup src="/projects/dc-metro/arrivals.png" alt="Arrivals View" /></div>
                <div className="snap-center hidden md:block"><PhoneMockup src="/projects/dc-metro/widgets.png" alt="iOS Widgets" /></div>
              </div>
            </FadeIn>
          </div>
        </section>


        {/* --- PROJECT 4: LIFE ORGANIZER --- */}
        <section className="py-24">
          <Hairline />
          <FadeIn>
            <div className="flex flex-col lg:flex-row justify-between items-baseline mb-12 gap-8">
              <h2 className="font-serif text-5xl md:text-7xl tracking-tight">Life Organizer</h2>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-stone-500 uppercase tracking-wider">
                <span>Full-Stack Mobile</span>
                <span>—</span>
                <span>2025</span>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <FadeIn delay={0.2} className="lg:col-span-7 order-2 lg:order-1 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
              <div className="flex gap-8 w-max px-4 lg:px-0">
                <div className="snap-center mt-12 lg:mt-24"><PhoneMockup src="/projects/life-organizer/home.png" alt="Home Dashboard" /></div>
                <div className="snap-center"><PhoneMockup src="/projects/life-organizer/groceries.png" alt="Grocery List" /></div>
                <div className="snap-center hidden md:block mt-12 lg:mt-24"><PhoneMockup src="/projects/life-organizer/restaurants.png" alt="Restaurants" /></div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1} className="lg:col-span-5 order-1 lg:order-2 flex flex-col justify-center">
              <div>
                <p className="text-lg text-stone-700 leading-relaxed mb-8">
                  An 18,000-line React Native app that consolidates every aspect of daily life. Features location-based reminders, AI-powered meal planning, real-time household syncing, and deep iOS integrations.
                </p>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Features</h4>
                    <ul className="space-y-3">
                      <li className="flex gap-4 items-start"><span className="font-serif text-stone-400">1.</span> <span className="text-stone-800">Geofenced location-aware task alerts.</span></li>
                      <li className="flex gap-4 items-start"><span className="font-serif text-stone-400">2.</span> <span className="text-stone-800">Real-time household collaboration.</span></li>
                      <li className="flex gap-4 items-start"><span className="font-serif text-stone-400">3.</span> <span className="text-stone-800">All-in-one dashboard (weather, tasks, lists).</span></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 mt-8">Tech Stack</h4>
                    <p className="text-sm font-mono text-stone-600 leading-relaxed">React Native, Expo, Firebase, Cloud Functions, iOS WidgetKit</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-stone-200">
                <a href="https://github.com/mauri43/LifeOrganizer" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest hover:text-stone-500 transition-colors group">
                  View Repository
                  <span className="block transform group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

      </main>

      {/* Philosophy / About Section */}
      <section id="philosophy" className="bg-stone-900 text-stone-100 py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <h2 className="font-serif text-4xl md:text-6xl text-stone-400 mb-16">Approach</h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <FadeIn delay={0.1}>
              <p className="font-serif text-3xl md:text-5xl leading-tight text-white mb-8">
                &ldquo;Code is merely the medium. The outcome must be human, intuitive, and relentlessly polished.&rdquo;
              </p>
            </FadeIn>

            <FadeIn delay={0.2} className="space-y-8 text-lg text-stone-400 font-light leading-relaxed">
              <p>
                I build digital products with a focus on spatial reasoning, native performance, and the thoughtful application of artificial intelligence. My work straddles the line between rigid engineering and fluid design.
              </p>
              <p>
                Whether it&apos;s writing custom GLSL shaders for a web-based globe, or optimizing Swift background tasks to keep a widget updated without draining battery, I believe the best user experiences require diving deep into the technical weeds while keeping the human element in pristine focus.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <FadeIn className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div>
            <h2 className="font-serif text-5xl md:text-7xl tracking-tight mb-8">Let&apos;s connect.</h2>
            <a href="mailto:hello@example.com" className="text-xl md:text-2xl font-light hover:text-stone-500 transition-colors border-b border-stone-300 pb-1">
              hello@example.com
            </a>
          </div>

          <div className="flex flex-col gap-4 text-sm font-mono uppercase tracking-widest text-stone-500 text-left md:text-right">
            <a href="https://github.com/mauri43" target="_blank" rel="noreferrer" className="hover:text-stone-900 transition-colors">GitHub</a>
            <a href="#" className="hover:text-stone-900 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-stone-900 transition-colors">Read.cv</a>
          </div>
        </FadeIn>

        <div className="mt-32 pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between text-xs font-mono text-stone-400 uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} Mauricio</p>
          <p>Designed & Engineered with Intent</p>
        </div>
      </footer>

      {/* Scrollbar hiding styles for phone mockup horizontal scroll */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
