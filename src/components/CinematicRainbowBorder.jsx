import React, { useId } from 'react';

/**
 * Reusable Cinematic Rainbow Border Effect
 * Continuous color flow: PINK -> MAGENTA -> PURPLE -> BLUE -> CYAN -> VIOLET -> GOLD -> PINK
 * Light continuously travels: TOP -> RIGHT -> BOTTOM -> LEFT -> TOP
 * 
 * Props:
 * - mode: 'screen' (fullscreen perimeter) | 'card' (container wrapper or border overlay)
 * - className: additional Tailwind classes
 * - borderRadius: custom radius number in px or string e.g. 24, 32, 40
 */
export default function CinematicRainbowBorder({
  mode = 'screen',
  className = '',
  borderRadius = 32,
  children,
}) {
  const uid = useId().replace(/:/g, '_');
  const cardGradId = `cardRainbowGrad_${uid}`;
  const laserGradId = `cardLaserGrad_${uid}`;
  const bloomId = `cardBloom_${uid}`;

  const rx = typeof borderRadius === 'number' ? borderRadius : parseInt(borderRadius, 10) || 28;

  return (
    <>
      <style>{`
        /* Continuous Travelling Rainbow Keyframes */
        @keyframes rainbowSweepClockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes rainbowDashTravel {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -1000; }
        }

        @keyframes rainbowHaloBreathing {
          0%, 100% {
            box-shadow:
              inset 0 0 25px rgba(244, 63, 94, 0.4),
              0 0 30px rgba(244, 63, 94, 0.45),
              0 0 65px rgba(217, 70, 239, 0.3),
              0 0 95px rgba(168, 85, 247, 0.2);
          }
          33% {
            box-shadow:
              inset 0 0 25px rgba(168, 85, 247, 0.4),
              0 0 30px rgba(168, 85, 247, 0.45),
              0 0 65px rgba(59, 130, 246, 0.3),
              0 0 95px rgba(6, 182, 212, 0.2);
          }
          66% {
            box-shadow:
              inset 0 0 25px rgba(6, 182, 212, 0.4),
              0 0 30px rgba(6, 182, 212, 0.45),
              0 0 65px rgba(245, 158, 11, 0.3),
              0 0 95px rgba(244, 63, 94, 0.2);
          }
        }

        @keyframes cardAuraPulse {
          0%, 100% { filter: drop-shadow(0 0 12px rgba(244, 63, 94, 0.5)); }
          50% { filter: drop-shadow(0 0 22px rgba(217, 70, 239, 0.7)); }
        }
      `}</style>

      {mode === 'screen' ? (
        <div
          className={`fixed inset-0 pointer-events-none z-[88] overflow-hidden select-none ${className}`}
        >
          {/* Outer Screen Halo & Edge Energy Spillage */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ animation: 'rainbowHaloBreathing 7s ease-in-out infinite' }}
          />

          {/* SVG Travelling Laser Rainbow Energy Circuit: TOP -> RIGHT -> BOTTOM -> LEFT -> TOP */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Seamless Full Rainbow Gradient Spectrum */}
              <linearGradient id="globalRainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="14%" stopColor="#d946ef" />
                <stop offset="28%" stopColor="#a855f7" />
                <stop offset="42%" stopColor="#3b82f6" />
                <stop offset="58%" stopColor="#06b6d4" />
                <stop offset="72%" stopColor="#8b5cf6" />
                <stop offset="86%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>

              {/* High-Intensity Laser Head Gradient */}
              <linearGradient id="globalLaserHeadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.8" />
                <stop offset="90%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="100%" stopColor="#fef08a" stopOpacity="1" />
              </linearGradient>

              <filter id="globalRainbowBloom" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="glow1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="glow2" />
                <feMerge>
                  <feMergeNode in="glow2" />
                  <feMergeNode in="glow1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Base Rainbow Stroke (Soft ambient continuous glow) */}
            <rect
              x="3"
              y="3"
              width="994"
              height="994"
              rx="12"
              ry="12"
              fill="none"
              stroke="url(#globalRainbowGrad)"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
              opacity="0.75"
            />

            {/* Bloom Layer */}
            <rect
              x="3"
              y="3"
              width="994"
              height="994"
              rx="12"
              ry="12"
              fill="none"
              stroke="url(#globalRainbowGrad)"
              strokeWidth="5"
              vectorEffect="non-scaling-stroke"
              opacity="0.45"
              filter="url(#globalRainbowBloom)"
            />

            {/* Visibly Travelling High-Energy Light Pulse (TOP -> RIGHT -> BOTTOM -> LEFT -> TOP) */}
            <rect
              x="3"
              y="3"
              width="994"
              height="994"
              rx="12"
              ry="12"
              fill="none"
              pathLength="1000"
              stroke="url(#globalLaserHeadGrad)"
              strokeWidth="4"
              strokeDasharray="220 780"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              filter="url(#globalRainbowBloom)"
              style={{ animation: 'rainbowDashTravel 5s linear infinite' }}
            />
          </svg>

          {/* Corner Ambient Light Nodes */}
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-rose-400 blur-xs animate-ping pointer-events-none" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-400 blur-xs animate-ping pointer-events-none [animation-delay:1.25s]" />
          <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-cyan-400 blur-xs animate-ping pointer-events-none [animation-delay:2.5s]" />
          <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-amber-400 blur-xs animate-ping pointer-events-none [animation-delay:3.75s]" />
        </div>
      ) : (
        /* CARD MODE: Laser rainbow border directly framing the card container */
        <div
          className={`absolute inset-0 pointer-events-none z-20 ${className}`}
          style={{ animation: 'cardAuraPulse 5s ease-in-out infinite' }}
        >
          <svg
            className="w-full h-full pointer-events-none"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <linearGradient id={cardGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="14%" stopColor="#d946ef" />
                <stop offset="28%" stopColor="#a855f7" />
                <stop offset="42%" stopColor="#3b82f6" />
                <stop offset="58%" stopColor="#06b6d4" />
                <stop offset="72%" stopColor="#8b5cf6" />
                <stop offset="86%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>

              <linearGradient id={laserGradId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="45%" stopColor="#f43f5e" stopOpacity="0.8" />
                <stop offset="85%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="100%" stopColor="#fef08a" stopOpacity="1" />
              </linearGradient>

              <filter id={bloomId} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="glow1" />
                <feMerge>
                  <feMergeNode in="glow1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Base Continuous Rainbow Border Stroke */}
            <rect
              x="1.5"
              y="1.5"
              width="calc(100% - 3px)"
              height="calc(100% - 3px)"
              rx={rx}
              ry={rx}
              fill="none"
              stroke={`url(#${cardGradId})`}
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
              opacity="0.8"
            />

            {/* Travelling Laser Head */}
            <rect
              x="1.5"
              y="1.5"
              width="calc(100% - 3px)"
              height="calc(100% - 3px)"
              rx={rx}
              ry={rx}
              fill="none"
              pathLength="1000"
              stroke={`url(#${laserGradId})`}
              strokeWidth="3.5"
              strokeDasharray="220 780"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              filter={`url(#${bloomId})`}
              style={{ animation: 'rainbowDashTravel 4.5s linear infinite' }}
            />
          </svg>
          {children}
        </div>
      )}
    </>
  );
}
