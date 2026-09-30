import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BUTTERFLY_COLORS = [
  '#F43F5E', '#EC4899', '#A855F7', '#38BDF8',
  '#34D399', '#FBBF24', '#FB7185', '#E879F9',
  '#FDE047', '#FEF08A', '#CBD5E1', '#F472B6'
];

// Mathematical parametric Heart Curve coordinates for 24 converging butterflies
const HEART_COORDS = Array.from({ length: 24 }).map((_, i) => {
  const t = (i / 24) * Math.PI * 2;
  // 16 * sin^3(t)
  const x = 16 * Math.pow(Math.sin(t), 3);
  // 13*cos(t) - 5*cos(2t) - 2*cos(3t) - cos(4t)
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return { x: x * 8, y: y * 8 }; // Scaled to pixel offset from center
});

export default function ButterflyExplosion() {
  // Phase 1: 0-2s (1 to few butterflies emerging)
  // Phase 2: 2-5s (butterflies circling and converging into heart shape)
  // Phase 3: 5s+ (butterflies disperse outward across the universe)
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(2), 2200);
    const t2 = setTimeout(() => setPhase(3), 5200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden select-none">
      {/* Central Heart Glow when butterflies converge in Phase 2 */}
      <AnimatePresence>
        {phase === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.6, scale: 1.1 }}
            exit={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-tr from-rose-500/30 via-pink-500/25 to-amber-400/25 blur-3xl pointer-events-none"
          />
        )}
      </AnimatePresence>

      {HEART_COORDS.map((coord, i) => {
        const color = BUTTERFLY_COLORS[i % BUTTERFLY_COLORS.length];
        const delay = (i % 6) * 0.25;
        const size = 18 + (i % 5) * 3;

        // Phase 1 Initial random off-screen origin
        const startX = 50 + Math.sin(i) * 35;
        const startY = 85 + Math.cos(i) * 15;

        // Phase 3 Dispersion targets
        const disperseX = (i % 2 === 0 ? -15 : 115) + Math.sin(i * 2) * 20;
        const disperseY = (i % 3 === 0 ? -15 : 115) + Math.cos(i * 2) * 20;

        return (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              x: `${startX}vw`,
              y: `${startY}vh`,
              scale: 0.3,
            }}
            animate={
              phase === 1
                ? {
                    opacity: i < 6 ? [0, 0.9, 0.9] : 0,
                    x: [`${startX}vw`, `${50 + coord.x * 0.4}vw`],
                    y: [`${startY}vh`, `${50 + coord.y * 0.4}vh`],
                    scale: 0.8,
                  }
                : phase === 2
                ? {
                    opacity: 1,
                    // Converge into parametric heart shape at center of screen
                    x: `calc(50vw + ${coord.x}px)`,
                    y: `calc(48vh + ${coord.y}px)`,
                    scale: [0.9, 1.1, 1],
                  }
                : {
                    // Disperse outwards across the edges of the universe
                    opacity: [1, 0.9, 0],
                    x: `${disperseX}vw`,
                    y: `${disperseY}vh`,
                    scale: [1, 1.2, 0.4],
                  }
            }
            transition={{
              duration: phase === 1 ? 2.2 : phase === 2 ? 2.8 : 3.5,
              delay: phase === 1 ? delay : (i % 8) * 0.08,
              ease: phase === 2 ? 'easeInOut' : 'easeOut',
            }}
            className="absolute"
            style={{
              filter: `drop-shadow(0 0 10px ${color})`,
            }}
          >
            {/* Elegant flapping wings SVG */}
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
              <motion.path
                d="M12 12 C8 4, 2 6, 2 12 C2 18, 8 20, 12 14 Z"
                fill={color}
                animate={{ scaleX: [1, 0.15, 1] }}
                transition={{ duration: 0.22 + (i % 3) * 0.04, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '12px 12px' }}
              />
              <motion.path
                d="M12 12 C16 4, 22 6, 22 12 C22 18, 16 20, 12 14 Z"
                fill={color}
                animate={{ scaleX: [1, 0.15, 1] }}
                transition={{ duration: 0.22 + (i % 3) * 0.04, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '12px 12px' }}
              />
              <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}
