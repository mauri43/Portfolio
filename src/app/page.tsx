"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Environment } from "@react-three/drei";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import * as THREE from "three";

// ==========================================
// PROJECT DATA
// ==========================================
const PROJECTS = [
  {
    id: "01",
    title: "Travel Globe",
    type: "Interactive 3D Web App",
    year: "2025",
    tech: "React, Three.js, React Three Fiber, Firebase, Zustand, TypeScript",
    color: "#1e3a5f",
    heroImage: "/projects/travel-globe/globe.png",
    description: "A 3D interactive globe where you pin every city you've visited and watch animated flight paths arc across the planet. Custom GLSL shaders render a glowing atmosphere, shooting stars streak through the background, and tiny plane icons trace your routes in real-time. Social features let you explore other travelers' globes.",
    features: [
      { title: "Animated Flight Paths", desc: "Curved arcs with particle trails and plane icons animate from your home city to every destination on the globe." },
      { title: "Custom GLSL Atmosphere", desc: "Hand-written vertex and fragment shaders create a realistic atmospheric glow around the planet." },
      { title: "Social Globe Sharing", desc: "Set a username, browse other travelers' globes, and share flight routes between users." },
    ],
    gallery: ["/projects/travel-globe/hero.png", "/projects/travel-globe/globe.png", "/projects/travel-globe/landing.png"],
    links: { live: null, github: "https://github.com/mauri43/travel-globe" },
  },
  {
    id: "02",
    title: "Inkline",
    type: "AI-Powered Creative Tool",
    year: "2025",
    tech: "React, React Native, TypeScript, Python, FastAPI, Google Gemini, Firebase",
    color: "#d97706",
    heroImage: "/projects/inkline/hero.png",
    description: "Transform any photograph into stunning artwork using Google Gemini's generative AI. Choose from 8 artistic styles — clean line-art tattoo contours, Van Gogh's impasto brushstrokes, Warhol's pop-art silkscreens — and watch your photo reimagined in seconds. Ships as both a polished web app and a native iOS app with a shared serverless backend.",
    features: [
      { title: "8 AI Art Styles", desc: "From minimalist line drawings to Picasso and Warhol — each powered by finely tuned Gemini prompts that produce dramatically different results." },
      { title: "Compare All Mode", desc: "Generate every style simultaneously in a single tap, displaying results in a side-by-side grid for instant comparison." },
      { title: "Gamified Achievement System", desc: "18 unlockable badges across 4 rarity tiers with secret time-based challenges like generating art at 3 AM or on Halloween." },
    ],
    gallery: ["/projects/inkline/app.png", "/projects/inkline/vangogh.jpg", "/projects/inkline/warhol.jpg"],
    links: { live: "https://line-art-phi.vercel.app", github: "https://github.com/mauri43/inkline" },
  },
  {
    id: "03",
    title: "DC Metro Widget",
    type: "Native iOS App",
    year: "2025",
    tech: "Swift, SwiftUI, WidgetKit, ActivityKit, MapKit, CoreLocation, StoreKit 2",
    color: "#009CDE",
    heroImage: "/projects/dc-metro/livemap.png",
    description: "Real-time DC Metro and Metrobus arrivals directly on your home screen, lock screen, and Dynamic Island. Built against the WMATA API with zero backend costs, it features a live map with animated train positions, smart commute-mode direction filtering, and 15 customizable widget themes. Filling the gap left by MetroHero's shutdown for DC's 600K+ daily riders.",
    features: [
      { title: "Dynamic Island Live Activity", desc: "Track a station in real-time from the Dynamic Island with 15-second polling and automatic timeout." },
      { title: "Live Train Map", desc: "Interactive MapKit view plots live train positions with pulsing, direction-aware markers across all 6 metro lines." },
      { title: "Smart Commute Mode", desc: "Automatically filters your widget to show only trains in your commute direction based on time of day." },
    ],
    gallery: ["/projects/dc-metro/arrivals.png", "/projects/dc-metro/widgets.png", "/projects/dc-metro/livemap.png"],
    links: { live: null, github: "https://github.com/mauri43/DCMetroWidget" },
  },
  {
    id: "04",
    title: "Life Organizer",
    type: "Full-Stack Mobile App",
    year: "2025",
    tech: "React Native, Expo, Firebase, Cloud Functions, iOS WidgetKit, Maps",
    color: "#6366f1",
    heroImage: "/projects/life-organizer/home.png",
    description: "An 18,000-line React Native app that consolidates every aspect of daily life into one place. Tasks with location-based reminders that trigger when you arrive at the grocery store, a recipe manager with AI-powered meal planning, household sharing with real-time sync, calendar integration, weather-aware suggestions, and an iOS home screen widget — all backed by Firebase with Cloud Functions.",
    features: [
      { title: "Location-Aware Reminders", desc: "Geofenced task alerts that fire when you physically arrive at the relevant location — no more forgetting at the store." },
      { title: "Household Collaboration", desc: "Share tasks, grocery lists, and meal plans with family members in real-time with per-item assignment and completion tracking." },
      { title: "All-in-One Dashboard", desc: "Track ideas, to-dos, activities, groceries, restaurants, and gifts — everything in one place instead of scattered across a dozen apps." },
    ],
    gallery: ["/projects/life-organizer/home.png", "/projects/life-organizer/groceries.png", "/projects/life-organizer/restaurants.png"],
    links: { live: null, github: "https://github.com/mauri43/LifeOrganizer" },
  },
];

