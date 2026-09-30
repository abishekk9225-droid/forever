import React from 'react';
import { createPortal } from 'react-dom';

// Pre-computed bokeh orbs with diverse sizes and romantic colors
const BOKEH_ORBS = [
  { id: 1, top: '15%', left: '12%', size: 90, color: 'bg-amber-300/20', blur: 'blur-2xl', duration: 11, delay: 0 },
  { id: 2, top: '25%', left: '78%', size: 120, color: 'bg-rose-400/25', blur: 'blur-3xl', duration: 13, delay: 1.5 },
  { id: 3, top: '65%', left: '18%', size: 110, color: 'bg-pink-500/20', blur: 'blur-3xl', duration: 12, delay: 2.2 },
  { id: 4, top: '75%', left: '72%', size: 100, color: 'bg-amber-400/20', blur: 'blur-2xl', duration: 14, delay: 0.8 },
  { id: 5, top: '40%', left: '8%', size: 70, color: 'bg-purple-400/20', blur: 'blur-xl', duration: 10, delay: 3 },
  { id: 6, top: '50%', left: '88%', size: 85, color: 'bg-rose-300/20', blur: 'blur-2xl', duration: 15, delay: 1.2 },
  { id: 7, top: '8%', left: '48%', size: 95, color: 'bg-yellow-200/20', blur: 'blur-2xl', duration: 12, delay: 2.5 },
];

// Pre-computed floating micro light particles (22 particles)
const PARTICLES = Array.from({ length: 22 }).map((_, i) => ({
  id: i,
  left: (i * 13.7) % 94 + 3,
  top: (i * 17.3) % 90 + 5,
  size: 2 + (i % 3) * 1.5,
  duration: 7 + (i % 5) * 2,
  delay: (i * 0.5) % 4,
  isGold: i % 2 === 0,
}));

