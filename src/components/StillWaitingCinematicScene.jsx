import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import { sendEmail } from '../utils/emailService';
import CinematicRainbowBorder from './CinematicRainbowBorder';

// ============================================================================
// 1. HIGHLY REALISTIC MULTI-DEPTH CINEMATIC RAIN & LENS MOISTURE CANVAS (60 FPS)
// ============================================================================
function MasterRainCanvas({ lightningFlash = 0, warmHopeLevel = 0, rainSurge = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const isMobile = width < 768;

    // Depth Layer 1: Distant Fine Rain (Dense, thin, high speed, faint cyan-blue)
    const bgCount = isMobile ? 70 : 140;
    const bgRain = Array.from({ length: bgCount }).map(() => ({
      x: Math.random() * (width + 200) - 100,
      y: Math.random() * height,
      len: Math.random() * 16 + 12,
      speed: Math.random() * 9 + 12,
      slant: -1.6,
      opacity: Math.random() * 0.2 + 0.1,
      width: 0.85,
    }));

    // Depth Layer 2: Medium Rain Streaks (Natural angle, specular highlight)
    const mgCount = isMobile ? 45 : 90;
    const mgRain = Array.from({ length: mgCount }).map(() => ({
      x: Math.random() * (width + 200) - 100,
      y: Math.random() * height,
      len: Math.random() * 26 + 18,
      speed: Math.random() * 14 + 16,
      slant: -2.2,
      opacity: Math.random() * 0.32 + 0.18,
      width: 1.3,
    }));

    // Depth Layer 3: Foreground Large Droplets (Motion blurred, close to camera)
    const fgCount = isMobile ? 22 : 45;
    const fgRain = Array.from({ length: fgCount }).map(() => ({
      x: Math.random() * (width + 200) - 100,
      y: Math.random() * height,
      len: Math.random() * 40 + 30,
      speed: Math.random() * 20 + 22,
      slant: -2.8,
      opacity: Math.random() * 0.45 + 0.25,
      width: 2.0,
    }));

    // Depth Layer 4: Static Condensation & Lens Droplets (Realistic specular refraction)
    const staticCount = isMobile ? 50 : 95;
    const staticDrops = Array.from({ length: staticCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 3.2 + 1.2,
      opacity: Math.random() * 0.38 + 0.3,
      aspect: Math.random() * 0.25 + 0.85,
    }));

    // Depth Layer 5: Wet Sliding Water Droplets (Trickling down camera lens)
    const trickleCount = isMobile ? 10 : 20;
    const trickles = Array.from({ length: trickleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: Math.random() * 1.8 + 0.7,
      r: Math.random() * 2.6 + 1.5,
      trail: [],
    }));

    // Depth Layer 6: Atmospheric Moisture & Fine Rain Mist Particles
    const mistCount = isMobile ? 25 : 45;
    const mistParticles = Array.from({ length: mistCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 3.0 + 1.0,
      vx: (Math.random() - 0.5) * 0.4 - 0.3,
      vy: -Math.random() * 0.5 - 0.2,
      opacity: Math.random() * 0.35 + 0.15,
      pulse: Math.random() * Math.PI * 2,
    }));

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const flash = lightningFlash; // 0.0 to 1.0
      const surgeMultiplier = rainSurge ? 1.3 : 1.0;

      // 1. Draw Distant Fine Rain
      ctx.lineCap = 'round';
      bgRain.forEach((d) => {
        const dropOpacity = Math.min(1.0, (d.opacity + flash * 0.4) * (rainSurge ? 1.25 : 1.0));
        ctx.lineWidth = d.width;
        ctx.strokeStyle = `rgba(191, 219, 254, ${dropOpacity})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.slant, d.y + d.len * surgeMultiplier);
        ctx.stroke();

        d.y += d.speed * surgeMultiplier;
        d.x += d.slant * 0.4;
        if (d.y > height + 20) {
          d.y = -20;
          d.x = Math.random() * (width + 120);
        }
      });

      // 2. Draw Midground Rain Streaks
      mgRain.forEach((d) => {
        const dropOpacity = Math.min(1.0, (d.opacity + flash * 0.5) * (rainSurge ? 1.25 : 1.0));
        ctx.lineWidth = d.width * (rainSurge ? 1.15 : 1.0);
        ctx.strokeStyle = `rgba(224, 242, 254, ${dropOpacity})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.slant, d.y + d.len * surgeMultiplier);
        ctx.stroke();

        d.y += d.speed * surgeMultiplier;
        d.x += d.slant * 0.5;
        if (d.y > height + 30) {
          d.y = -30;
          d.x = Math.random() * (width + 120);
        }
      });

      // 3. Draw Foreground Large Rain Droplets
      fgRain.forEach((d) => {
        const dropOpacity = Math.min(1.0, (d.opacity + flash * 0.6) * (rainSurge ? 1.3 : 1.0));
        ctx.lineWidth = d.width * (rainSurge ? 1.25 : 1.0);
        ctx.strokeStyle = `rgba(240, 249, 255, ${dropOpacity})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.slant, d.y + d.len * surgeMultiplier);
        ctx.stroke();

        d.y += d.speed * surgeMultiplier;
        d.x += d.slant * 0.6;
        if (d.y > height + 40) {
          d.y = -40;
          d.x = Math.random() * (width + 120);
        }
      });

      // 4. Draw Static Camera Lens Moisture & Droplets
      staticDrops.forEach((d) => {
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.scale(1, d.aspect);

        const effOpacity = Math.min(1.0, d.opacity + flash * 0.5);
        const radGrad = ctx.createRadialGradient(-0.4, -0.4, 0.1, 0, 0, d.r);
        radGrad.addColorStop(0, `rgba(255, 255, 255, ${effOpacity * 0.95})`);
        radGrad.addColorStop(
          0.5,
          warmHopeLevel > 0.4
            ? `rgba(251, 191, 36, ${effOpacity * 0.45})`
            : `rgba(186, 230, 253, ${effOpacity * 0.4})`
        );
        radGrad.addColorStop(1, 'rgba(15, 23, 42, 0.5)');

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(0, 0, d.r, 0, Math.PI * 2);
        ctx.fill();

        // Droplet top specular highlight
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1.0, 0.85 + flash * 0.15)})`;
        ctx.beginPath();
        ctx.arc(-d.r * 0.3, -d.r * 0.3, d.r * 0.25, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // 5. Draw Wet Sliding Lens Droplets & Trickle Trails
      trickles.forEach((s) => {
        // Translucent condensation trail
        if (s.trail.length > 1) {
          ctx.strokeStyle = `rgba(224, 242, 254, ${0.08 + flash * 0.15})`;
          ctx.lineWidth = s.r * 0.85;
          ctx.beginPath();
          ctx.moveTo(s.trail[0].x, s.trail[0].y);
          for (let ti = 1; ti < s.trail.length; ti++) {
            ctx.lineTo(s.trail[ti].x, s.trail[ti].y);
          }
          ctx.stroke();
        }

        // Droplet head
        ctx.save();
        ctx.translate(s.x, s.y);
        const trickleGrad = ctx.createRadialGradient(-0.4, -0.4, 0.15, 0, 0, s.r);
        trickleGrad.addColorStop(0, `rgba(255, 255, 255, ${0.95 + flash * 0.05})`);
        trickleGrad.addColorStop(
          0.65,
          warmHopeLevel > 0.4 ? 'rgba(251, 191, 36, 0.5)' : 'rgba(147, 197, 253, 0.45)'
        );
        trickleGrad.addColorStop(1, 'rgba(15, 23, 42, 0.4)');

        ctx.fillStyle = trickleGrad;
        ctx.beginPath();
        ctx.arc(0, 0, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 22) s.trail.shift();

        s.y += s.speed * (rainSurge ? 1.25 : 1.0);
        s.x += (Math.random() - 0.5) * 0.35;

        if (s.y > height + 25) {
          s.y = -15;
          s.x = Math.random() * width;
          s.trail = [];
        }
      });

      // 6. Draw Atmospheric Rain Mist & Floating Moisture
      mistParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const pulseVal = Math.sin(frame * 0.03 + p.pulse) * 0.2 + 0.8;
        const alpha = Math.min(1.0, p.opacity * pulseVal + flash * 0.55);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        if (warmHopeLevel > 0.3) {
          ctx.fillStyle = `rgba(251, 191, 36, ${alpha * 0.85})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#f59e0b';
        } else {
          ctx.fillStyle =
            flash > 0.1 ? `rgba(224, 242, 254, ${alpha})` : `rgba(186, 230, 253, ${alpha * 0.65})`;
          ctx.shadowBlur = flash > 0.1 ? 8 : 4;
          ctx.shadowColor = flash > 0.1 ? '#38bdf8' : '#60a5fa';
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [lightningFlash, warmHopeLevel, rainSurge]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[16] opacity-90" />;
}

// ============================================================================
// 2. REALISTIC GLOWING BUTTERFLY WINGS & TRAIL (SMOOTH FLIGHT PATH)
// ============================================================================
function RealisticCinematicButterfly({ delay = 0, pathType = 'climax' }) {
  return (
    <div
      className="absolute pointer-events-none z-[45]"
      style={{
        animation:
          pathType === 'climax'
            ? 'butterflyClimaxFlight 11s cubic-bezier(0.25, 1, 0.5, 1) forwards'
            : 'butterflyAmbientFloat 9s ease-in-out infinite alternate',
        animationDelay: `${delay}s`,
      }}
    >
      <div className="relative">
        <svg
          width="32"
          height="28"
          viewBox="0 0 34 28"
          className="overflow-visible drop-shadow-[0_0_16px_rgba(251,191,36,0.9)]"
        >
          <defs>
            <linearGradient id={`butterflyGrad_${pathType}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#f472b6" />
              <stop offset="75%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Left Wing */}
          <g
            style={{
              transformOrigin: '17px 14px',
              animation: 'wingFlapLeft 0.22s ease-in-out infinite',
            }}
          >
            <path
              d="M 16,14 C 11,3 3,2 1,7 C -1,13 4,20 16,16 Z"
              fill={`url(#butterflyGrad_${pathType})`}
              opacity="0.95"
            />
            <path
              d="M 16,15 C 9,18 4,24 6,26 C 9,28 14,24 16,17 Z"
              fill={`url(#butterflyGrad_${pathType})`}
              opacity="0.85"
            />
            <path
              d="M 16,14 Q 8,8 3,8 M 16,15 Q 9,14 4,16"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="0.6"
              fill="none"
            />
          </g>

          {/* Body */}
          <ellipse cx="17" cy="15" rx="1.2" ry="7" fill="#ffffff" />
          <circle cx="17" cy="8" r="1.5" fill="#fef08a" />
          <path
            d="M 17,7 Q 15,3 13,2 M 17,7 Q 19,3 21,2"
            stroke="#fef08a"
            strokeWidth="0.6"
            strokeLinecap="round"
            fill="none"
          />

          {/* Right Wing */}
          <g
            style={{
              transformOrigin: '17px 14px',
              animation: 'wingFlapRight 0.22s ease-in-out infinite',
            }}
          >
            <path
              d="M 18,14 C 23,3 31,2 33,7 C 35,13 30,20 18,16 Z"
              fill={`url(#butterflyGrad_${pathType})`}
              opacity="0.95"
            />
            <path
              d="M 18,15 C 25,18 30,24 28,26 C 25,28 20,24 18,17 Z"
              fill={`url(#butterflyGrad_${pathType})`}
              opacity="0.85"
            />
            <path
              d="M 18,14 Q 26,8 31,8 M 18,15 Q 25,14 30,16"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="0.6"
              fill="none"
            />
          </g>
        </svg>

        {/* Delicate Golden Sparkle Trail */}
        <span className="absolute -bottom-1 -left-1 text-[10px] text-amber-200 opacity-90 animate-ping">
          ✨
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// 3. FALLING FLOWER PETALS COMPONENT (DELICATE EMOTIONAL CLIMAX)
// ============================================================================
function SoftFallingPetals({ active = false }) {
  const petals = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        left: `${15 + i * 11}%`,
        delay: i * 0.9,
        duration: 7 + (i % 3) * 2,
        size: 14 + (i % 3) * 4,
        rotate: (i * 45) % 360,
      })),
    []
  );

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[18]">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -30, opacity: 0, rotate: p.rotate, x: 0 }}
          animate={{
            y: ['0vh', '105vh'],
            opacity: [0, 0.85, 0.9, 0.4, 0],
            x: [0, 20, -15, 25, 5],
            rotate: [p.rotate, p.rotate + 180, p.rotate + 360],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
          className="absolute"
          style={{ left: p.left, fontSize: `${p.size}px` }}
        >
          🌸
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================================
// 4. MASTER CINEMATIC MOVIE THUNDER ENGINE (REALISTIC ACOUSTICS & TAIL)
// ============================================================================
let sharedThunderCtx = null;
let isThunderPlaying = false;

function playCinematicMovieThunder(intensity = 1.0) {
  // Prevent harsh overlapping thunder sounds
  if (isThunderPlaying) return;
  isThunderPlaying = true;

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      isThunderPlaying = false;
      return;
    }

    if (!sharedThunderCtx || sharedThunderCtx.state === 'closed') {
      sharedThunderCtx = new AudioCtx();
    }
    const ctx = sharedThunderCtx;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const duration = 3.6; // 3.6 seconds natural acoustic roll

    // 1. Dual Noise Buffer with Brownian Low-Frequency Random Walk
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * duration;
    const noiseBuffer = ctx.createBuffer(2, bufferSize, sampleRate);
    const leftChannel = noiseBuffer.getChannelData(0);
    const rightChannel = noiseBuffer.getChannelData(1);

    let lastLeft = 0.0;
    let lastRight = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const whiteL = Math.random() * 2 - 1;
      const whiteR = Math.random() * 2 - 1;
      lastLeft = (lastLeft + 0.022 * whiteL) / 1.022;
      lastRight = (lastRight + 0.022 * whiteR) / 1.022;
      leftChannel[i] = lastLeft * 3.8;
      rightChannel[i] = lastRight * 3.8;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // 2. Dual-stage Resonant Lowpass Filter (130Hz -> 36Hz sweep)
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(135, now);
    lowpass.frequency.exponentialRampToValueAtTime(36, now + duration);
    lowpass.Q.setValueAtTime(2.6, now);

    // 3. Sub-Bass Physical Resonance Oscillator (46Hz -> 30Hz deep chest rumble)
    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(48, now);
    subOsc.frequency.exponentialRampToValueAtTime(30, now + 2.4);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.0001, now);
    subGain.gain.linearRampToValueAtTime(0.14 * intensity, now + 0.09);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);

    subOsc.connect(subGain);

    // 4. Main Thunder Rolling Envelope Gain (Impact + Echoing Clouds Tail)
    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0.0001, now);
    // Soft 75ms attack to avoid sudden clicking
    mainGain.gain.linearRampToValueAtTime(0.24 * intensity, now + 0.075);
    // Secondary acoustic echo modulation around 0.6s
    mainGain.gain.setValueAtTime(0.19 * intensity, now + 0.6);
    mainGain.gain.linearRampToValueAtTime(0.15 * intensity, now + 1.2);
    // Long natural fading tail
    mainGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // 5. Soft Dynamics Limiter / Master routing
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.setValueAtTime(-12, now);
    limiter.knee.setValueAtTime(18, now);
    limiter.ratio.setValueAtTime(8, now);
    limiter.attack.setValueAtTime(0.005, now);
    limiter.release.setValueAtTime(0.2, now);

    noiseSource.connect(lowpass);
    lowpass.connect(mainGain);
    mainGain.connect(limiter);
    subGain.connect(limiter);
    limiter.connect(ctx.destination);

    noiseSource.start(now);
    subOsc.start(now);
    noiseSource.stop(now + duration);
    subOsc.stop(now + duration);

    setTimeout(() => {
      isThunderPlaying = false;
    }, duration * 1000 + 60);
  } catch (e) {
    console.warn('Cinematic thunder engine notice:', e);
    isThunderPlaying = false;
  }
}