// ==========================================
// PHONE MOCKUP — Pure CSS iPhone frame
// ==========================================
// Avoids heavy PNGs, maintains crispness across resolutions.
// Nested rounded corners simulate a premium dark bezel.
// Dynamic Island signals "modern iOS" context.
const PhoneMockup = ({ src, alt, className = "" }: { src: string; alt: string; className?: string }) => (
  <div className={`relative w-full max-w-[320px] aspect-[9/19.5] p-[6px] md:p-[8px] bg-zinc-800 rounded-[2.5rem] shadow-2xl shadow-black/80 ring-1 ring-zinc-700/50 flex-shrink-0 ${className}`}>
    <div className="relative w-full h-full bg-zinc-950 rounded-[2.1rem] overflow-hidden border border-black/50">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-[22px] bg-black rounded-full z-20 flex items-center justify-end px-2 shadow-md">
        <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1c] ring-1 ring-white/10 mr-0.5" />
      </div>
      <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover object-top" />
    </div>
  </div>
);

// ==========================================
// 3D COMPONENT — Mouse-reactive organic blob
// ==========================================
// Uses MathUtils.damp for physics-based lerping — creates a heavy, viscous
// "liquid metal" feel. The blob follows cursor with magnetic attraction,
// scales up when cursor is near center, and tilts toward the pointer.
function OrganicNode() {
  const meshRef = useRef<THREE.Mesh>(null);
  const time = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    time.current += delta;

    // Base organic rotation (always moving)
    const baseRotX = time.current * 0.1;
    const baseRotY = time.current * 0.15;

    // state.pointer is normalized (-1 to 1) representing cursor position
    const pointer = state.pointer;
    const distanceToCenter = new THREE.Vector2(pointer.x, pointer.y).length();

    // The node "looks" slightly towards the cursor
    const targetRotX = baseRotX - pointer.y * 0.4;
    const targetRotY = baseRotY + pointer.x * 0.4;

    // Subtle magnetic pull toward cursor
    const targetPosX = pointer.x * 0.8;
    const targetPosY = pointer.y * 0.8;

    // Expands slightly when cursor is near center
    const intensity = Math.max(0, 1 - distanceToCenter);
    const targetScale = 1.5 + (intensity * 0.2);

    // Physics damping — lower = heavier, slower feeling
    const dampFactor = 3.5;

    meshRef.current.rotation.x = THREE.MathUtils.damp(meshRef.current.rotation.x, targetRotX, dampFactor, delta);
    meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, targetRotY, dampFactor, delta);
    meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, targetPosX, dampFactor, delta);
    meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetPosY, dampFactor, delta);

    const currentScale = meshRef.current.scale.x;
    const newScale = THREE.MathUtils.damp(currentScale, targetScale, dampFactor, delta);
    meshRef.current.scale.setScalar(newScale);
  });

  return (
    <Sphere ref={meshRef} args={[1, 128, 128]} scale={1.5}>
      <MeshDistortMaterial
        color="#18181b"
        emissive="#000000"
        envMapIntensity={1.5}
        clearcoat={1}
        clearcoatRoughness={0.1}
        metalness={0.9}
        roughness={0.2}
        distort={0.4}
        speed={1.5}
      />
    </Sphere>
  );
}