export default function CinematicSecretGiftBackground() {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      aria-hidden="true"
      className="fixed inset-0 w-screen h-screen z-20 pointer-events-none overflow-hidden select-none"
    >
      {/* INLINE ANIMATIONS FOR SMOOTH, LUXURIOUS LIGHTING DYNAMICS */}
      <style>{`
        @keyframes slowPhotoBreathe {
          0%, 100% { transform: scale(1.02); }
          50% { transform: scale(1.045); }
        }
        @keyframes goldenRayShimmer {
          0%, 100% { opacity: 0.38; transform: rotate(-14deg) scale(1); }
          50% { opacity: 0.65; transform: rotate(-11deg) scale(1.06); }
        }
        @keyframes lightLeakDrift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.35; }
          50% { transform: translate(25px, -18px) scale(1.1); opacity: 0.6; }
        }
        @keyframes pinkMagentaPulse {
          0%, 100% { opacity: 0.42; transform: scale(1); }
          50% { opacity: 0.72; transform: scale(1.12); }
        }
        @keyframes purpleShift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.32; }
          50% { transform: translate(30px, -25px) scale(1.08); opacity: 0.55; }
        }
        @keyframes bokehFloat {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(18px, -24px); }
        }
        @keyframes gentleParticleFloat {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          25% { opacity: 0.85; }
          75% { opacity: 0.75; }
          100% { transform: translateY(-70px) scale(1.1); opacity: 0; }
        }
        @keyframes lensFlareSweep {
          0%, 100% { opacity: 0.3; transform: scaleX(0.95) rotate(-6deg); }
          50% { opacity: 0.6; transform: scaleX(1.1) rotate(-4deg); }
        }
      `}</style>

      {/* =========================================================================
          LAYER 1: c.jpg (ORIGINAL PHOTO PRESERVED, ZERO DISTORTION, CLEAR SUBJECT)
          ========================================================================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src="/c.jpg"
          alt="Romantic Secret Moment"
          className="w-full h-full object-cover object-[center_28%] transition-transform duration-1000 ease-out"
          style={{
            animation: 'slowPhotoBreathe 18s ease-in-out infinite',
            filter: 'brightness(0.92) contrast(1.08) saturate(1.12)',
          }}
        />
      </div>

      {/* =========================================================================
          LAYER 2: DARK CINEMATIC GRADIENT & VIGNETTE & DREAMY ATMOSPHERIC HAZE
          ========================================================================= */}
      {/* Deep cinematic vignette focusing on subject and card */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(3,1,8,0.22) 20%, rgba(3,1,8,0.65) 68%, #030108 95%)',
        }}
      />
      {/* Vertical cinematic contrast gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030108]/50 via-transparent to-[#030108]/75" />
      {/* Soft atmospheric haze */}
      <div className="absolute inset-0 backdrop-blur-[1.2px] opacity-40" />

      {/* =========================================================================
          LAYER 3: GOLDEN LIGHT RAYS & WARM LIGHT LEAKS
          ========================================================================= */}
      {/* Diagonal Golden Ray from Top-Left */}
      <div
        className="absolute -top-32 -left-32 w-[900px] h-[600px] bg-gradient-to-br from-amber-400/35 via-yellow-500/15 to-transparent blur-3xl"
        style={{
          animation: 'goldenRayShimmer 12s ease-in-out infinite',
        }}
      />
      {/* Warm Golden Light Leak from Top-Right Corner */}
      <div
        className="absolute -top-20 -right-20 w-[650px] h-[550px] bg-gradient-to-bl from-amber-300/30 via-orange-500/15 to-transparent blur-3xl"
        style={{
          animation: 'lightLeakDrift 14s ease-in-out infinite',
        }}
      />

      {/* =========================================================================
          LAYER 4: BRIGHT ROSE / PINK GLOW & MAGENTA AMBIENT LIGHTING
          ========================================================================= */}
      {/* Center-Right Romantic Rose Bloom */}
      <div
        className="absolute top-1/3 right-1/4 w-[700px] h-[700px] bg-gradient-to-tr from-rose-600/25 via-pink-500/20 to-transparent rounded-full blur-[140px]"
        style={{
          animation: 'pinkMagentaPulse 9s ease-in-out infinite',
        }}
      />
      {/* Soft Center Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-rose-500/15 rounded-full blur-[120px]"
        style={{
          animation: 'pinkMagentaPulse 11s ease-in-out infinite',
          animationDelay: '1.5s',
        }}
      />

      {/* =========================================================================
          LAYER 5: PURPLE / VIOLET AMBIENT GLOW
          ========================================================================= */}
      {/* Deep Violet Glow Bottom-Left */}
      <div
        className="absolute -bottom-24 -left-20 w-[600px] h-[600px] bg-purple-700/22 rounded-full blur-[150px]"
        style={{
          animation: 'purpleShift 13s ease-in-out infinite',
        }}
      />
      {/* Subtle Purple Hue Top-Center */}
      <div
        className="absolute top-0 left-1/3 w-[500px] h-[400px] bg-violet-600/15 rounded-full blur-[130px]"
        style={{
          animation: 'purpleShift 15s ease-in-out infinite',
          animationDelay: '2s',
        }}
      />

      {/* =========================================================================
          LAYER 6: GLOWING BOKEH, FLOATING LIGHT PARTICLES & CINEMATIC LENS FLARE
          ========================================================================= */}
      {/* Glowing Bokeh Orbs */}
      {BOKEH_ORBS.map((b) => (
        <div
          key={`bokeh-${b.id}`}
          className={`absolute rounded-full ${b.color} ${b.blur}`}
          style={{
            top: b.top,
            left: b.left,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animation: `bokehFloat ${b.duration}s ease-in-out infinite`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}

      {/* Cinematic Horizontal Anamorphic Lens Flare */}
      <div
        className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[580px] h-[2px] bg-gradient-to-r from-transparent via-amber-200/50 to-transparent blur-[1px]"
        style={{
          animation: 'lensFlareSweep 10s ease-in-out infinite',
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-r from-amber-300/30 via-pink-400/20 to-transparent blur-md" />
      </div>

      {/* Floating Micro Light Dust Particles */}
      {PARTICLES.map((p) => (
        <div
          key={`particle-${p.id}`}
          className={`absolute rounded-full blur-[0.6px] ${
            p.isGold ? 'bg-amber-200/70 shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'bg-rose-200/70 shadow-[0_0_8px_rgba(244,114,182,0.6)]'
          }`}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `gentleParticleFloat ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>,
    document.body
  );
}
