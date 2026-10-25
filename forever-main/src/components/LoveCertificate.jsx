import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { Download, Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import CinematicSceneAtmosphere from './CinematicSceneAtmosphere';

// Corner ornaments SVG
const CornerOrnament = ({ className }) => (
  <svg viewBox="0 0 120 120" className={`absolute w-16 h-16 sm:w-28 sm:h-28 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 110 10 L 10 10 L 10 110" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M 100 15 L 15 15 L 15 100" stroke="#d4af37" strokeWidth="0.75" opacity="0.8" />
    <path d="M 15 45 C 15 35, 35 15, 45 15 C 55 15, 55 25, 45 25 C 38 25, 35 20, 38 18 C 40 16, 45 18, 42 22" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M 15 70 C 15 50, 50 15, 70 15" stroke="#f43f5e" strokeWidth="1.2" opacity="0.75" strokeLinecap="round" />
    <path d="M 30 10 C 40 10, 50 15, 50 25 C 50 32, 42 35, 42 28 C 42 24, 48 24, 46 28" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M 10 30 C 10 40, 15 50, 25 50 C 32 50, 35 42, 28 42 C 24 42, 24 48, 28 46" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M 22 22 Q 35 25 40 35" stroke="#d4af37" strokeWidth="0.75" />
    <circle cx="40" cy="35" r="1.5" fill="#d4af37" />
    <path d="M 22 22 Q 25 35 35 40" stroke="#d4af37" strokeWidth="0.75" />
    <circle cx="35" cy="40" r="1.5" fill="#d4af37" />
  </svg>
);

// Center swirl flourish
const CenterOrnament = ({ className }) => (
  <svg viewBox="0 0 200 30" className={`w-36 sm:w-56 h-8 text-[#d4af37] fill-none ${className}`} xmlns="http://www.w3.org/2000/svg">
    <path d="M 100 15 C 90 7, 85 23, 75 15 C 65 7, 55 23, 45 15 C 35 7, 25 23, 5 15" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 100 15 C 110 7, 115 23, 125 15 C 135 7, 145 23, 155 15 C 165 7, 175 23, 195 15" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 92 15 C 92 8, 100 5, 100 12 C 100 5, 108 8, 108 15 C 108 22, 100 25, 100 28 C 100 25, 92 22, 92 15 Z" fill="#f43f5e" opacity="0.15" />
    <path d="M 92 15 C 92 8, 100 5, 100 12 C 100 5, 108 8, 108 15 C 108 22, 100 25, 100 28" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="100" cy="18" r="2.5" fill="#d4af37" />
    <circle cx="83" cy="15" r="1.5" fill="#d4af37" />
    <circle cx="117" cy="15" r="1.5" fill="#d4af37" />
  </svg>
);

// High-fidelity pleated Rosette Seal SVG
const RosetteSeal = () => (
  <div className="relative flex flex-col items-center justify-center w-20 h-20 sm:w-28 sm:h-28">
    <svg viewBox="0 0 100 100" className="absolute top-10 sm:top-14 w-16 h-16 sm:w-24 sm:h-24 z-0">
      <path d="M 40 10 L 22 80 L 34 74 L 46 80 Z" fill="#881337" stroke="#4c0519" strokeWidth="1" />
      <path d="M 60 10 L 78 80 L 66 74 L 54 80 Z" fill="#881337" stroke="#4c0519" strokeWidth="1" />
    </svg>
    <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-24 sm:h-24 z-10 drop-shadow-md">
      <polygon
        points="50,8 53,17 61,12 62,21 71,17 68,26 77,24 73,33 81,35 76,43 82,48 76,53 81,59 73,63 76,71 68,71 70,80 61,78 59,87 52,83 50,89 47,83 40,87 38,78 29,80 31,71 23,71 26,63 18,59 23,53 17,48 23,43 18,35 26,33 22,24 31,26 28,17 37,21 38,12 46,17"
        fill="#9f1239"
        stroke="#4c0519"
        strokeWidth="1"
      />
      <circle cx="50" cy="50" r="30" fill="none" stroke="#d4af37" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="26" fill="none" stroke="#d4af37" strokeWidth="0.75" />
      <circle cx="50" cy="50" r="25" fill="#4c0519" />
      <polygon points="50,36 60,42 60,54 50,60 40,54 40,42" fill="none" stroke="#d4af37" strokeWidth="1.5" />
      <path d="M 50 51 C 50 51 45 47 45 44.5 C 45 43 46.5 41.5 48 41.5 C 49 41.5 49.5 42 50 42.5 C 50.5 42 51 41.5 52 41.5 C 53.5 41.5 55 43 55 44.5 C 55 47 50 51 50 51 Z" fill="#d4af37" />
    </svg>
  </div>
);

// ============================================================================
// CINEMATIC FLOWER BURST CANVAS (60 FPS, 3D PETALS, BLOSSOMS & GOLDEN DUST)
// ============================================================================
function drawRosePetal(ctx, w, h, color1, color2) {
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.5);
  ctx.bezierCurveTo(w * 0.6, -h * 0.45, w * 0.7, h * 0.3, 0, h * 0.5);
  ctx.bezierCurveTo(-w * 0.7, h * 0.3, -w * 0.6, -h * 0.45, 0, -h * 0.5);
  const grad = ctx.createLinearGradient(-w * 0.4, -h * 0.5, w * 0.4, h * 0.5);
  grad.addColorStop(0, color1);
  grad.addColorStop(0.7, color2);
  grad.addColorStop(1, '#be123c');
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 0.75;
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.38);
  ctx.quadraticCurveTo(w * 0.08, 0, 0, h * 0.35);
  ctx.stroke();
}

function drawHeartPetal(ctx, size, color1, color2) {
  ctx.beginPath();
  const topH = size * 0.3;
  ctx.moveTo(0, topH);
  ctx.bezierCurveTo(0, 0, -size * 0.5, 0, -size * 0.5, topH);
  ctx.bezierCurveTo(-size * 0.5, (size + topH) * 0.5, 0, (size + topH) * 0.7, 0, size);
  ctx.bezierCurveTo(0, (size + topH) * 0.7, size * 0.5, (size + topH) * 0.5, size * 0.5, topH);
  ctx.bezierCurveTo(size * 0.5, 0, 0, 0, 0, topH);

  const grad = ctx.createRadialGradient(0, topH, size * 0.1, 0, size * 0.5, size * 0.6);
  grad.addColorStop(0, color1);
  grad.addColorStop(1, color2);
  ctx.fillStyle = grad;
  ctx.fill();
}

function drawBlossom(ctx, radius, color1, color2) {
  const petals = 5;
  for (let i = 0; i < petals; i++) {
    const angle = (i * 2 * Math.PI) / petals;
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(radius * 0.4, -radius * 0.6, radius * 0.8, -radius * 0.3, 0, -radius);
    ctx.bezierCurveTo(-radius * 0.8, -radius * 0.3, -radius * 0.4, -radius * 0.6, 0, 0);
    const grad = ctx.createLinearGradient(0, 0, 0, -radius);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = '#fbbf24';
  ctx.fill();
}

function drawSparkle(ctx, x, y, size, alpha) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  const grad = ctx.createRadialGradient(x, y, 0, x, y, size);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.35, 'rgba(253, 224, 71, 0.85)');
  grad.addColorStop(0.75, 'rgba(251, 191, 36, 0.35)');
  grad.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(x - size * 0.75, y);
  ctx.quadraticCurveTo(x, y, x, y - size * 0.75);
  ctx.quadraticCurveTo(x, y, x + size * 0.75, y);
  ctx.quadraticCurveTo(x, y, x, y + size * 0.75);
  ctx.quadraticCurveTo(x, y, x - size * 0.75, y);
  ctx.fill();
  ctx.restore();
}