// ==========================================
// HERO CANVAS — Client-only mount to avoid hydration mismatch
// ==========================================
function HeroCanvas() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="absolute inset-0 z-0 opacity-70" aria-hidden="true" />;

  return (
    <div className="absolute inset-0 z-0 opacity-70 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        eventSource={document.body}
        eventPrefix="client"
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#a1a1aa" />
        <Environment preset="city" />
        <OrganicNode />
      </Canvas>
    </div>
  );
}

// ==========================================
// PROJECT DETAIL — Full-screen case study overlay
// ==========================================
// Clip-path curtain reveal for cinematic open/close transitions.
const overlayVariants = {
  hidden: { clipPath: "inset(100% 0 0 0)" },
  visible: {
    clipPath: "inset(0% 0 0 0)",
    transition: { type: "spring" as const, damping: 30, stiffness: 100, mass: 0.8 },
  },
  exit: {
    clipPath: "inset(0 0 100% 0)",
    transition: { type: "spring" as const, damping: 30, stiffness: 100, mass: 0.8 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 25, stiffness: 100 },
  },
};

function ProjectDetail({ project, onClose }: { project: typeof PROJECTS[number]; onClose: () => void }) {
  const isMobileApp = project.type.includes("App") && !project.type.includes("Web");
  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      data-lenis-prevent
      className="fixed inset-0 z-50 bg-[#09090b] overflow-y-auto overflow-x-hidden text-[#fafafa]"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-0 right-0 z-50 p-6 md:p-8 group cursor-pointer mix-blend-difference"
      >
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Close Project
          </span>
          <div className="relative w-8 h-8 flex items-center justify-center">
            <span className="absolute w-full h-[1px] bg-white rotate-45 transition-transform duration-500 group-hover:rotate-180" />
            <span className="absolute w-full h-[1px] bg-white -rotate-45 transition-transform duration-500 group-hover:-rotate-180" />
          </div>
        </div>
      </button>

      <div className="min-h-screen px-4 md:px-12 py-24 md:py-32 max-w-[1800px] mx-auto">

        {/* HERO: Metadata + Massive Title */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-12 gap-y-8 md:gap-4 mb-32"
        >
          <motion.div variants={fadeUpVariants} className="col-span-12 md:col-span-3 flex flex-col gap-8 mt-4">
            <div>
              <p className="font-mono text-[10px] text-[#52525b] uppercase tracking-[0.2em] mb-2">ID</p>
              <p className="font-mono text-sm tracking-wider">{project.id}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-[#52525b] uppercase tracking-[0.2em] mb-2">Role</p>
              <p className="font-mono text-sm tracking-wider">{project.type}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-[#52525b] uppercase tracking-[0.2em] mb-2">Year</p>
              <p className="font-mono text-sm tracking-wider">{project.year}</p>
            </div>
          </motion.div>

          <motion.div variants={fadeUpVariants} className="col-span-12 md:col-span-9">
            <h1 className="text-6xl md:text-[10vw] font-medium leading-[0.85] tracking-tighter uppercase">
              {project.title}
            </h1>
          </motion.div>
        </motion.div>

        {/* HERO IMAGE — Asymmetric for web, phone mockup for apps */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="grid grid-cols-12 gap-4 mb-32 md:mb-48"
        >
          {isMobileApp ? (
            <div className="col-span-12 md:col-start-3 md:col-span-8 flex justify-center items-center py-20 md:py-32 bg-zinc-900 border border-zinc-800/50 relative overflow-hidden group">
              <div className="absolute inset-0 border border-white/10 pointer-events-none z-20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] aspect-square bg-zinc-800/30 blur-[100px] rounded-full z-0" />
              <PhoneMockup
                src={project.heroImage}
                alt={project.title}
                className="w-[65%] sm:w-[50%] md:w-[40%] max-w-[360px] transition-transform duration-[1.5s] ease-out group-hover:scale-105 group-hover:-translate-y-4"
              />
            </div>
          ) : (
            <div className="col-span-12 md:col-start-3 md:col-span-10 aspect-[16/9] md:aspect-[21/9] bg-zinc-800 relative overflow-hidden group">
              <img
                src={project.heroImage}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 border border-white/10 pointer-events-none" />
            </div>
          )}
        </motion.div>

        {/* OVERVIEW & TECH */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
          className="grid grid-cols-12 gap-y-16 md:gap-4 mb-32 md:mb-48 border-t border-[#52525b]/30 pt-12 md:pt-24"
        >
          <motion.div variants={fadeUpVariants} className="col-span-12 md:col-span-4">
            <h3 className="font-mono text-[10px] text-[#52525b] uppercase tracking-[0.2em] mb-6">Overview</h3>
            <p className="font-mono text-sm text-[#fafafa]/70 leading-relaxed uppercase tracking-widest max-w-xs">
              Deconstructing standard patterns to establish a new vernacular.
            </p>
          </motion.div>

          <motion.div variants={fadeUpVariants} className="col-span-12 md:col-span-7 md:col-start-6">
            <p className="text-2xl md:text-4xl font-light leading-snug tracking-tight mb-16">
              {project.description}
            </p>
            <div className="flex flex-col gap-4">
              <h3 className="font-mono text-[10px] text-[#52525b] uppercase tracking-[0.2em] mb-2">Stack / Medium</h3>
              <div className="flex flex-wrap gap-3">
                {project.tech.split(", ").map((t, i) => (
                  <span key={i} className="px-4 py-2 border border-[#52525b]/30 font-mono text-xs uppercase tracking-wider rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* FEATURES — Card-less, raw lines and space */}
        <div className="mb-32 md:mb-48">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-[10px] text-[#52525b] uppercase tracking-[0.2em] mb-12 border-b border-[#52525b]/30 pb-4"
          >
            Key Highlights
          </motion.h3>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          >
            {project.features.map((feature, i) => (
              <motion.div key={i} variants={fadeUpVariants} className="flex flex-col group">
                <span className="font-mono text-4xl text-[#52525b]/30 mb-6 transition-colors duration-500 group-hover:text-[#fafafa]">
                  0{i + 1}
                </span>
                <h4 className="text-xl md:text-2xl font-medium tracking-tight mb-4">{feature.title}</h4>
                <p className="text-[#fafafa]/60 font-light leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* GALLERY — Asymmetrical moodboard for web, staggered phones for apps */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
          className="grid grid-cols-12 gap-4 mb-32"
        >
          {isMobileApp ? (
            <div className="col-span-12 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-8 px-4 md:px-0">
              {project.gallery.slice(0, 3).map((src, i) => (
                <motion.div
                  key={i}
                  variants={fadeUpVariants}
                  className={`relative w-[75%] sm:w-[50%] md:w-[28%] max-w-[320px] transition-transform duration-[1.5s] ease-out group
                    ${i === 0 ? "md:mt-24 md:-rotate-2 z-10" : ""}
                    ${i === 1 ? "md:-mt-12 z-20 md:scale-110" : ""}
                    ${i === 2 ? "md:mt-32 md:rotate-2 z-10" : ""}
                  `}
                >
                  <PhoneMockup
                    src={src}
                    alt={`${project.title} screenshot ${i + 1}`}
                    className="w-full group-hover:-translate-y-6 transition-transform duration-1000"
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <>
              {project.gallery.map((src, i) => (
                <motion.div
                  key={i}
                  variants={fadeUpVariants}
                  className={`bg-zinc-900 overflow-hidden group border border-zinc-800/50 relative
                    ${i === 0 ? "col-span-12 md:col-span-8 aspect-[4/3]" : ""}
                    ${i === 1 ? "col-span-12 md:col-span-4 aspect-[3/4]" : ""}
                    ${i === 2 ? "col-span-12 aspect-[21/9] mt-4 md:mt-0" : ""}
                  `}
                >
                  <div className="absolute inset-0 border border-white/5 pointer-events-none z-20" />
                  <img
                    src={src}
                    alt={`${project.title} screenshot ${i + 1}`}
                    className="w-full h-full object-cover object-center transition-transform duration-[1.5s] ease-out group-hover:scale-105 origin-center"
                  />
                </motion.div>
              ))}
            </>
          )}
        </motion.div>

        {/* ACTIONS */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="py-24 md:py-32 border-t border-[#52525b]/30 flex flex-col items-center justify-center text-center"
        >
          <p className="font-mono text-[10px] text-[#52525b] uppercase tracking-[0.2em] mb-8">Deployments</p>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noreferrer"
                className="group relative text-4xl md:text-6xl font-medium tracking-tighter uppercase overflow-hidden"
              >
                <span className="block transition-transform duration-500 group-hover:-translate-y-full">Visit Live Site</span>
                <span className="absolute inset-0 block translate-y-full transition-transform duration-500 group-hover:translate-y-0 text-[#52525b]">Visit Live Site</span>
              </a>
            )}
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="group relative text-4xl md:text-6xl font-medium tracking-tighter uppercase overflow-hidden"
            >
              <span className="block transition-transform duration-500 group-hover:-translate-y-full">View Source</span>
              <span className="absolute inset-0 block translate-y-full transition-transform duration-500 group-hover:translate-y-0 text-[#52525b]">View Source</span>
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ==========================================
// PROJECT ITEM — Full-viewport immersive card with parallax
// ==========================================
function ProjectItem({ project, index, onExplore }: { project: typeof PROJECTS[number]; index: number; onExplore: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;
  const isMobileApp = project.type.includes("App") && !project.type.includes("Web");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Spring-wrapped scroll for weighty, high-end feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const yImage = useTransform(smoothProgress, [0, 1], ["-15%", "15%"]);
  const yText = useTransform(smoothProgress, [0, 1], ["25%", "-25%"]);
  const scaleImageInner = useTransform(smoothProgress, [0, 1], [1.1, 1]);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center py-16 md:py-24 overflow-hidden"
    >
      <div
        className={`relative z-10 w-full max-w-[90rem] mx-auto px-4 sm:px-8 md:px-16 flex flex-col ${
          isEven ? "md:items-end" : "md:items-start"
        }`}
      >
        {/* Image wrapper with parallax */}
        <div className="relative w-full md:w-[75%] aspect-[4/5] md:aspect-[16/10] overflow-hidden bg-zinc-900 border border-zinc-800/50 flex items-center justify-center">
          {isMobileApp ? (
            <motion.div
              style={{ y: yImage }}
              className="relative z-10 w-[80%] md:w-full flex justify-center items-center h-full"
            >
              <PhoneMockup
                src={project.heroImage}
                alt={project.title}
                className="w-[55%] md:w-[32%] z-20 rotate-[-2deg] transition-transform duration-700 hover:rotate-0 hover:scale-105"
              />
              {project.gallery[1] && (
                <PhoneMockup
                  src={project.gallery[1]}
                  alt={`${project.title} secondary view`}
                  className="absolute right-[10%] md:right-[25%] top-[15%] w-[50%] md:w-[28%] z-10 rotate-[4deg] opacity-40 blur-[2px] scale-90"
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              style={{ y: yImage, scale: scaleImageInner }}
              className="absolute -inset-[10%] w-[120%] h-[120%]"
            >
              <img
                src={project.heroImage}
                alt={project.title}
                className="w-full h-full object-cover object-center opacity-70 transition-opacity duration-700 hover:opacity-100"
              />
            </motion.div>
          )}

          {/* Registration marks — brutalist print design detail */}
          <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-zinc-500/50 pointer-events-none z-30" />
          <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-zinc-500/50 pointer-events-none z-30" />
          <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-zinc-500/50 pointer-events-none z-30" />
          <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-zinc-500/50 pointer-events-none z-30" />
        </div>

        {/* Overlapping text block — negative margin pulls over image */}
        <motion.div
          style={{ y: yText }}
          className={`relative z-20 mt-[-15%] md:mt-[-10%] ${
            isEven ? "md:mr-auto md:ml-12 lg:ml-24" : "md:ml-auto md:mr-12 lg:mr-24"
          } w-[95%] sm:w-[85%] md:w-[60%] lg:w-[50%] bg-[#09090b] p-6 sm:p-10 lg:p-16 border border-zinc-800 shadow-2xl`}
        >
          <div className="flex flex-col gap-6">
            {/* Meta: tiny monospaced details */}
            <div className="flex items-center gap-4 text-zinc-500 font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] whitespace-nowrap overflow-hidden">
              <span>{project.id}</span>
              <span className="w-8 h-[1px] bg-zinc-700" />
              <span>{project.year}</span>
              <span className="w-8 h-[1px] bg-zinc-700 hidden sm:block" />
              <span className="hidden sm:block">{project.type}</span>
            </div>

            {/* Massive title */}
            <h3 className="text-5xl sm:text-6xl lg:text-8xl xl:text-9xl font-black tracking-tighter uppercase text-zinc-100 leading-[0.85]">
              {project.title}
            </h3>

            <div className="pt-6 sm:pt-8 mt-4 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-4">
              <p className="font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-zinc-400 leading-relaxed max-w-[250px]">
                {project.tech}
              </p>

              <button onClick={onExplore} className="group flex items-center gap-3 font-mono text-xs tracking-widest uppercase text-white w-fit cursor-pointer">
                <span className="relative overflow-hidden h-4">
                  <span className="block transition-transform duration-300 group-hover:-translate-y-full">Explore</span>
                  <span className="absolute inset-0 block translate-y-full transition-transform duration-300 group-hover:translate-y-0">Explore</span>
                </span>
                <span className="block w-8 h-[1px] bg-white transition-all duration-300 group-hover:w-12" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ==========================================
// PROJECTS SECTION — Massive background "ARCHIVE" text with parallax cards
// ==========================================
function ProjectsSection({ onExplore }: { onExplore: (project: typeof PROJECTS[number]) => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const yBgText = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#09090b] text-zinc-100">
      {/* Sticky massive background typography — architectural scale */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden pointer-events-none z-0 -mb-[100vh]">
        <motion.h2
          style={{ y: yBgText }}
          className="text-[20vw] font-black tracking-tighter text-[#121214] select-none"
        >
          ARCHIVE
        </motion.h2>
      </div>

      {/* Projects */}
      <div className="relative z-10 flex flex-col">
        {PROJECTS.map((project, index) => (
          <ProjectItem key={project.id} project={project} index={index} onExplore={() => onExplore(project)} />
        ))}
      </div>
    </section>
  );
}

// ==========================================
// MAIN PAGE
// ==========================================
export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[number] | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Smooth scrolling via Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // Stop/start Lenis when overlay opens/closes
  useEffect(() => {
    if (selectedProject) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  }, [selectedProject]);

  // Scroll animation for philosophy section
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });

  const opacityTransform = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const yTransform = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

  return (
    <main className="bg-zinc-950 text-zinc-50 min-h-screen selection:bg-zinc-50 selection:text-zinc-950 font-sans">

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 left-0 w-full p-6 md:p-12 flex justify-between items-center z-50 mix-blend-difference">
        <div className="font-mono text-xs uppercase tracking-[0.2em]">
          Builder
        </div>
        <div className="font-mono text-xs uppercase tracking-[0.2em]">
          Available &apos;24
        </div>
      </nav>

      {/* --- HERO --- */}
      <section className="relative h-screen w-full flex flex-col justify-end p-6 md:p-12 overflow-hidden">
        {/* 3D canvas — client-only to avoid SSR hydration mismatch */}
        <HeroCanvas />

        {/* Hero typography — massive, tight, immediate impact */}
        <div className="relative z-10 w-full pointer-events-none">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[12vw] md:text-[8vw] font-bold leading-[0.85] tracking-tighter uppercase">
              Architect
            </h1>
          </motion.div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 md:gap-8"
          >
            <h1 className="text-[12vw] md:text-[8vw] font-bold leading-[0.85] tracking-tighter uppercase text-zinc-500">
              Of
            </h1>
            <h1 className="text-[12vw] md:text-[8vw] font-bold leading-[0.85] tracking-tighter uppercase">
              Intelligence
            </h1>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 font-mono text-xs uppercase tracking-widest text-zinc-500 flex flex-col items-end">
          <span>Scroll</span>
          <span>To Explore</span>
        </div>
      </section>

      {/* --- PROJECTS --- */}
      {/* Full-viewport immersive cards with parallax and sticky background text */}
      <ProjectsSection onExplore={setSelectedProject} />

      {/* --- PHILOSOPHY --- */}
      {/* Text revealed on scroll — forces pacing, feels like a manifesto */}
      <section
        ref={containerRef}
        className="min-h-screen w-full flex items-center justify-center p-6 md:p-24 relative overflow-hidden bg-zinc-950"
      >
        <div className="max-w-5xl mx-auto">
          <motion.p
            style={{ opacity: opacityTransform, y: yTransform }}
            className="text-2xl md:text-5xl lg:text-7xl font-medium tracking-tight leading-[1.1] text-zinc-300"
          >
            I build software alongside Claude. <br className="hidden md:block" />
            Not as a replacement for craft, but as an <span className="text-zinc-50 italic">accelerant</span> for imagination. <br className="hidden md:block" />
            The code is co-authored; the vision is mine.
          </motion.p>
        </div>
      </section>

      {/* --- FOOTER / CONTACT --- */}
      {/* Massive interactive footer with hover inversion */}
      <footer className="h-screen w-full flex flex-col justify-between p-6 md:p-12 border-t border-zinc-900">
        <div className="w-full flex justify-between font-mono text-xs uppercase tracking-widest text-zinc-500">
          <span>Open for collaboration</span>
          <span>Based on Earth</span>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <a
            href="mailto:hello@example.com"
            className="group relative block"
          >
            <h2 className="text-[15vw] md:text-[12vw] font-bold leading-none tracking-tighter uppercase text-zinc-800 transition-colors duration-500 group-hover:text-zinc-50">
              Contact
            </h2>
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
            >
              <div className="bg-zinc-50 text-zinc-950 px-6 py-3 rounded-full font-mono text-sm font-bold uppercase tracking-widest whitespace-nowrap">
                Send Email ↗
              </div>
            </motion.div>
          </a>
        </div>

        <div className="w-full flex justify-between font-mono text-xs uppercase tracking-widest text-zinc-500">
          <span>&copy; {new Date().getFullYear()}</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-zinc-50 transition-colors">Github</a>
            <a href="#" className="hover:text-zinc-50 transition-colors">Twitter</a>
          </div>
        </div>
      </footer>

      {/* --- PROJECT DETAIL OVERLAY --- */}
      <AnimatePresence mode="wait">
        {selectedProject && (
          <ProjectDetail
            key={selectedProject.id}
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