// ============================================================================
// MAIN UPGRADED COMPONENT: STILL WAITING CINEMATIC SCENE
// ============================================================================
export default function StillWaitingCinematicScene({ onComplete }) {
  const { playKkTrack, stopKkTrack, stopKaTrack } = useSound();

  // Phase Progression (Preserved exactly for dialogue timing):
  // 0: Darkness / Initial room fade-in
  // 1: Line 1 ("சில உணர்வுகள்...")
  // 2: Line 2 ("சில நிமிடங்கள்...")
  // 3: Line 3 ("நான் கேட்பது ஒரு பதில் மட்டும் அல்ல...")
  // 4: Line 4 ("உன் மனதில் உண்மையாக என்ன இருக்கிறது...")
  // 5: Final Message & "சம்மதம் ❤️" Button
  const [phase, setPhase] = useState(0);

  // Cinematic Lighting & Lightning States
  const [lightningFlash, setLightningFlash] = useState(0); // 0.0 -> 1.0
  const [cameraShake, setCameraShake] = useState(false);
  const [windowVibration, setWindowVibration] = useState(false);
  const [rainSurge, setRainSurge] = useState(false);
  const [warmHopeLevel, setWarmHopeLevel] = useState(0); // 0.0 -> 1.0

  // EmailJS sending state & duplicate prevention refs
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const emailSentRef = useRef(false);
  const isSendingRef = useRef(false);

  // Emotional reaction state triggered ONLY upon confirmed EmailJS send
  const [isEmotionalClimax, setIsEmotionalClimax] = useState(false);
  const [climaxStep, setClimaxStep] = useState(0);

  const kkTimerRef = useRef(null);
  const hasStartedKkRef = useRef(false);
  const isMountedRef = useRef(true);
  const timersRef = useRef([]);

  // ==========================================================================
  // LIGHTNING MOMENT 1 TRIGGER (⚡ T=0.0s Flash -> T=0.65s 🌩️ Deep Thunder Rumble)
  // ==========================================================================
  const triggerLightning1 = useCallback(() => {
    if (!isMountedRef.current) return;

    // T = 0.0s: Lightning flash strikes with realistic double-flicker
    setLightningFlash(0.95);
    const f1 = setTimeout(() => {
      if (!isMountedRef.current) return;
      setLightningFlash(0.2);
      const f2 = setTimeout(() => {
        if (!isMountedRef.current) return;
        setLightningFlash(0.85);
        const f3 = setTimeout(() => {
          if (!isMountedRef.current) return;
          setLightningFlash(0);
        }, 140);
        timersRef.current.push(f3);
      }, 50);
      timersRef.current.push(f2);
    }, 90);
    timersRef.current.push(f1);

    // T = ~0.65s (650ms natural speed-of-sound delay): Deep Thunder & subtle environmental vibration
    const tSound = setTimeout(() => {
      if (!isMountedRef.current) return;

      // 1. Play deep movie thunder sound
      playCinematicMovieThunder(1.0);

      // 2. Subtle camera and environmental reaction at the thunder moment
      setWindowVibration(true);
      setCameraShake(true);
      setRainSurge(true);

      const endVibe = setTimeout(() => {
        if (!isMountedRef.current) return;
        setWindowVibration(false);
        setCameraShake(false);
      }, 420);

      const endSurge = setTimeout(() => {
        if (!isMountedRef.current) return;
        setRainSurge(false);
      }, 1900);

      timersRef.current.push(endVibe, endSurge);
    }, 650);

    timersRef.current.push(tSound);
  }, []);

  // ==========================================================================
  // LIGHTNING MOMENT 2 TRIGGER (⚡ T=0.0s Flash -> T=0.65s 🌩️ Thunder -> Warm Hope)
  // ==========================================================================
  const triggerLightning2 = useCallback(() => {
    if (!isMountedRef.current) return;

    // T = 0.0s: Softer atmospheric lightning flash revealing scene silhouette
    setLightningFlash(0.8);
    const f1 = setTimeout(() => {
      if (!isMountedRef.current) return;
      setLightningFlash(0.18);
      const f2 = setTimeout(() => {
        if (!isMountedRef.current) return;
        setLightningFlash(0);
        // Immediately after flash: Warm golden light enters (Hope Transition)
        setWarmHopeLevel(1.0);
      }, 120);
      timersRef.current.push(f2);
    }, 110);
    timersRef.current.push(f1);

    // T = ~0.65s: Soft distant thunder rumble
    const tSound = setTimeout(() => {
      if (!isMountedRef.current) return;
      playCinematicMovieThunder(0.85);

      setWindowVibration(true);
      setRainSurge(true);

      const endVibe = setTimeout(() => {
        if (!isMountedRef.current) return;
        setWindowVibration(false);
      }, 380);

      const endSurge = setTimeout(() => {
        if (!isMountedRef.current) return;
        setRainSurge(false);
      }, 1800);

      timersRef.current.push(endVibe, endSurge);
    }, 650);

    timersRef.current.push(tSound);
  }, []);

  // ==========================================================================
  // 1. INITIAL SCENE SETUP & EXACT TIMING LIFECYCLE
  // ==========================================================================
  useEffect(() => {
    isMountedRef.current = true;

    // A. At 0 seconds: ensure any old audio is stopped so kk.mp3 MUST NOT PLAY at 0s
    if (typeof stopKaTrack === 'function') {
      stopKaTrack(0.4);
    }
    if (typeof stopKkTrack === 'function') {
      stopKkTrack(0.1);
    }

    // B. Start Heartbeat: very soft (~56 BPM, 0.18 volume)
    if (window.heartbeatEngine) {
      window.heartbeatEngine.start();
      window.heartbeatEngine.setTargetBPM(56, 0.18);
    }

    // C. Wait EXACTLY 5.0 seconds before starting /kk.mp3
    kkTimerRef.current = setTimeout(() => {
      if (!isMountedRef.current || hasStartedKkRef.current) return;
      hasStartedKkRef.current = true;

      if (typeof playKkTrack === 'function') {
        playKkTrack();
      } else if (window.soundController?.playKkTrack) {
        window.soundController.playKkTrack();
      }
    }, 5000);

    // D. Sequence text transitions at a slow, realistic cinematic movie pace
    // Phase 1 at 4.2s (Line 1)
    const t1 = setTimeout(() => setPhase(1), 4200);

    // Phase 2 at 11.5s (Line 2)
    const t2 = setTimeout(() => {
      setPhase(2);
      if (window.heartbeatEngine) {
        window.heartbeatEngine.setTargetBPM(60, 0.2);
      }
    }, 11500);

    // LIGHTNING MOMENT 1 at 15.5s (Between Line 2 and Line 3)
    const tLightning1 = setTimeout(() => {
      triggerLightning1();
    }, 15500);

    // Phase 3 at 18.5s (Line 3)
    const t3 = setTimeout(() => setPhase(3), 18500);

    // Phase 4 at 24.5s (Line 4)
    const t4 = setTimeout(() => setPhase(4), 24500);

    // LIGHTNING MOMENT 2 at 28.5s (Immediately preceding Phase 5 hope transition)
    const tLightning2 = setTimeout(() => {
      triggerLightning2();
    }, 28500);

    // Phase 5 at 31.0s (Final Emotional Message & "சம்மதம் ❤️" Button)
    const t5 = setTimeout(() => {
      setPhase(5);
      if (window.heartbeatEngine) {
        window.heartbeatEngine.setTargetBPM(64, 0.22);
      }
    }, 31000);

    timersRef.current.push(t1, t2, tLightning1, t3, t4, tLightning2, t5);

    return () => {
      isMountedRef.current = false;
      if (kkTimerRef.current) {
        clearTimeout(kkTimerRef.current);
        kkTimerRef.current = null;
      }
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];

      // Clean up kk.mp3 according to project's audio behavior
      if (typeof stopKkTrack === 'function') {
        stopKkTrack(1.0);
      } else if (window.soundController?.stopKkTrack) {
        window.soundController.stopKkTrack(1.0);
      }

      // Close shared thunder context if open
      if (sharedThunderCtx && sharedThunderCtx.state !== 'closed') {
        sharedThunderCtx.close().catch(() => {});
        sharedThunderCtx = null;
      }
    };
  }, [playKkTrack, stopKaTrack, stopKkTrack, triggerLightning1, triggerLightning2]);

  // ==========================================================================
  // 2. TRIGGER CINEMATIC EMOTIONAL REACTION (Triggered ONLY on EmailJS Success)
  // ==========================================================================
  const triggerEmotionalReaction = () => {
    setIsEmotionalClimax(true);

    // Heartbeat becomes slightly more noticeable for a short cinematic moment (~72 BPM, 0.28 volume)
    if (window.heartbeatEngine) {
      window.heartbeatEngine.setTargetBPM(72, 0.28);
    }

    // Step 1 (0.8s): Emotional reaction & "சில வார்த்தைகள்... மனசை விட்டு போகாது. ❤️"
    const ct1 = setTimeout(() => {
      setClimaxStep(1);
    }, 800);

    // Step 2 (4.8s): "நன்றி..."
    const ct2 = setTimeout(() => {
      setClimaxStep(2);
      if (window.heartbeatEngine) {
        window.heartbeatEngine.setTargetBPM(58, 0.18);
      }
    }, 4800);

    // Step 3 (8.6s): Smooth transition to existing next scene
    const ct3 = setTimeout(() => {
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }, 8600);

    timersRef.current.push(ct1, ct2, ct3);
  };

  // ==========================================================================
  // 3. HANDLE "சம்மதம் ❤️" BUTTON CLICK: MANDATORY REAL EMAILJS VERIFICATION
  // ==========================================================================
  const handleSammathamClick = async () => {
    if (isSendingRef.current || emailSentRef.current || isEmotionalClimax) return;

    isSendingRef.current = true;
    setIsSendingEmail(true);
    setEmailError(null);

    const now = new Date();
    const formattedDate = now.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    try {
      const isSent = await sendEmail({
        title: '❤️ A Special Moment — She Clicked Sammatham',
        message: `❤️ A special moment happened.

The 'சம்மதம் ❤️' button was clicked.

Time:
${formattedDate}

This notification was generated from the
For Saranya cinematic experience.`,
      });

      if (isSent === true) {
        emailSentRef.current = true;
        setIsSendingEmail(false);
        triggerEmotionalReaction();
      } else {
        throw new Error('EmailJS returned non-success response');
      }
    } catch (err) {
      console.error('❌ EmailJS send failure on "சம்மதம் ❤️" click:', err);
      isSendingRef.current = false;
      setIsSendingEmail(false);
      setEmailError('ஒரு சிறிய technical issue... மீண்டும் முயற்சி செய் ❤️');
    }
  };

  return (
    <div
      className={`fixed inset-0 w-full h-full bg-[#030206] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden select-none z-[125] animate-in fade-in duration-1000 ${
        cameraShake ? 'translate-y-[-1px] translate-x-[0.8px]' : ''
      } transition-transform duration-75`}
    >
      {/* SCREEN-LEVEL CONTINUOUS TRAVELLING RAINBOW BORDER */}
      <CinematicRainbowBorder
        mode="screen"
        className={warmHopeLevel > 0.4 ? 'opacity-90' : 'opacity-60'}
      />

      {/* MASTER MOVIE CSS STYLES FOR CAMERA, BOKEH, CAR SWEEP, WING FLAP */}
      <style>{`
        /* Slow Cinematic Movie Camera Push */
        @keyframes masterCameraPush {
          0% { transform: scale(1.0) translateY(0px); }
          50% { transform: scale(1.03) translateY(-4px); }
          100% { transform: scale(1.06) translateY(-8px); }
        }

        /* Ambient Bokeh Drifting */
        @keyframes masterBokeh1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); opacity: 0.35; }
          50% { transform: translate(14px, -16px) scale(1.18); opacity: 0.55; }
        }
        @keyframes masterBokeh2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); opacity: 0.3; }
          50% { transform: translate(-16px, 14px) scale(0.88); opacity: 0.5; }
        }

        /* Butterfly Climax Flight Path */
        @keyframes butterflyClimaxFlight {
          0% {
            left: 20%;
            top: 78%;
            opacity: 0;
            transform: scale(0.7) rotate(15deg);
          }
          15% {
            opacity: 1;
            left: 32%;
            top: 62%;
            transform: scale(0.85) rotate(-8deg);
          }
          40% {
            left: 44%;
            top: 50%;
            transform: scale(1) rotate(18deg);
          }
          65% {
            left: 56%;
            top: 34%;
            transform: scale(0.92) rotate(-12deg);
          }
          85% {
            left: 68%;
            top: 18%;
            opacity: 0.85;
            transform: scale(0.8) rotate(14deg);
          }
          100% {
            left: 78%;
            top: 4%;
            opacity: 0;
            transform: scale(0.65) rotate(20deg);
          }
        }

        /* Butterfly Ambient Gentle Floating */
        @keyframes butterflyAmbientFloat {
          0% { transform: translate(0, 0) rotate(5deg); }
          50% { transform: translate(25px, -35px) rotate(-8deg); }
          100% { transform: translate(-15px, -60px) rotate(12deg); }
        }

        /* Wing Flapping */
        @keyframes wingFlapLeft {
          0%, 100% { transform: scaleX(1) rotate(0deg); }
          50% { transform: scaleX(0.18) rotate(16deg); }
        }
        @keyframes wingFlapRight {
          0%, 100% { transform: scaleX(1) rotate(0deg); }
          50% { transform: scaleX(0.18) rotate(-16deg); }
        }

        /* Tear-like subtle light tremor */
        @keyframes tearLightGlisten {
          0%, 100% { opacity: 0.2; transform: scale(0.98); }
          50% { opacity: 0.45; transform: scale(1.02); filter: drop-shadow(0 0 15px rgba(244,114,182,0.6)); }
        }
      `}</style>

      {/* SVG NOISE FILTER FOR CINEMATIC FILM GRAIN */}
      <svg className="hidden">
        <filter id="cinematic-film-grain-master">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        className="absolute inset-0 pointer-events-none z-30 opacity-[0.035] mix-blend-overlay"
        style={{ filter: 'url(#cinematic-film-grain-master)' }}
      />

      {/* CINEMATIC LETTERBOX VIGNETTE */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 38%, rgba(2, 1, 5, 0.45) 70%, rgba(2, 1, 5, 0.88) 100%)',
        }}
      />

      {/* ====================================================================
          FULL-SCREEN CINEMATIC ROMANTIC RAIN MOVIE BACKGROUND (public/l.jpg)
      ==================================================================== */}
      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none z-[10] ${
          windowVibration ? 'translate-y-[0.5px] translate-x-[-0.5px]' : ''
        } transition-transform duration-75`}
      >
        {/* 1. Main Background Image: public/l.jpg (Responsive Full-Viewport Cover) */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{ animation: 'masterCameraPush 50s ease-in-out infinite alternate' }}
        >
          <img
            src="/l.jpg"
            alt="Rain Cinematic Romantic Couple"
            className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.08] saturate-[1.05]"
          />
        </div>

        {/* 2. Soft Atmospheric Depth & Color Grading Overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background:
              warmHopeLevel > 0.4
                ? 'linear-gradient(to top, rgba(15, 7, 18, 0.8) 0%, rgba(10, 8, 22, 0.35) 50%, rgba(5, 6, 20, 0.4) 100%)'
                : 'linear-gradient(to top, rgba(6, 4, 14, 0.82) 0%, rgba(4, 6, 18, 0.4) 50%, rgba(2, 4, 12, 0.45) 100%)',
          }}
        />

        {/* 3. Subtle City & Streetlight Bokeh Halos */}
        <div
          className="absolute top-[20%] left-[18%] w-36 h-36 rounded-full bg-cyan-400/15 blur-2xl pointer-events-none mix-blend-screen"
          style={{ animation: 'masterBokeh1 12s ease-in-out infinite' }}
        />
        <div
          className="absolute top-[35%] right-[20%] w-40 h-40 rounded-full bg-amber-400/15 blur-3xl pointer-events-none mix-blend-screen"
          style={{ animation: 'masterBokeh2 14s ease-in-out infinite' }}
        />
        <div
          className="absolute bottom-[28%] left-[30%] w-32 h-32 rounded-full bg-rose-500/12 blur-2xl pointer-events-none mix-blend-screen"
          style={{ animation: 'masterBokeh1 16s ease-in-out infinite reverse' }}
        />

        {/* 4. REALISTIC MULTI-DEPTH RAIN & WET GLASS CANVAS */}
        <MasterRainCanvas
          lightningFlash={lightningFlash}
          warmHopeLevel={warmHopeLevel}
          rainSurge={rainSurge}
        />

        {/* 5. ATMOSPHERIC LIGHTNING ILLUMINATION & FLASH LAYER */}
        {lightningFlash > 0 && (
          <div
            className="absolute inset-0 pointer-events-none z-[17] transition-opacity duration-75"
            style={{
              background: `radial-gradient(ellipse at 50% 25%, rgba(240, 249, 255, ${
                lightningFlash * 0.85
              }) 0%, rgba(186, 230, 253, ${lightningFlash * 0.5}) 45%, rgba(56, 189, 248, ${
                lightningFlash * 0.25
              }) 100%)`,
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* 6. CINEMATIC BUTTERFLIES (Ambient + Climax Composition) */}
        {phase >= 4 && !isEmotionalClimax && (
          <div className="absolute bottom-1/3 left-1/4 pointer-events-none z-[45]">
            <RealisticCinematicButterfly delay={0} pathType="ambient" />
          </div>
        )}

        {isEmotionalClimax && (
          <>
            <RealisticCinematicButterfly delay={0} pathType="climax" />
            <div className="absolute bottom-1/2 right-1/4 pointer-events-none z-[45]">
              <RealisticCinematicButterfly delay={1.8} pathType="ambient" />
            </div>
          </>
        )}

        {/* 7. FALLING FLOWER PETALS (Climax) */}
        <SoftFallingPetals active={isEmotionalClimax || phase >= 5} />
      </div>

      {/* ====================================================================
          EMOTIONAL DIALOGUE SUBTITLES & "சம்மதம் ❤️" BUTTON LAYER
      ==================================================================== */}
      <div className="relative z-30 w-full max-w-2xl mx-auto px-4 py-6 flex flex-col items-center justify-center text-center min-h-[380px] sm:min-h-[420px]">
        <AnimatePresence mode="wait">
          {/* PHASE 1: LINE 1 */}
          {phase === 1 && !isEmotionalClimax && (
            <motion.div
              key="line1"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18, filter: 'blur(6px)' }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
              className="space-y-3"
            >
              <p className="text-xl sm:text-2xl md:text-3xl font-serif text-slate-100 font-light leading-relaxed tracking-wide drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
                "சில உணர்வுகள்...
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-serif text-rose-200/90 italic font-light tracking-wide drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
                சொல்லிவிட்ட பிறகும் முடிவதில்லை."
              </p>
            </motion.div>
          )}

          {/* PHASE 2: LINE 2 */}
          {phase === 2 && !isEmotionalClimax && (
            <motion.div
              key="line2"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18, filter: 'blur(6px)' }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
              className="space-y-3"
            >
              <p className="text-xl sm:text-2xl md:text-3xl font-serif text-slate-100 font-light leading-relaxed tracking-wide drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
                "சில நிமிடங்கள்...
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-serif text-rose-200/90 italic font-light tracking-wide drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
                ஒரு வாழ்நாள் போல காத்திருக்க வைக்கும்."
              </p>
            </motion.div>
          )}

          {/* PHASE 3: LINE 3 */}
          {phase === 3 && !isEmotionalClimax && (
            <motion.div
              key="line3"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18, filter: 'blur(6px)' }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
              className="space-y-2"
            >
              <p className="text-xl sm:text-2xl md:text-3xl font-serif text-slate-100 font-light leading-relaxed tracking-wide drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
                "நான் கேட்பது ஒரு பதில் மட்டும் அல்ல..."
              </p>
            </motion.div>
          )}

          {/* PHASE 4: LINE 4 */}
          {phase === 4 && !isEmotionalClimax && (
            <motion.div
              key="line4"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18, filter: 'blur(6px)' }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
              className="space-y-3"
            >
              <p className="text-xl sm:text-2xl md:text-3xl font-serif text-slate-100 font-light leading-relaxed tracking-wide drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
                "உன் மனதில் உண்மையாக என்ன இருக்கிறது
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-serif text-rose-200/90 italic font-light tracking-wide drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
                என்பதை மட்டும்."
              </p>
            </motion.div>
          )}

          {/* PHASE 5: FINAL EMOTIONAL MESSAGE + "சம்மதம் ❤️" BUTTON */}
          {phase >= 5 && !isEmotionalClimax && (
            <motion.div
              key="phase5"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
              className="space-y-6 sm:space-y-8 flex flex-col items-center"
            >
              {/* Final Emotional Text Sequence */}
              <div className="space-y-4 max-w-xl text-center px-3">
                <p className="text-base sm:text-lg md:text-xl font-serif text-slate-100 font-light leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                  "உனக்காக என்னால் முடிந்ததை எல்லாம் செய்வேன்...
                  <br />
                  <span className="text-rose-200/95 font-normal">
                    யாருக்காகவும், எதற்காகவும் உன்னை விட்டுக் கொடுக்க மாட்டேன்.
                  </span>
                </p>

                <div className="w-12 h-[1px] mx-auto bg-gradient-to-r from-transparent via-rose-400/50 to-transparent" />

                <p className="text-sm sm:text-base md:text-lg font-serif text-slate-200/90 font-light italic leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                  ஆனா...
                  <br />
                  உன் மனசுல என்ன இருந்தாலும்,
                  <br />
                  <span className="text-amber-200/90 font-medium not-italic">
                    அதை நான் ஏற்றுக்கொள்வேன்.
                  </span>
                </p>

                <p className="text-base sm:text-lg md:text-xl font-serif text-rose-300 font-medium tracking-wide drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]">
                  சம்மதம்... ❤️
                </p>
              </div>

              {/* SINGLE BEAUTIFUL CINEMATIC "சம்மதம் ❤️" BUTTON */}
              <motion.button
                whileHover={!isSendingEmail ? { scale: 1.05 } : {}}
                whileTap={!isSendingEmail ? { scale: 0.96 } : {}}
                onClick={handleSammathamClick}
                disabled={isSendingEmail}
                className={`px-8 sm:px-12 py-3.5 sm:py-4 rounded-full font-serif text-base sm:text-lg md:text-xl font-medium text-white tracking-wider cursor-pointer shadow-[0_0_35px_rgba(244,63,94,0.45)] border border-amber-300/40 backdrop-blur-xl transition-all duration-300 flex items-center justify-center gap-2.5 ${
                  isSendingEmail ? 'opacity-80 cursor-wait' : ''
                }`}
                style={{
                  background:
                    'linear-gradient(135deg, rgba(244,63,94,0.75) 0%, rgba(236,72,153,0.65) 50%, rgba(168,85,247,0.55) 100%)',
                }}
              >
                <span>{isSendingEmail ? 'சம்மதம்... ❤️' : 'சம்மதம் ❤️'}</span>
                <Sparkles
                  className={`w-4 h-4 text-amber-200 ${
                    isSendingEmail ? 'animate-spin' : 'animate-pulse'
                  }`}
                />
              </motion.button>

              {emailError && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs sm:text-sm font-serif italic text-rose-300/90 pt-1 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] text-center"
                >
                  {emailError}
                </motion.p>
              )}
            </motion.div>
          )}

          {/* EMOTIONAL CLIMAX: AFTER CLICKING "சம்மதம் ❤️" */}
          {isEmotionalClimax && (
            <motion.div
              key="climax"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4 }}
              className="space-y-6 sm:space-y-8 flex flex-col items-center"
            >
              {/* Subtle tear-like glistening light & atmospheric blur */}
              <div
                className="absolute -inset-16 pointer-events-none rounded-full blur-3xl opacity-40"
                style={{
                  background:
                    'radial-gradient(circle, rgba(244,63,94,0.4) 0%, rgba(168,85,247,0.2) 60%, transparent 80%)',
                  animation: 'tearLightGlisten 4s ease-in-out infinite',
                }}
              />

              {/* Climax Message Part 1: "சில வார்த்தைகள்... மனசை விட்டு போகாது. ❤️" */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4 }}
                className="space-y-2 z-10"
              >
                <p className="text-xl sm:text-2xl md:text-3xl font-serif text-slate-100 font-light leading-relaxed drop-shadow-[0_2px_15px_rgba(0,0,0,0.95)]">
                  "சில வார்த்தைகள்...
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-serif text-rose-300 font-medium tracking-wide drop-shadow-[0_0_20px_rgba(244,63,94,0.8)]">
                  மனசை விட்டு போகாது. ❤️"
                </p>
              </motion.div>

              {/* Climax Message Part 2: "நன்றி..." */}
              {climaxStep >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2 }}
                  className="pt-2 sm:pt-4 z-10 flex flex-col items-center space-y-2"
                >
                  <p className="text-2xl sm:text-3xl md:text-4xl font-serif text-amber-200 font-normal tracking-widest drop-shadow-[0_0_25px_rgba(251,191,36,0.9)] animate-pulse">
                    நன்றி...
                  </p>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent rounded-full" />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