function playSoftFireworkPop() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!window._fireworkAudioCtx) {
      window._fireworkAudioCtx = new AudioCtx();
    }
    const ctx = window._fireworkAudioCtx;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.35);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.36);
  } catch (e) {}
}

function CinematicCelebrationClimaxCanvas({ active, onCelebrationComplete }) {
  const canvasRef = useRef(null);
  const completedRef = useRef(false);
  // Prevent StrictMode double-mount from launching a second loop
  const mountedRef = useRef(false);
  // Hold callback in a ref so the animation loop never restarts due to
  // inline arrow function identity changes from the parent (root cause #2)
  const onCompleteRef = useRef(onCelebrationComplete);
  useEffect(() => { onCompleteRef.current = onCelebrationComplete; });

  useEffect(() => {
    // Do NOT start until the certificate card is actually visible (root cause #1)
    if (!active) return;
    // StrictMode guard: only one loop per mount
    if (mountedRef.current) return;
    mountedRef.current = true;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let animId = null;
    let startTime = null;
    let flowerBurstTriggered = false;
    // For canvas fade-out after celebration
    let canvasOpacity = 1;
    let isFadingOut = false;

    const PALETTES = [
      { c1: '#f43f5e', c2: '#fda4af', type: 'rose' },
      { c1: '#ec4899', c2: '#fbcfe8', type: 'rose' },
      { c1: '#e11d48', c2: '#fb7185', type: 'rose' },
      { c1: '#d946ef', c2: '#f5d0fe', type: 'rose' },
      { c1: '#a855f7', c2: '#e9d5ff', type: 'blossom' },
      { c1: '#fb7185', c2: '#ffe4e6', type: 'heart' },
      { c1: '#f43f5e', c2: '#ffffff', type: 'heart' },
      { c1: '#fbbf24', c2: '#fef08a', type: 'blossom' },
      { c1: '#ffffff', c2: '#fbcfe8', type: 'blossom' },
      { c1: '#f472b6', c2: '#fed7aa', type: 'rose' },
    ];

    const petals = [];
    const sparkles = [];
    const butterflies = [];
    const rockets = [];
    const fireworkSparks = [];
    const skyFlashes = [];
    // Extra glitter that rains down after each firework
    const glitter = [];

    let bloomRadius = 0;
    let bloomOpacity = 0;
    let budGlow = 0;
    // Screen-wide glow during grand fireworks
    let screenGlowAlpha = 0;
    let screenGlowColor = '#ffffff';

    const PRE_BURST_TIME = 5600;
    const FLOWER_BURST_TIME = 6600;
    // All fireworks + fade complete — show Continue button
    const CELEBRATION_END_TIME = 17500;
    // Hard stop for the animation loop after fade-out
    const ANIMATION_STOP_TIME = 20500;

    // If reduced motion: skip to completion immediately
    if (prefersReduced) {
      const rId = setTimeout(() => {
        completedRef.current = true;
        if (typeof onCompleteRef.current === 'function') onCompleteRef.current();
      }, 800);
      return () => {
        clearTimeout(rId);
        window.removeEventListener('resize', handleResize);
        mountedRef.current = false;
      };
    }

    const FIREWORK_SCHEDULE = [
      // Large left firework
      { launchTime: 9600,  sx: 0.12, tx: 0.22, ty: 0.20, color: '#f43f5e', type: 'grand',  launched: false },
      // Large right firework
      { launchTime: 10400, sx: 0.88, tx: 0.78, ty: 0.18, color: '#d946ef', type: 'grand',  launched: false },
      // Medium center willow
      { launchTime: 11200, sx: 0.50, tx: 0.50, ty: 0.12, color: '#fbbf24', type: 'willow', launched: false },
      // Medium left-center peony
      { launchTime: 12000, sx: 0.20, tx: 0.35, ty: 0.22, color: '#ec4899', type: 'peony',  launched: false },
      // Medium right-center peony
      { launchTime: 12600, sx: 0.80, tx: 0.65, ty: 0.20, color: '#a855f7', type: 'peony',  launched: false },
      // Massive grand center-left climax
      { launchTime: 13400, sx: 0.30, tx: 0.38, ty: 0.10, color: '#f43f5e', type: 'mega',   launched: false },
      // Massive grand center-right climax
      { launchTime: 13550, sx: 0.70, tx: 0.62, ty: 0.11, color: '#fb7185', type: 'mega',   launched: false },
      // Background small left
      { launchTime: 14200, sx: 0.05, tx: 0.15, ty: 0.30, color: '#fbbf24', type: 'peony',  launched: false },
      // Background small right
      { launchTime: 14500, sx: 0.95, tx: 0.85, ty: 0.28, color: '#e11d48', type: 'peony',  launched: false },
      // Final grand center white
      { launchTime: 15200, sx: 0.45, tx: 0.50, ty: 0.08, color: '#ffffff', type: 'mega',   launched: false },
    ];

    function createFlowerExplosion(cx, cy) {
      flowerBurstTriggered = true;
      bloomRadius = 10;
      bloomOpacity = 0.95;

      const isMobile = width < 768;
      const petalCount = isMobile ? 220 : 340;
      const sparkleCount = isMobile ? 120 : 190;

      for (let i = 0; i < petalCount; i++) {
        const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
        const angle = Math.random() * Math.PI * 2;
        const speedMultiplier = Math.random() < 0.18 ? Math.random() * 8 + 18 : Math.random() * 12 + 5;
        const vx = Math.cos(angle) * speedMultiplier * (Math.random() * 0.4 + 0.8);
        const vy = Math.sin(angle) * speedMultiplier * (Math.random() * 0.4 + 0.8) - Math.random() * 4.5;

        const depth = Math.random() < 0.15 ? 2 : Math.random() < 0.45 ? 0 : 1;
        const baseSize = depth === 2 ? Math.random() * 14 + 24 : depth === 0 ? Math.random() * 6 + 10 : Math.random() * 10 + 15;

        petals.push({
          x: cx + (Math.random() - 0.5) * 20,
          y: cy + (Math.random() - 0.5) * 20,
          vx,
          vy,
          drag: depth === 2 ? 0.935 : depth === 0 ? 0.965 : 0.95,
          gravity: depth === 2 ? 0.14 : depth === 0 ? 0.08 : 0.11,
          size: baseSize,
          aspectRatio: Math.random() * 0.5 + 0.9,
          color: palette,
          shape: palette.type,
          depth,
          roll: Math.random() * Math.PI * 2,
          rollSpeed: (Math.random() - 0.5) * 0.14,
          pitch: Math.random() * Math.PI * 2,
          pitchSpeed: (Math.random() - 0.5) * 0.12,
          yaw: Math.random() * Math.PI * 2,
          yawSpeed: (Math.random() - 0.5) * 0.06,
          swayPhase: Math.random() * Math.PI * 2,
          swaySpeed: Math.random() * 0.03 + 0.02,
          swayAmount: Math.random() * 1.8 + 0.6,
          opacity: 1.0,
          fadeSpeed: Math.random() * 0.0006 + 0.0003,
        });
      }

      for (let i = 0; i < sparkleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 16 + 4;
        sparkles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 3,
          drag: 0.92,
          gravity: 0.04,
          size: Math.random() * 3.5 + 1.5,
          alpha: 1.0,
          fadeSpeed: Math.random() * 0.015 + 0.008,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }

      for (let i = 0; i < 7; i++) {
        const bAngle = (i / 7) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const bSpeed = Math.random() * 6 + 4;
        butterflies.push({
          x: cx,
          y: cy,
          vx: Math.cos(bAngle) * bSpeed,
          vy: Math.sin(bAngle) * bSpeed - 3,
          targetSpeedX: (Math.random() - 0.5) * 3,
          targetSpeedY: -Math.random() * 2 - 1.2,
          size: Math.random() * 6 + 14,
          color: PALETTES[i % PALETTES.length].c1,
          flapPhase: Math.random() * Math.PI * 2,
        });
      }
    }

    function launchRocket(conf) {
      const startX = conf.sx * width;
      const targetX = conf.tx * width;
      const targetY = conf.ty * height;
      // flight frames: mega=38, others=42
      const duration = conf.type === 'mega' ? 38 : 42;

      rockets.push({
        x: startX,
        y: height + 10,
        targetX,
        targetY,
        vx: (targetX - startX) / duration,
        vy: (targetY - (height + 10)) / duration,
        color: conf.color,
        type: conf.type,
        trail: [],
        framesRemaining: duration,
      });
    }

    function spawnGlitter(x, y, count, color) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 0.5;
        glitter.push({
          x: x + (Math.random() - 0.5) * 80,
          y: y + (Math.random() - 0.5) * 40,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 1.5,
          gravity: 0.06,
          drag: 0.985,
          size: Math.random() * 2.5 + 1,
          color,
          alpha: Math.random() * 0.6 + 0.4,
          fadeSpeed: Math.random() * 0.008 + 0.004,
          twinkle: Math.random() * Math.PI * 2,
        });
      }
    }

    function explodeRocket(r) {
      playSoftFireworkPop();

      // Screen glow pulse on major fireworks
      screenGlowColor = r.color;
      screenGlowAlpha = r.type === 'mega' ? 0.22 : r.type === 'grand' ? 0.14 : 0.09;

      // Flash radius: mega=420, grand=320, willow=260, peony=240
      const maxRadius = r.type === 'mega' ? 420 : r.type === 'grand' ? 320 : r.type === 'willow' ? 260 : 240;

      skyFlashes.push({
        x: r.targetX,
        y: r.targetY,
        radius: 12,
        maxRadius,
        alpha: r.type === 'mega' ? 0.7 : r.type === 'grand' ? 0.55 : 0.45,
        color: r.color,
      });

      // Particle count: mega=90, grand=72, willow=60, peony=54
      const count = r.type === 'mega' ? 90 : r.type === 'grand' ? 72 : r.type === 'willow' ? 60 : 54;
      const baseSpeed = r.type === 'mega' ? 7.5 : r.type === 'grand' ? 6.0 : r.type === 'willow' ? 4.8 : 4.2;

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.25;
        const speed = baseSpeed * (Math.random() * 0.4 + 0.8);
        const sparkSize = r.type === 'mega' ? Math.random() * 2.5 + 5.5
          : r.type === 'grand' ? Math.random() * 2 + 4.5
          : r.type === 'willow' ? Math.random() * 1.5 + 3.5
          : Math.random() * 1.5 + 3.0;

        fireworkSparks.push({
          x: r.targetX,
          y: r.targetY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: r.color,
          alpha: 1.0,
          decay: r.type === 'mega' ? 0.007 + Math.random() * 0.004
            : r.type === 'willow' ? 0.007 + Math.random() * 0.003
            : 0.011 + Math.random() * 0.006,
          gravity: r.type === 'willow' ? 0.065 : r.type === 'mega' ? 0.048 : 0.055,
          drag: r.type === 'willow' ? 0.962 : r.type === 'mega' ? 0.968 : 0.952,
          size: sparkSize,
          isWillow: r.type === 'willow',
          trail: [],
        });
      }

      // Spawn falling glitter/sparks after explosion
      const glitterCount = r.type === 'mega' ? 60 : r.type === 'grand' ? 40 : 25;
      spawnGlitter(r.targetX, r.targetY, glitterCount, r.color);
    }

    function render(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Hard stop after full fade — return without scheduling another frame
      if (elapsed > ANIMATION_STOP_TIME || (isFadingOut && canvasOpacity <= 0)) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Apply canvas-wide fade after celebration ends
      if (isFadingOut) {
        canvasOpacity = Math.max(0, canvasOpacity - 0.010);
        canvas.style.opacity = String(canvasOpacity);
      }

      const cx = width / 2;
      const cy = height * 0.48;

      // ── SCREEN GLOW (during major firework explosions) ──────────────────────
      if (screenGlowAlpha > 0.005) {
        ctx.save();
        const glowR = Math.max(width, height) * 0.75;
        const glowGrad = ctx.createRadialGradient(cx, height * 0.25, 0, cx, height * 0.25, glowR);
        glowGrad.addColorStop(0, 'rgba(255,255,255,' + (screenGlowAlpha * 0.35) + ')');
        glowGrad.addColorStop(0.4, 'rgba(255,220,100,' + (screenGlowAlpha * 0.18) + ')');
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
        screenGlowAlpha *= 0.91;
      }

      // 1. FLOWER BURST PRE-GLOW (5600ms -> 6600ms)
      if (elapsed >= PRE_BURST_TIME && elapsed < FLOWER_BURST_TIME) {
        const progress = (elapsed - PRE_BURST_TIME) / (FLOWER_BURST_TIME - PRE_BURST_TIME);
        budGlow = Math.sin(progress * Math.PI * 4) * 0.3 + progress * 0.7;
        const budRadius = 15 + progress * 35;

        ctx.save();
        const budGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, budRadius);
        budGrad.addColorStop(0, 'rgba(255, 255, 255, ' + (budGlow * 0.95) + ')');
        budGrad.addColorStop(0.35, 'rgba(251, 191, 36, ' + (budGlow * 0.8) + ')');
        budGrad.addColorStop(0.7, 'rgba(244, 63, 94, ' + (budGlow * 0.5) + ')');
        budGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
        ctx.fillStyle = budGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, budRadius, 0, Math.PI * 2);
        ctx.fill();
        drawSparkle(ctx, cx, cy, budRadius * 0.45, budGlow);
        ctx.restore();
      }

      // 2. TRIGGER FLOWER EXPLOSION AT 6600ms
      if (elapsed >= FLOWER_BURST_TIME && !flowerBurstTriggered) {
        createFlowerExplosion(cx, cy);
      }

      // 3. FLOWER BURST BLOOM & PETALS
      if (flowerBurstTriggered) {
        if (bloomOpacity > 0.01) {
          bloomRadius += (340 - bloomRadius) * 0.08;
          bloomOpacity *= 0.94;
          ctx.save();
          const bloomGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, bloomRadius);
          bloomGrad.addColorStop(0, 'rgba(255, 255, 255, ' + (bloomOpacity * 0.9) + ')');
          bloomGrad.addColorStop(0.3, 'rgba(254, 240, 138, ' + (bloomOpacity * 0.75) + ')');
          bloomGrad.addColorStop(0.65, 'rgba(251, 191, 36, ' + (bloomOpacity * 0.4) + ')');
          bloomGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
          ctx.fillStyle = bloomGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, bloomRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Golden Sparkles
        for (let i = sparkles.length - 1; i >= 0; i--) {
          const s = sparkles[i];
          s.x += s.vx; s.y += s.vy;
          s.vx *= s.drag; s.vy *= s.drag;
          s.vy += s.gravity;
          s.alpha -= s.fadeSpeed;
          s.twinklePhase += 0.15;
          if (s.alpha <= 0.01) { sparkles.splice(i, 1); continue; }
          const currentAlpha = Math.max(0, s.alpha * (Math.sin(s.twinklePhase) * 0.3 + 0.7));
          drawSparkle(ctx, s.x, s.y, s.size, currentAlpha);
        }

        // 3D Flower Petals
        for (let i = petals.length - 1; i >= 0; i--) {
          const p = petals[i];
          p.x += p.vx; p.y += p.vy;
          p.vx *= p.drag; p.vy *= p.drag;
          p.vy += p.gravity;
          p.swayPhase += p.swaySpeed;
          p.x += Math.sin(p.swayPhase) * p.swayAmount;
          p.roll += p.rollSpeed; p.pitch += p.pitchSpeed; p.yaw += p.yawSpeed;
          p.opacity -= p.fadeSpeed;
          if (p.y > height + 80 || p.opacity <= 0.01) { petals.splice(i, 1); continue; }
          const scaleX = Math.cos(p.roll) * (p.depth === 2 ? 1.3 : p.depth === 0 ? 0.75 : 1.0);
          const scaleY = Math.cos(p.pitch) * p.aspectRatio * (p.depth === 2 ? 1.3 : p.depth === 0 ? 0.75 : 1.0);
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.yaw);
          ctx.scale(scaleX, scaleY);
          ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
          if (p.shape === 'rose') drawRosePetal(ctx, p.size, p.size * 1.3, p.color.c1, p.color.c2);
          else if (p.shape === 'heart') drawHeartPetal(ctx, p.size * 1.1, p.color.c1, p.color.c2);
          else if (p.shape === 'blossom') drawBlossom(ctx, p.size * 0.7, p.color.c1, p.color.c2);
          else drawRosePetal(ctx, p.size * 0.85, p.size * 1.1, p.color.c1, p.color.c2);
          ctx.restore();
        }

        // Floating Butterflies
        for (let i = butterflies.length - 1; i >= 0; i--) {
          const b = butterflies[i];
          b.vx += (b.targetSpeedX - b.vx) * 0.04;
          b.vy += (b.targetSpeedY - b.vy) * 0.04;
          b.x += b.vx; b.y += b.vy;
          b.flapPhase += 0.28;
          if (b.x < -60 || b.x > width + 60 || b.y < -60) { butterflies.splice(i, 1); continue; }
          ctx.save();
          ctx.translate(b.x, b.y);
          ctx.rotate(Math.atan2(b.vy, b.vx) + Math.PI / 2);
          const wingSpan = Math.sin(b.flapPhase) * 0.85 + 0.15;
          ctx.save(); ctx.scale(wingSpan, 1);
          ctx.beginPath(); ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-b.size*0.9,-b.size*0.8,-b.size*1.2,b.size*0.4,0,b.size*0.6);
          ctx.fillStyle = b.color; ctx.fill(); ctx.restore();
          ctx.save(); ctx.scale(-wingSpan, 1);
          ctx.beginPath(); ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-b.size*0.9,-b.size*0.8,-b.size*1.2,b.size*0.4,0,b.size*0.6);
          ctx.fillStyle = b.color; ctx.fill(); ctx.restore();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(0, b.size * 0.2, 1.8, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
      }

      // 4. FIREWORKS LAUNCHES & FLIGHT
      FIREWORK_SCHEDULE.forEach((item) => {
        if (elapsed >= item.launchTime && !item.launched) {
          item.launched = true;
          launchRocket(item);
        }
      });

      // Render Rockets (bright, thick, glowing)
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 12) r.trail.shift();
        r.x += r.vx; r.y += r.vy;
        r.framesRemaining--;

        if (r.trail.length > 1) {
          ctx.save();
          // Outer glow trail
          ctx.strokeStyle = r.color;
          ctx.lineWidth = r.type === 'mega' ? 5 : r.type === 'grand' ? 4 : 3;
          ctx.shadowColor = r.color;
          ctx.shadowBlur = r.type === 'mega' ? 20 : 14;
          ctx.globalAlpha = 0.7;
          ctx.beginPath();
          ctx.moveTo(r.trail[0].x, r.trail[0].y);
          r.trail.forEach((pt) => ctx.lineTo(pt.x, pt.y));
          ctx.stroke();
          // White core trail
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = r.type === 'mega' ? 2.5 : 1.8;
          ctx.shadowBlur = 6;
          ctx.globalAlpha = 0.9;
          const mid = Math.floor(r.trail.length / 2);
          ctx.beginPath();
          ctx.moveTo(r.trail[mid].x, r.trail[mid].y);
          r.trail.forEach((pt) => ctx.lineTo(pt.x, pt.y));
          ctx.stroke();
          // Rocket head
          ctx.shadowBlur = 0; ctx.globalAlpha = 1;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.type === 'mega' ? 4.5 : 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 0.6;
          ctx.fillStyle = r.color;
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.type === 'mega' ? 8 : 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        if (r.framesRemaining <= 0) {
          explodeRocket(r);
          rockets.splice(i, 1);
        }
      }

      // 5. RENDER FIREWORK SKY FLASHES
      for (let i = skyFlashes.length - 1; i >= 0; i--) {
        const f = skyFlashes[i];
        f.radius += (f.maxRadius - f.radius) * 0.15;
        f.alpha *= 0.88;
        if (f.alpha <= 0.02) { skyFlashes.splice(i, 1); continue; }
        ctx.save();
        const flashGrad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius);
        flashGrad.addColorStop(0, 'rgba(255,255,255,' + f.alpha + ')');
        flashGrad.addColorStop(0.25, 'rgba(255,255,255,' + (f.alpha * 0.8) + ')');
        flashGrad.addColorStop(0.6, 'rgba(255,220,100,' + (f.alpha * 0.5) + ')');
        flashGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = Math.min(1, f.alpha);
        ctx.fillStyle = flashGrad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 6. RENDER FIREWORK SPARKS & WILLOW TRAILS
      for (let i = fireworkSparks.length - 1; i >= 0; i--) {
        const s = fireworkSparks[i];
        if (s.isWillow) {
          s.trail.push({ x: s.x, y: s.y, a: s.alpha });
          if (s.trail.length > 10) s.trail.shift();
        }
        s.x += s.vx; s.y += s.vy;
        s.vx *= s.drag; s.vy *= s.drag;
        s.vy += s.gravity;
        s.alpha -= s.decay;
        if (s.alpha <= 0.01) { fireworkSparks.splice(i, 1); continue; }

        ctx.save();
        ctx.globalAlpha = Math.max(0, s.alpha);
        if (s.isWillow && s.trail.length > 1) {
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 1.8;
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.moveTo(s.trail[0].x, s.trail[0].y);
          s.trail.forEach((pt) => ctx.lineTo(pt.x, pt.y));
          ctx.stroke();
        }
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 12;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 7. RENDER FALLING GLITTER / SPARKS
      for (let i = glitter.length - 1; i >= 0; i--) {
        const g = glitter[i];
        g.x += g.vx; g.y += g.vy;
        g.vx *= g.drag; g.vy *= g.drag;
        g.vy += g.gravity;
        g.alpha -= g.fadeSpeed;
        g.twinkle += 0.12;
        if (g.alpha <= 0.01) { glitter.splice(i, 1); continue; }
        const tAlpha = Math.max(0, g.alpha * (Math.sin(g.twinkle) * 0.4 + 0.6));
        ctx.save();
        ctx.globalAlpha = tAlpha;
        ctx.fillStyle = g.color;
        ctx.shadowColor = g.color;
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 8. FINISH CELEBRATION & SHOW CONTINUE BUTTON (at 17500ms)
      if (elapsed >= CELEBRATION_END_TIME && !completedRef.current) {
        completedRef.current = true;
        isFadingOut = true;
        if (typeof onCompleteRef.current === 'function') {
          onCompleteRef.current();
        }
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      mountedRef.current = false;
    };
  // Only restart if `active` changes — never restart due to callback identity
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[200] select-none"
      style={{ willChange: 'transform', transition: 'opacity 0.8s ease-out' }}
    />
  );
}


