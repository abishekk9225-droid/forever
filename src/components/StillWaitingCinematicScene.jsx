import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import { sendEmail } from '../utils/emailService';
import CinematicRainbowBorder from './CinematicRainbowBorder';

// ============================================================================
// 1. STUDIO-GRADE MULTI-DEPTH CINEMATIC RAIN & WET GLASS CANVAS (60 FPS)
// ============================================================================
function MasterRainCanvas({ lightningFlash = 0, warmHopeLevel = 0 }) {
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

    // Layer 1: Distant Background Rain (Fine, fast, deep blue-grey)
    const bgCount = isMobile ? 50 : 100;
    const bgRain = Array.from({ length: bgCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      len: Math.random() * 14 + 10,
      speed: Math.random() * 7 + 8,
      slant: -1.2,
      opacity: Math.random() * 0.15 + 0.08,
      width: 0.8,
    }));

    // Layer 2: Midground Rain (Medium streaks, slight angle)
    const mgCount = isMobile ? 35 : 70;
    const mgRain = Array.from({ length: mgCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      len: Math.random() * 22 + 16,
      speed: Math.random() * 11 + 13,
      slant: -1.8,
      opacity: Math.random() * 0.28 + 0.15,
      width: 1.2,
    }));

    // Layer 3: Foreground Rain (Heavy, fast, motion blurred)
    const fgCount = isMobile ? 18 : 35;
    const fgRain = Array.from({ length: fgCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      len: Math.random() * 32 + 25,
      speed: Math.random() * 16 + 18,
      slant: -2.4,
      opacity: Math.random() * 0.4 + 0.2,
      width: 1.8,
    }));

    // Layer 4: Static Condensation Droplets on Window Glass Pane
    const staticCount = isMobile ? 45 : 85;
    const staticDrops = Array.from({ length: staticCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.8 + 1.2,
      opacity: Math.random() * 0.4 + 0.35,
      aspect: Math.random() * 0.3 + 0.85,
    }));

    // Layer 5: Slow Trickling Rain Droplets sliding down the glass pane
    const trickleCount = isMobile ? 8 : 16;
    const trickles = Array.from({ length: trickleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: Math.random() * 1.5 + 0.6,
      r: Math.random() * 2.4 + 1.4,
      trail: [],
    }));

    // Layer 6: Atmospheric Ambient Floating Dust & Mist Particles
    const dustCount = isMobile ? 20 : 38;
    const dustParticles = Array.from({ length: dustCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.2 + 0.8,
      vx: (Math.random() - 0.5) * 0.3 - 0.2,
      vy: -Math.random() * 0.4 - 0.15,
      opacity: Math.random() * 0.4 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const flash = lightningFlash; // 0.0 to 1.0

      // 1. Render Background Rain
      ctx.lineCap = 'round';
      bgRain.forEach((d) => {
        const dropOpacity = d.opacity + flash * 0.35;
        ctx.lineWidth = d.width;
        ctx.strokeStyle = `rgba(186, 215, 255, ${dropOpacity})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.slant, d.y + d.len);
        ctx.stroke();

        d.y += d.speed;
        d.x += d.slant * 0.4;
        if (d.y > height + 20) {
          d.y = -20;
          d.x = Math.random() * (width + 100);
        }
      });

      // 2. Render Midground Rain
      mgRain.forEach((d) => {
        const dropOpacity = d.opacity + flash * 0.45;
        ctx.lineWidth = d.width;
        ctx.strokeStyle = `rgba(219, 234, 254, ${dropOpacity})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.slant, d.y + d.len);
        ctx.stroke();

        d.y += d.speed;
        d.x += d.slant * 0.5;
        if (d.y > height + 30) {
          d.y = -30;
          d.x = Math.random() * (width + 100);
        }
      });

      // 3. Render Foreground Rain
      fgRain.forEach((d) => {
        const dropOpacity = d.opacity + flash * 0.55;
        ctx.lineWidth = d.width;
        ctx.strokeStyle = `rgba(240, 249, 255, ${dropOpacity})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.slant, d.y + d.len);
        ctx.stroke();

        d.y += d.speed;
        d.x += d.slant * 0.6;
        if (d.y > height + 40) {
          d.y = -40;
          d.x = Math.random() * (width + 100);
        }
      });

      // 4. Render Static Droplets on Window Glass Pane
      staticDrops.forEach((d) => {
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.scale(1, d.aspect);

        const effOpacity = Math.min(1.0, d.opacity + flash * 0.45);
        const radGrad = ctx.createRadialGradient(-0.4, -0.4, 0.1, 0, 0, d.r);
        radGrad.addColorStop(0, `rgba(255, 255, 255, ${effOpacity * 0.95})`);
        radGrad.addColorStop(
          0.5,
          warmHopeLevel > 0.4
            ? `rgba(251, 191, 36, ${effOpacity * 0.4})`
            : `rgba(244, 114, 182, ${effOpacity * 0.35})`
        );
        radGrad.addColorStop(1, 'rgba(15, 23, 42, 0.45)');

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(0, 0, d.r, 0, Math.PI * 2);
        ctx.fill();

        // Droplet top reflection highlight
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1.0, 0.8 + flash * 0.2)})`;
        ctx.beginPath();
        ctx.arc(-d.r * 0.28, -d.r * 0.28, d.r * 0.24, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // 5. Render Sliding Trickles Down the Glass Pane
      trickles.forEach((s) => {
        // Draw faint condensation trail
        if (s.trail.length > 1) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.07 + flash * 0.12})`;
          ctx.lineWidth = s.r * 0.9;
          ctx.beginPath();
          ctx.moveTo(s.trail[0].x, s.trail[0].y);
          for (let ti = 1; ti < s.trail.length; ti++) {
            ctx.lineTo(s.trail[ti].x, s.trail[ti].y);
          }
          ctx.stroke();
        }

        // Draw moving droplet head
        ctx.save();
        ctx.translate(s.x, s.y);
        const trickleGrad = ctx.createRadialGradient(-0.4, -0.4, 0.15, 0, 0, s.r);
        trickleGrad.addColorStop(0, `rgba(255, 255, 255, ${0.95 + flash * 0.05})`);
        trickleGrad.addColorStop(
          0.65,
          warmHopeLevel > 0.4 ? 'rgba(251, 191, 36, 0.45)' : 'rgba(236, 72, 153, 0.4)'
        );
        trickleGrad.addColorStop(1, 'rgba(15, 23, 42, 0.35)');

        ctx.fillStyle = trickleGrad;
        ctx.beginPath();
        ctx.arc(0, 0, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 20) s.trail.shift();

        s.y += s.speed;
        s.x += (Math.random() - 0.5) * 0.35;

        if (s.y > height + 25) {
          s.y = -15;
          s.x = Math.random() * width;
          s.trail = [];
        }
      });

      // 6. Render Floating Atmospheric Dust & Golden Particles
      dustParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const pulseVal = Math.sin(frame * 0.03 + p.pulse) * 0.2 + 0.8;
        const alpha = Math.min(1.0, (p.opacity * pulseVal) + flash * 0.5);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        if (warmHopeLevel > 0.3) {
          ctx.fillStyle = `rgba(251, 191, 36, ${alpha * 0.9})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#f59e0b';
        } else {
          ctx.fillStyle = flash > 0.1 ? `rgba(224, 242, 254, ${alpha})` : `rgba(244, 114, 182, ${alpha * 0.6})`;
          ctx.shadowBlur = flash > 0.1 ? 8 : 4;
          ctx.shadowColor = flash > 0.1 ? '#38bdf8' : '#f472b6';
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
  }, [lightningFlash, warmHopeLevel]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[12] opacity-90" />;
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
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[16]">
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
// 4. SYNTHESIZED STUDIO ACOUSTIC DISTANT THUNDER RUMBLE (WEB AUDIO API)
// ============================================================================
function playAcousticThunderRumble() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Pink/Brown noise buffer for realistic thunder texture
    const bufferSize = ctx.sampleRate * 2.8;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02; // Brown noise algorithm
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    // Resonant Lowpass Filter tuned for distant thunder acoustics (60Hz - 160Hz)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, now);
    filter.frequency.exponentialRampToValueAtTime(55, now + 2.5);
    filter.Q.setValueAtTime(3.2, now);

    // Gain envelope with soft physical strike and deep rolling tail
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(0.18, now + 0.18);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2.7);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 2.8);

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 3000);
  } catch (e) {
    console.warn('Synthesized thunder audio notice:', e);
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
  // LIGHTNING MOMENT 1 TRIGGER (Authentic Flash + Speed of Sound Delay Thunder)
  // ==========================================================================
  const triggerLightning1 = useCallback(() => {
    if (!isMountedRef.current) return;

    // 1. Initial quick double-strike lightning flash
    setLightningFlash(0.95);
    setTimeout(() => {
      if (!isMountedRef.current) return;
      setLightningFlash(0.2);
      setTimeout(() => {
        if (!isMountedRef.current) return;
        setLightningFlash(0.8);
        setTimeout(() => {
          if (!isMountedRef.current) return;
          setLightningFlash(0);
        }, 140);
      }, 50);
    }, 90);

    // 2. Realistic subtle camera micro-movement
    setCameraShake(true);
    setTimeout(() => {
      if (isMountedRef.current) setCameraShake(false);
    }, 450);

    // 3. Distant thunder rumbling sound after physical sound delay (~650ms)
    setTimeout(() => {
      if (isMountedRef.current) {
        playAcousticThunderRumble();
      }
    }, 650);
  }, []);

  // ==========================================================================
  // LIGHTNING MOMENT 2 TRIGGER (Climax Hope Transition)
  // ==========================================================================
  const triggerLightning2 = useCallback(() => {
    if (!isMountedRef.current) return;

    // Softer, atmospheric lightning flash revealing room silhouette
    setLightningFlash(0.75);
    setTimeout(() => {
      if (!isMountedRef.current) return;
      setLightningFlash(0.15);
      setTimeout(() => {
        if (!isMountedRef.current) return;
        setLightningFlash(0);
        // Immediately after flash: Warm golden light gradually enters (Hope Transition)
        setWarmHopeLevel(1.0);
      }, 120);
    }, 110);

    setTimeout(() => {
      if (isMountedRef.current) {
        playAcousticThunderRumble();
      }
    }, 750);
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
        window.heartbeatEngine.setTargetBPM(60, 0.20);
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
        cameraShake ? 'translate-y-[-1.5px] translate-x-[1px]' : ''
      } transition-transform duration-75`}
    >
      {/* SCREEN-LEVEL CONTINUOUS TRAVELLING RAINBOW BORDER */}
      <CinematicRainbowBorder mode="screen" className={warmHopeLevel > 0.4 ? 'opacity-90' : 'opacity-60'} />

      {/* MASTER MOVIE CSS STYLES FOR CAMERA, BOKEH, CAR SWEEP, WING FLAP */}
      <style>{`
        /* Slow Cinematic Movie Camera Push */
        @keyframes masterCameraPush {
          0% { transform: scale(1.0) translateY(0px); }
          50% { transform: scale(1.04) translateY(-5px); }
          100% { transform: scale(1.075) translateY(-10px); }
        }

        /* Warm Table Lamp Breathing Ambient Glow */
        @keyframes masterLampBreathe {
          0%, 100% { opacity: 0.7; transform: scale(1); filter: drop-shadow(0 0 35px rgba(251,191,36,0.4)); }
          50% { opacity: 0.92; transform: scale(1.06); filter: drop-shadow(0 0 60px rgba(245,158,11,0.6)); }
        }

        /* Distant City Lights Bokeh Drifting Outside Window */
        @keyframes masterBokeh1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); opacity: 0.35; }
          50% { transform: translate(14px, -16px) scale(1.18); opacity: 0.55; }
        }
        @keyframes masterBokeh2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); opacity: 0.3; }
          50% { transform: translate(-16px, 14px) scale(0.88); opacity: 0.5; }
        }

        /* Occasional Passing Car Headlights Ambient Sweep Outside Glass */
        @keyframes masterCarSweep {
          0%, 82% { opacity: 0; transform: translateX(-120%) skewX(-20deg); }
          86% { opacity: 0.16; }
          90% { opacity: 0.22; }
          94% { opacity: 0; transform: translateX(140%) skewX(-20deg); }
          100% { opacity: 0; }
        }

        /* Phone Screen Soft Periodic Notification Pulse */
        @keyframes masterPhonePulse {
          0%, 85%, 100% { opacity: 0.25; box-shadow: 0 0 6px rgba(244,114,182,0.3); }
          92% { opacity: 0.85; box-shadow: 0 0 20px rgba(244,114,182,0.75); }
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

      {/* SVG NOISE FILTER FOR FILM GRAIN */}
      <svg className="hidden">
        <filter id="cinematic-film-grain-master">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
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
            'radial-gradient(ellipse at center, transparent 36%, rgba(2, 1, 5, 0.65) 72%, rgba(2, 1, 5, 0.98) 100%)',
        }}
      />

      {/* ====================================================================
          REALISTIC MOVIE SCENE ENVIRONMENT (Slow Camera Push & Depth)
      ==================================================================== */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ animation: 'masterCameraPush 45s ease-in-out infinite alternate' }}
      >
        {/* 1. OUTSIDE RAINY NIGHT BACKDROP (Deep navy, purple, cool blue) */}
        <div
          className="absolute inset-0 transition-colors duration-1000"
          style={{
            background:
              warmHopeLevel > 0.4
                ? 'linear-gradient(175deg, #050614 0%, #0d0c24 35%, #180e28 70%, #241126 100%)'
                : 'linear-gradient(175deg, #02040b 0%, #060916 35%, #0b071a 70%, #15091a 100%)',
          }}
        />

        {/* 2. DISTANT CITY LIGHT BOKEH (Pink, purple, gold blurred circles outside window) */}
        <div
          className="absolute top-[18%] left-[22%] w-32 h-32 rounded-full bg-pink-500/15 blur-2xl pointer-events-none"
          style={{ animation: 'masterBokeh1 12s ease-in-out infinite' }}
        />
        <div
          className="absolute top-[32%] left-[48%] w-40 h-40 rounded-full bg-purple-600/15 blur-3xl pointer-events-none"
          style={{ animation: 'masterBokeh2 15s ease-in-out infinite' }}
        />
        <div
          className="absolute top-[24%] right-[25%] w-36 h-36 rounded-full bg-amber-400/15 blur-2xl pointer-events-none"
          style={{ animation: 'masterBokeh1 14s ease-in-out infinite reverse' }}
        />
        <div
          className="absolute top-[40%] right-[15%] w-28 h-28 rounded-full bg-blue-500/15 blur-2xl pointer-events-none"
          style={{ animation: 'masterBokeh2 11s ease-in-out infinite' }}
        />

        {/* 3. OCCASIONAL PASSING CAR HEADLIGHTS SWEEP ACROSS WINDOW */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/10 to-transparent pointer-events-none"
          style={{ animation: 'masterCarSweep 16s ease-in-out infinite' }}
        />

        {/* 4. REALISTIC MULTI-DEPTH RAIN & WET GLASS CANVAS */}
        <MasterRainCanvas lightningFlash={lightningFlash} warmHopeLevel={warmHopeLevel} />

        {/* 5. ATMOSPHERIC LIGHTNING ILLUMINATION LAYER */}
        {lightningFlash > 0 && (
          <div
            className="absolute inset-0 pointer-events-none z-[13] transition-opacity duration-75"
            style={{
              background: `radial-gradient(ellipse at 50% 20%, rgba(224, 242, 254, ${lightningFlash * 0.75}) 0%, rgba(186, 230, 253, ${lightningFlash * 0.4}) 50%, rgba(14, 165, 233, ${lightningFlash * 0.2}) 100%)`,
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* 6. WINDOW FRAME MULLION & TRANSOM SILHOUETTE */}
        <div className="absolute inset-0 pointer-events-none z-[13]">
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[3px] bg-slate-900/70 shadow-[0_0_12px_rgba(0,0,0,0.8)]" />
          <div className="absolute left-0 right-0 top-[28%] h-[3px] bg-slate-900/70 shadow-[0_0_12px_rgba(0,0,0,0.8)]" />
        </div>

        {/* 7. ROOM INTERIOR FOREGROUND (Warm wooden table, lamp, empty chair, memory photos) */}
        <div className="absolute inset-x-0 bottom-0 h-[48%] sm:h-[45%] pointer-events-none z-[14]">
          {/* Wooden Table Surface with Warm Ambient Glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                warmHopeLevel > 0.4
                  ? 'linear-gradient(to top, rgba(22, 10, 14, 0.96) 0%, rgba(32, 15, 20, 0.88) 60%, rgba(18, 8, 12, 0.45) 100%)'
                  : 'linear-gradient(to top, rgba(14, 7, 10, 0.96) 0%, rgba(22, 11, 15, 0.85) 60%, rgba(10, 5, 8, 0.4) 100%)',
              borderTop: '1px solid rgba(244, 114, 182, 0.15)',
            }}
          />

          {/* Warm Table Lamp casting amber/rose illumination */}
          <div className="absolute bottom-4 left-4 sm:left-12 flex flex-col items-center">
            <div
              className="absolute -top-32 -left-16 w-64 h-64 rounded-full pointer-events-none blur-3xl"
              style={{
                background:
                  warmHopeLevel > 0.4
                    ? 'radial-gradient(ellipse at center, rgba(251, 191, 36, 0.45) 0%, rgba(244, 63, 94, 0.25) 50%, transparent 80%)'
                    : 'radial-gradient(ellipse at center, rgba(251, 191, 36, 0.28) 0%, rgba(244, 63, 94, 0.15) 50%, transparent 80%)',
                animation: 'masterLampBreathe 6s ease-in-out infinite',
              }}
            />
            <div className="w-10 sm:w-14 h-8 sm:h-10 bg-gradient-to-b from-amber-200/40 via-amber-400/25 to-rose-500/20 rounded-t-lg border-b border-amber-300/40 shadow-[0_0_20px_rgba(251,191,36,0.4)]" />
            <div className="w-1.5 h-16 sm:h-20 bg-gradient-to-b from-amber-600/50 to-slate-800/80" />
            <div className="w-8 sm:w-12 h-2 rounded-full bg-slate-800/90 border-t border-amber-500/30" />
          </div>

          {/* ONE EMPTY CHAIR OPPOSITE (Right side of room with delicate rim lighting) */}
          <div className="absolute bottom-6 right-6 sm:right-16 flex flex-col items-center opacity-75">
            <div className="relative w-16 sm:w-22 h-24 sm:h-32 rounded-t-2xl border-t-2 border-x-2 border-rose-400/30 bg-gradient-to-b from-slate-900/85 via-zinc-950/90 to-transparent shadow-[inset_0_2px_8px_rgba(244,114,182,0.2)]">
              <div className="absolute inset-x-2 top-4 bottom-2 flex justify-around opacity-40">
                <div className="w-[1.5px] h-full bg-rose-300/30" />
                <div className="w-[1.5px] h-full bg-rose-300/30" />
                <div className="w-[1.5px] h-full bg-rose-300/30" />
              </div>
            </div>
            <div className="w-20 sm:w-28 h-3 rounded-md bg-slate-900/95 border-t border-rose-400/20 shadow-md" />
            <div className="w-20 sm:w-28 flex justify-between px-1">
              <div className="w-1.5 h-12 bg-slate-950" />
              <div className="w-1.5 h-12 bg-slate-950" />
            </div>
          </div>

          {/* PHONE RESTING ON TABLE (Waiting for her call/message) */}
          <div className="absolute bottom-8 left-[38%] sm:left-[35%] w-10 sm:w-12 h-16 sm:h-20 rounded-lg bg-zinc-950 border border-slate-700/60 shadow-[0_4px_12px_rgba(0,0,0,0.8)] flex items-center justify-center -rotate-6">
            <div
              className="w-8 sm:w-10 h-14 sm:h-18 rounded bg-slate-900/90 flex flex-col items-center justify-center p-1"
              style={{ animation: 'masterPhonePulse 7s ease-in-out infinite' }}
            >
              <span className="text-[7px] text-pink-300 font-mono tracking-tighter opacity-70">
                00:00
              </span>
              <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400/60 mt-1 animate-pulse" />
            </div>
          </div>

          {/* FRAMED MEMORY PHOTOGRAPH ON TABLE (/as.jpg) */}
          <div className="absolute bottom-10 left-[22%] sm:left-[24%] w-14 sm:w-18 h-18 sm:h-22 p-1 rounded bg-zinc-900/90 border border-amber-400/25 shadow-[0_4px_15px_rgba(0,0,0,0.9)] rotate-3 flex items-center justify-center overflow-hidden">
            <img
              src="/as.jpg"
              alt="Memory"
              className="w-full h-full object-cover rounded-xs opacity-80 filter contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-rose-500/15 pointer-events-none" />
          </div>

          {/* DELICATE GLASS VASE WITH A ROSE & HIGHLIGHTS */}
          <div className="absolute bottom-10 right-[35%] sm:right-[38%] flex flex-col items-center opacity-90 rotate-[-4deg]">
            <span className="text-sm sm:text-base drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">
              🥀
            </span>
            <div className="w-3 sm:w-4 h-8 sm:h-10 rounded-full bg-slate-800/40 border border-white/20 backdrop-blur-xs shadow-sm" />
          </div>
        </div>

        {/* 8. CINEMATIC BUTTERFLIES (Ambient + Climax Composition) */}
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

        {/* 9. FALLING FLOWER PETALS (Climax) */}
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

              {/* Memory Flash In Background */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 0.28, scale: 1.05 }}
                transition={{ duration: 2.5 }}
                className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
              >
                <img
                  src="/as.jpg"
                  alt="Echo"
                  className="w-72 sm:w-96 h-72 sm:h-96 object-cover rounded-full filter blur-xl opacity-30 mix-blend-screen"
                />
              </motion.div>

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
