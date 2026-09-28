import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import CinematicRainbowBorder from './CinematicRainbowBorder';

// ==========================================
// REALISTIC CANVAS RAIN & WET GLASS SIMULATOR
// ==========================================
function RainyWindowCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Static droplets on the glass (droplets that sit and refract light)
    const staticDrops = Array.from({ length: 65 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.8 + 1.2,
      opacity: Math.random() * 0.45 + 0.35,
      aspect: Math.random() * 0.3 + 0.85,
    }));

    // Sliding rain trails trickling down the glass
    const slidingDrops = Array.from({ length: 14 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: Math.random() * 1.8 + 0.8,
      r: Math.random() * 2.2 + 1.5,
      trail: [],
    }));

    // Distant background falling rain
    const backgroundRain = Array.from({ length: 90 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      len: Math.random() * 18 + 10,
      speed: Math.random() * 7 + 9,
      opacity: Math.random() * 0.18 + 0.08,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw distant rain streaks outside
      ctx.lineWidth = 1;
      for (let i = 0; i < backgroundRain.length; i++) {
        const drop = backgroundRain[i];
        ctx.strokeStyle = `rgba(186, 215, 255, ${drop.opacity})`;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 2, drop.y + drop.len);
        ctx.stroke();

        drop.y += drop.speed;
        drop.x -= 0.5;
        if (drop.y > height) {
          drop.y = -20;
          drop.x = Math.random() * width;
        }
      }

      // 2. Draw static raindrops on the glass pane
      for (let i = 0; i < staticDrops.length; i++) {
        const d = staticDrops[i];
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.scale(1, d.aspect);

        // Soft droplet glow
        const radGrad = ctx.createRadialGradient(-0.5, -0.5, 0.2, 0, 0, d.r);
        radGrad.addColorStop(0, `rgba(255, 255, 255, ${d.opacity * 0.95})`);
        radGrad.addColorStop(0.5, `rgba(244, 114, 182, ${d.opacity * 0.45})`);
        radGrad.addColorStop(1, 'rgba(15, 23, 42, 0.4)');

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(0, 0, d.r, 0, Math.PI * 2);
        ctx.fill();

        // Droplet top reflection highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.arc(-d.r * 0.28, -d.r * 0.28, d.r * 0.24, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 3. Draw sliding trickles down the pane
      for (let i = 0; i < slidingDrops.length; i++) {
        const s = slidingDrops[i];

        // Draw faint condensation trail
        if (s.trail.length > 1) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = s.r * 0.9;
          ctx.beginPath();
          ctx.moveTo(s.trail[0].x, s.trail[0].y);
          for (let ti = 1; ti < s.trail.length; ti++) {
            ctx.lineTo(s.trail[ti].x, s.trail[ti].y);
          }
          ctx.stroke();
        }

        // Draw the moving droplet head
        ctx.save();
        ctx.translate(s.x, s.y);
        const trickleGrad = ctx.createRadialGradient(-0.4, -0.4, 0.2, 0, 0, s.r);
        trickleGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        trickleGrad.addColorStop(0.7, 'rgba(236, 72, 153, 0.4)');
        trickleGrad.addColorStop(1, 'rgba(15, 23, 42, 0.3)');

        ctx.fillStyle = trickleGrad;
        ctx.beginPath();
        ctx.arc(0, 0, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 22) {
          s.trail.shift();
        }

        s.y += s.speed;
        s.x += (Math.random() - 0.5) * 0.4;

        if (s.y > height + 20) {
          s.y = -10;
          s.x = Math.random() * width;
          s.trail = [];
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[12] opacity-80" />;
}

// ==========================================
// REALISTIC GLOWING BUTTERFLY COMPONENT
// ==========================================
function ClimaxButterfly() {
  return (
    <div
      className="absolute pointer-events-none z-[45]"
      style={{
        animation: 'butterflyClimaxFlight 11s cubic-bezier(0.25, 1, 0.5, 1) forwards',
      }}
    >
      <div className="relative">
        <svg
          width="32"
          height="28"
          viewBox="0 0 34 28"
          className="overflow-visible drop-shadow-[0_0_14px_rgba(244,114,182,0.95)]"
        >
          <defs>
            <linearGradient id="climaxButterflyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#f472b6" />
              <stop offset="70%" stopColor="#c084fc" />
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
              fill="url(#climaxButterflyGrad)"
              opacity="0.95"
            />
            <path
              d="M 16,15 C 9,18 4,24 6,26 C 9,28 14,24 16,17 Z"
              fill="url(#climaxButterflyGrad)"
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
              fill="url(#climaxButterflyGrad)"
              opacity="0.95"
            />
            <path
              d="M 18,15 C 25,18 30,24 28,26 C 25,28 20,24 18,17 Z"
              fill="url(#climaxButterflyGrad)"
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
        <span className="absolute -bottom-1 -left-1 text-[9px] text-amber-200 opacity-80 animate-ping">
          ✨
        </span>
      </div>
    </div>
  );
}

// ==========================================
// MAIN STILL WAITING CINEMATIC SCENE
// ==========================================
export default function StillWaitingCinematicScene({ onComplete }) {
  const { playKkTrack, stopKkTrack, stopKaTrack } = useSound();

  // Phase Progression:
  // 0: Darkness / Initial room fade-in
  // 1: Line 1 ("சில உணர்வுகள்...")
  // 2: Line 2 ("சில நிமிடங்கள்...")
  // 3: Line 3 ("நான் கேட்பது ஒரு பதில் மட்டும் அல்ல...")
  // 4: Line 4 ("உன் மனதில் உண்மையாக என்ன இருக்கிறது...")
  // 5: Final Message & "சம்மதம் ❤️" Button
  const [phase, setPhase] = useState(0);

  // Emotional reaction state triggered on clicking "சம்மதம் ❤️"
  const [isEmotionalClimax, setIsEmotionalClimax] = useState(false);
  const [climaxStep, setClimaxStep] = useState(0); // 0: clicking, 1: holding back tears / words, 2: "நன்றி...", 3: complete

  const kkTimerRef = useRef(null);
  const hasStartedKkRef = useRef(false);
  const isMountedRef = useRef(true);
  const timersRef = useRef([]);

  // 1. Initial Scene Setup & 5.0-Second Exact Delay for /kk.mp3
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
      } else {
        const audio = new Audio('/kk.mp3');
        audio.preload = 'auto';
        audio.volume = 0.55;
        audio.play().catch(() => {});
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
    // Phase 3 at 18.5s (Line 3)
    const t3 = setTimeout(() => setPhase(3), 18500);
    // Phase 4 at 24.5s (Line 4)
    const t4 = setTimeout(() => setPhase(4), 24500);
    // Phase 5 at 31.0s (Final Emotional Message & "சம்மதம் ❤️" Button)
    const t5 = setTimeout(() => {
      setPhase(5);
      if (window.heartbeatEngine) {
        window.heartbeatEngine.setTargetBPM(64, 0.22);
      }
    }, 31000);

    timersRef.current.push(t1, t2, t3, t4, t5);

    return () => {
      isMountedRef.current = false;
      if (kkTimerRef.current) {
        clearTimeout(kkTimerRef.current);
        kkTimerRef.current = null;
      }
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };
  }, [playKkTrack, stopKkTrack, stopKaTrack]);

  // 2. Handle "சம்மதம் ❤️" Button Click: Cinematic Emotional Reaction
  const handleSammathamClick = () => {
    if (isEmotionalClimax) return;
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

  return (
    <div className="fixed inset-0 w-full h-full bg-[#030206] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden select-none z-[125] animate-in fade-in duration-1000">
      {/* SCREEN-LEVEL CONTINUOUS TRAVELLING RAINBOW BORDER */}
      <CinematicRainbowBorder mode="screen" />

      {/* INLINE CSS FOR MOVIE SCENE CAMERA, WEEPING HIGHLIGHTS, BOKEH & BUTTERFLY */}
      <style>{`
        /* Slow Cinematic Camera Push Towards Rainy Window */
        @keyframes cameraSlowPush {
          0% { transform: scale(1.0) translateY(0px); }
          50% { transform: scale(1.045) translateY(-6px); }
          100% { transform: scale(1.08) translateY(-12px); }
        }

        /* Warm Table Lamp Breathing Ambient Glow */
        @keyframes lampWarmBreathe {
          0%, 100% { opacity: 0.65; transform: scale(1); filter: drop-shadow(0 0 35px rgba(251,191,36,0.35)); }
          50% { opacity: 0.85; transform: scale(1.05); filter: drop-shadow(0 0 55px rgba(245,158,11,0.5)); }
        }

        /* Distant City Lights Bokeh Drifting */
        @keyframes bokehDrift1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); opacity: 0.35; }
          50% { transform: translate(12px, -15px) scale(1.15); opacity: 0.55; }
        }
        @keyframes bokehDrift2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); opacity: 0.3; }
          50% { transform: translate(-15px, 12px) scale(0.9); opacity: 0.5; }
        }

        /* Periodic Passing Car Headlights Ambient Sweep Outside Glass */
        @keyframes passingCarSweep {
          0%, 82% { opacity: 0; transform: translateX(-120%) skewX(-20deg); }
          86% { opacity: 0.18; }
          90% { opacity: 0.22; }
          94% { opacity: 0; transform: translateX(140%) skewX(-20deg); }
          100% { opacity: 0; }
        }

        /* Phone Screen Soft Periodic Notification Pulse */
        @keyframes phonePulse {
          0%, 85%, 100% { opacity: 0.25; box-shadow: 0 0 6px rgba(244,114,182,0.3); }
          92% { opacity: 0.85; box-shadow: 0 0 18px rgba(244,114,182,0.7); }
        }

        /* Realistic Climax Butterfly Flight: Lower area -> Near empty chair -> Window -> Night */
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

        /* Wing Flapping */
        @keyframes wingFlapLeft {
          0%, 100% { transform: scaleX(1) rotate(0deg); }
          50% { transform: scaleX(0.18) rotate(16deg); }
        }
        @keyframes wingFlapRight {
          0%, 100% { transform: scaleX(1) rotate(0deg); }
          50% { transform: scaleX(0.18) rotate(-16deg); }
        }

        /* Tear-like subtle light tremor / emotional glistening */
        @keyframes tearLightGlisten {
          0%, 100% { opacity: 0.2; transform: scale(0.98); }
          50% { opacity: 0.45; transform: scale(1.02); filter: drop-shadow(0 0 15px rgba(244,114,182,0.6)); }
        }
      `}</style>

      {/* SVG NOISE FILTER FOR FILM GRAIN */}
      <svg className="hidden">
        <filter id="cinematic-film-grain-scene">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        className="absolute inset-0 pointer-events-none z-30 opacity-[0.035] mix-blend-overlay"
        style={{ filter: 'url(#cinematic-film-grain-scene)' }}
      />

      {/* CINEMATIC LETTERBOX SHADOW & VIGNETTE */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 38%, rgba(2, 1, 5, 0.65) 75%, rgba(2, 1, 5, 0.98) 100%)',
        }}
      />

      {/* ====================================================
          REALISTIC MOVIE ENVIRONMENT CONTAINER (Slow Camera Push)
      ==================================================== */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ animation: 'cameraSlowPush 45s ease-in-out infinite alternate' }}
      >
        {/* 1. OUTSIDE RAINY NIGHT BACKDROP (Deep navy, purple, cool blue) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(175deg, #02040b 0%, #060916 35%, #0b071a 70%, #15091a 100%)',
          }}
        />

        {/* 2. DISTANT CITY LIGHT BOKEH (Pink, purple, gold blurred circles outside window) */}
        <div
          className="absolute top-[18%] left-[22%] w-32 h-32 rounded-full bg-pink-500/15 blur-2xl pointer-events-none"
          style={{ animation: 'bokehDrift1 12s ease-in-out infinite' }}
        />
        <div
          className="absolute top-[32%] left-[48%] w-40 h-40 rounded-full bg-purple-600/15 blur-3xl pointer-events-none"
          style={{ animation: 'bokehDrift2 15s ease-in-out infinite' }}
        />
        <div
          className="absolute top-[24%] right-[25%] w-36 h-36 rounded-full bg-amber-400/15 blur-2xl pointer-events-none"
          style={{ animation: 'bokehDrift1 14s ease-in-out infinite reverse' }}
        />
        <div
          className="absolute top-[40%] right-[15%] w-28 h-28 rounded-full bg-blue-500/15 blur-2xl pointer-events-none"
          style={{ animation: 'bokehDrift2 11s ease-in-out infinite' }}
        />

        {/* 3. OCCASIONAL PASSING CAR HEADLIGHTS SWEEP ACROSS WINDOW */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/10 to-transparent pointer-events-none"
          style={{ animation: 'passingCarSweep 16s ease-in-out infinite' }}
        />

        {/* 4. REALISTIC RAIN CANVAS ON WINDOW GLASS */}
        <RainyWindowCanvas />

        {/* 5. WINDOW FRAME DIVIDER SILHOUETTE */}
        <div className="absolute inset-0 pointer-events-none z-[13]">
          {/* Subtle vertical window mullion */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[3px] bg-slate-900/60 shadow-[0_0_12px_rgba(0,0,0,0.8)]" />
          {/* Subtle horizontal window transom */}
          <div className="absolute left-0 right-0 top-[28%] h-[3px] bg-slate-900/60 shadow-[0_0_12px_rgba(0,0,0,0.8)]" />
        </div>

        {/* 6. ROOM INTERIOR FOREGROUND (Warm wooden table, lamp, empty chair, memory photos) */}
        <div className="absolute inset-x-0 bottom-0 h-[48%] sm:h-[45%] pointer-events-none z-[14]">
          {/* Wooden Table Surface with Warm Ambient Glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(14, 7, 10, 0.96) 0%, rgba(22, 11, 15, 0.85) 60%, rgba(10, 5, 8, 0.4) 100%)',
              borderTop: '1px solid rgba(244, 114, 182, 0.12)',
            }}
          />

          {/* Warm Table Lamp (Left Corner) casting amber/rose illumination */}
          <div className="absolute bottom-4 left-4 sm:left-12 flex flex-col items-center">
            {/* Lamp Ambient Volumetric Light Cone */}
            <div
              className="absolute -top-32 -left-16 w-64 h-64 rounded-full pointer-events-none blur-3xl"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(251, 191, 36, 0.28) 0%, rgba(244, 63, 94, 0.15) 50%, transparent 80%)',
                animation: 'lampWarmBreathe 6s ease-in-out infinite',
              }}
            />
            {/* Lamp Shade & Stand Minimal Silhouette */}
            <div className="w-10 sm:w-14 h-8 sm:h-10 bg-gradient-to-b from-amber-200/40 via-amber-400/25 to-rose-500/20 rounded-t-lg border-b border-amber-300/40 shadow-[0_0_20px_rgba(251,191,36,0.4)]" />
            <div className="w-1.5 h-16 sm:h-20 bg-gradient-to-b from-amber-600/50 to-slate-800/80" />
            <div className="w-8 sm:w-12 h-2 rounded-full bg-slate-800/90 border-t border-amber-500/30" />
          </div>

          {/* ONE EMPTY CHAIR OPPOSITE (Right side of room, subtle rim lighting) */}
          <div className="absolute bottom-6 right-6 sm:right-16 flex flex-col items-center opacity-70">
            {/* Chair Backrest Silhouette with Rose Rim Light */}
            <div className="relative w-16 sm:w-22 h-24 sm:h-32 rounded-t-2xl border-t-2 border-x-2 border-rose-400/30 bg-gradient-to-b from-slate-900/85 via-zinc-950/90 to-transparent shadow-[inset_0_2px_8px_rgba(244,114,182,0.2)]">
              {/* Chair Back Slats */}
              <div className="absolute inset-x-2 top-4 bottom-2 flex justify-around opacity-40">
                <div className="w-[1.5px] h-full bg-rose-300/30" />
                <div className="w-[1.5px] h-full bg-rose-300/30" />
                <div className="w-[1.5px] h-full bg-rose-300/30" />
              </div>
            </div>
            {/* Chair Seat */}
            <div className="w-20 sm:w-28 h-3 rounded-md bg-slate-900/95 border-t border-rose-400/20 shadow-md" />
            {/* Chair Legs in Shadow */}
            <div className="w-20 sm:w-28 flex justify-between px-1">
              <div className="w-1.5 h-12 bg-slate-950" />
              <div className="w-1.5 h-12 bg-slate-950" />
            </div>
          </div>

          {/* A PHONE RESTING SILENTLY ON THE TABLE (Waiting for her call/message) */}
          <div className="absolute bottom-8 left-[38%] sm:left-[35%] w-10 sm:w-12 h-16 sm:h-20 rounded-lg bg-zinc-950 border border-slate-700/60 shadow-[0_4px_12px_rgba(0,0,0,0.8)] flex items-center justify-center -rotate-6">
            <div
              className="w-8 sm:w-10 h-14 sm:h-18 rounded bg-slate-900/90 flex flex-col items-center justify-center p-1"
              style={{ animation: 'phonePulse 7s ease-in-out infinite' }}
            >
              <span className="text-[7px] text-pink-300 font-mono tracking-tighter opacity-70">
                00:00
              </span>
              <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400/60 mt-1 animate-pulse" />
            </div>
          </div>

          {/* SUBTLE FRAMED MEMORY PHOTOGRAPH ON TABLE (/as.jpg & /sa.jpg) */}
          <div className="absolute bottom-10 left-[22%] sm:left-[24%] w-14 sm:w-18 h-18 sm:h-22 p-1 rounded bg-zinc-900/90 border border-amber-400/25 shadow-[0_4px_15px_rgba(0,0,0,0.9)] rotate-3 flex items-center justify-center overflow-hidden">
            <img
              src="/as.jpg"
              alt="Memory"
              className="w-full h-full object-cover rounded-xs opacity-75 filter contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-rose-500/15 pointer-events-none" />
          </div>

          {/* A DELICATE GLASS VASE WITH A SINGLE ROSE */}
          <div className="absolute bottom-10 right-[35%] sm:right-[38%] flex flex-col items-center opacity-85 rotate-[-4deg]">
            <span className="text-sm sm:text-base drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">
              🥀
            </span>
            <div className="w-3 sm:w-4 h-8 sm:h-10 rounded-full bg-slate-800/40 border border-white/20 backdrop-blur-xs shadow-sm" />
          </div>
        </div>

        {/* 7. CINEMATIC BUTTERFLY MOMENT NEAR CLIMAX */}
        {isEmotionalClimax && <ClimaxButterfly />}
      </div>

      {/* ====================================================
          EMOTIONAL SUBTITLE TEXT & BUTTON LAYER (Centered)
      ==================================================== */}
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSammathamClick}
                className="px-8 sm:px-12 py-3.5 sm:py-4 rounded-full font-serif text-base sm:text-lg md:text-xl font-medium text-white tracking-wider cursor-pointer shadow-[0_0_35px_rgba(244,63,94,0.45)] border border-amber-300/40 backdrop-blur-xl transition-all duration-300 flex items-center justify-center gap-2.5"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(244,63,94,0.75) 0%, rgba(236,72,153,0.65) 50%, rgba(168,85,247,0.55) 100%)',
                }}
              >
                <span>சம்மதம் ❤️</span>
                <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
              </motion.button>
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