export default function LoveCertificate({ onVisible }) {
  const certificateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // T = 0 sec: Start /oo.mp3 immediately with volume 0.85
    try {
      const audio = new Audio('/oo.mp3');
      audio.volume = 0.85;
      audio.loop = false;
      audioRef.current = audio;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Certificate audio pending interaction/ready:', err);
        });
      }
    } catch (e) {
      console.warn('Certificate audio initialization error:', e);
    }

    // T = 0–3 sec: keep certificate hidden
    // T = EXACTLY 3.0 sec: Certificate card unfolds smoothly
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);

  const handleDownload = async () => {
    if (!certificateRef.current || isDownloading) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(certificateRef.current, {
        backgroundColor: '#fffefb',
        scale: 3,
        useCORS: true,
        logging: false,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'My-Forever-And-Always-Award-Abishek-Saranya.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      confetti({
        particleCount: 140,
        spread: 95,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#f43f5e', '#ffffff']
      });
    } catch (error) {
      console.error('Certificate download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4 text-center z-30 select-none relative animate-fade-in">
      {/* Cinematic Shared Atmosphere */}
      <CinematicSceneAtmosphere accentGlow="amber" />

      {/* Cinematic Final Celebration Climax: Flower Burst + Final Fireworks Canvas */}
      {/* active=isVisible ensures celebration only starts after certificate card reveals */}
      <CinematicCelebrationClimaxCanvas active={isVisible} onCelebrationComplete={onVisible} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Great+Vibes&family=Montserrat:wght@400;500;600&display=swap');
        
        .font-vintage-title { font-family: 'Cinzel', serif; }
        .font-vintage-script { font-family: 'Great Vibes', cursive; }
        .font-vintage-sans { font-family: 'Montserrat', sans-serif; }

        @keyframes certificateSweep {
          0% { transform: translateX(-150%) skewX(-20deg); }
          50% { transform: translateX(200%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
      `}</style>

      {/* VINTAGE CERTIFICATE CANVAS WITH CINEMATIC LIGHT SWEEP (REVEALS AT T = 3.0s) */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="certificate-card"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="w-full flex flex-col items-center"
          >
            <div
              ref={certificateRef}
              className="w-full max-w-2xl p-6 sm:p-12 rounded-sm bg-[#fffefb] border-[14px] border-double border-[#d4af37] text-zinc-900 shadow-[0_0_70px_rgba(212,175,55,0.45)] text-center relative overflow-hidden my-4 sm:my-6"
            >
              {/* Subtle Archival Paper Texture Overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-25 z-0"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.1) 0%, transparent 80%)',
                }}
              />

              {/* Cinematic Light Sweep Across the Certificate */}
              <div
                className="absolute inset-y-0 w-32 pointer-events-none z-[12] opacity-40"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                  animation: 'certificateSweep 7s ease-in-out infinite',
                }}
              />

              {/* NESTED INNER GOLD LINE */}
              <div className="absolute inset-2 border border-[#d4af37]/70 pointer-events-none z-[5]" />

              {/* CORNER ORNAMENTS */}
              <CornerOrnament className="top-3 left-3 z-[6]" />
              <CornerOrnament className="top-3 right-3 scale-x-[-1] z-[6]" />
              <CornerOrnament className="bottom-3 left-3 scale-y-[-1] z-[6]" />
              <CornerOrnament className="bottom-3 right-3 scale-x-[-1] scale-y-[-1] z-[6]" />

              {/* TOP ORNAMENT */}
              <div className="flex justify-center mt-2 mb-4 relative z-10">
                <CenterOrnament />
              </div>

              {/* AWARD TITLE */}
              <div className="my-2 sm:my-4 flex flex-col items-center relative z-10">
                <span className="font-vintage-title text-base sm:text-2xl font-bold tracking-[0.25em] text-amber-900 uppercase">
                  MY FOREVER &
                </span>
                <h1 className="font-vintage-title text-3xl sm:text-5xl font-black tracking-[0.05em] text-amber-950 uppercase mt-1">
                  ALWAYS AWARD
                </h1>
              </div>

              <p className="font-vintage-sans text-xs sm:text-sm font-medium text-zinc-500 tracking-widest uppercase mt-5 relative z-10">
                Presented to :
              </p>

              {/* RECIPIENT NAMES WITH PULSING HEART */}
              <div className="my-3 py-2 border-b border-zinc-300 max-w-md mx-auto relative z-10">
                <span className="font-vintage-script text-3xl sm:text-6xl text-rose-600 tracking-wide font-medium flex items-center justify-center gap-2">
                  Abishek <Heart className="w-6 h-6 sm:w-10 sm:h-10 fill-rose-500 text-rose-500 inline-block animate-pulse mx-1" /> Saranya
                </span>
              </div>

              <p className="font-vintage-sans text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-lg mx-auto px-4 my-5 relative z-10">
                For being my peace, my happiness, and the most precious part of my life.
                Thank you for always being there for me and for turning ordinary moments into extraordinary memories.
              </p>

              {/* SEAL & ROMANTIC SIGNATURE FOOTER */}
              <div className="grid grid-cols-3 items-end mt-6 sm:mt-10 px-2 sm:px-6 relative z-10">
                {/* Left: Signature */}
                <div className="flex flex-col items-center">
                  <span className="font-vintage-script text-base sm:text-2xl text-rose-600 mb-1 select-none">
                    With All My Love ❤️
                  </span>
                  <div className="w-24 sm:w-36 border-b border-zinc-400" />
                  <span className="font-vintage-sans text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest mt-1">
                    Signature
                  </span>
                </div>

                {/* Center: Rosette Seal */}
                <div className="flex justify-center -mb-2">
                  <RosetteSeal />
                </div>

                {/* Right: Date */}
                <div className="flex flex-col items-center">
                  <span className="font-vintage-sans text-xs sm:text-base font-semibold text-zinc-800 mb-2">
                    23/08/2026
                  </span>
                  <div className="w-24 sm:w-36 border-b border-zinc-400" />
                  <span className="font-vintage-sans text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest mt-1">
                    Date
                  </span>
                </div>
              </div>

              {/* BOTTOM ORNAMENT */}
              <div className="flex justify-center mt-5 relative z-10">
                <CenterOrnament className="rotate-180" />
              </div>
            </div>

            {/* DOWNLOAD BUTTON */}
            <div className="flex items-center justify-center mt-2 relative z-20">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-rose-500 text-zinc-950 font-bold text-sm sm:text-base shadow-[0_0_35px_rgba(251,191,36,0.5)] flex items-center gap-3 cursor-pointer transition"
              >
                <Download className="w-5 h-5"/>
                <span>{isDownloading ? 'Saving Your Certificate...' : 'Download Forever Award Certificate'}</span>
                <Sparkles className="w-4 h-4 text-amber-950" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
