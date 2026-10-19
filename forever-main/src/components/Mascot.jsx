import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function Mascot({ state = 'idle' }) {
  const headControls = useAnimation();
  const leftArmControls = useAnimation();
  const rightArmControls = useAnimation();
  const bodyControls = useAnimation();

  useEffect(() => {
    try {
      if (state === 'idle') {
        headControls.start({ rotate: [0, 2, -2, 0], transition: { repeat: Infinity, duration: 4, ease: 'easeInOut' } });
        bodyControls.start({ scaleY: [1, 1.02, 1], transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' } });
        leftArmControls.start({ rotate: [0, -5, 0], transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' } });
        rightArmControls.start({ rotate: [0, 5, 0], transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' } });
      } else if (state === 'curious') {
        headControls.start({ rotate: 8, y: -2, transition: { duration: 0.5 } });
        bodyControls.start({ scaleY: 1.03, transition: { duration: 0.5 } });
        leftArmControls.start({ rotate: -15, transition: { duration: 0.5 } });
        rightArmControls.start({ rotate: 10, transition: { duration: 0.5 } });
      } else if (state === 'laughing') {
        headControls.start({ y: [0, -3, 0], rotate: [0, 5, -5, 0], transition: { repeat: Infinity, duration: 0.8 } });
        bodyControls.start({ scaleX: [1, 1.05, 0.95, 1], transition: { repeat: Infinity, duration: 0.6 } });
        leftArmControls.start({ rotate: [-10, -40, -10], transition: { repeat: Infinity, duration: 0.8 } });
        rightArmControls.start({ rotate: [10, 40, 10], transition: { repeat: Infinity, duration: 0.8 } });
      } else if (state === 'shy') {
        headControls.start({ rotate: -5, y: 1, transition: { duration: 0.5 } });
        bodyControls.start({ scaleY: 0.98, transition: { duration: 0.5 } });
        leftArmControls.start({ rotate: -45, x: 5, y: -5, transition: { duration: 0.5 } });
        rightArmControls.start({ rotate: 45, x: -5, y: -5, transition: { duration: 0.5 } });
      } else if (state === 'nervous') {
        headControls.start({ x: [0, -1, 1, -1, 0], transition: { repeat: Infinity, duration: 0.15 } });
        bodyControls.start({ x: [0, -0.5, 0.5, 0], scaleY: [1, 0.97, 1], transition: { repeat: Infinity, duration: 0.2 } });
        leftArmControls.start({ rotate: -25, transition: { duration: 0.5 } });
        rightArmControls.start({ rotate: 25, transition: { duration: 0.5 } });
      } else if (state === 'excited') {
        headControls.start({ y: [0, -6, 0], transition: { repeat: Infinity, duration: 0.4 } });
        bodyControls.start({ y: [0, -6, 0], scaleY: [1, 0.9, 1.05, 1], transition: { repeat: Infinity, duration: 0.4 } });
        leftArmControls.start({ rotate: [-40, -90, -40], transition: { repeat: Infinity, duration: 0.4 } });
        rightArmControls.start({ rotate: [40, 90, 40], transition: { repeat: Infinity, duration: 0.4 } });
      } else if (state === 'celebrating') {
        headControls.start({ y: [0, -8, 0], rotate: [0, 8, -8, 0], transition: { repeat: Infinity, duration: 0.5 } });
        bodyControls.start({ y: [0, -8, 0], scaleY: [1, 0.9, 1.05, 1], transition: { repeat: Infinity, duration: 0.5 } });
        leftArmControls.start({ rotate: -105, x: 2, y: -8, transition: { duration: 0.5 } });
        rightArmControls.start({ rotate: 105, x: -2, y: -8, transition: { duration: 0.5 } });
      } else if (state === 'sad') {
        headControls.start({ rotate: -8, y: 4, transition: { duration: 0.7, ease: 'easeOut' } });
        bodyControls.start({ scaleY: 0.96, y: 3, transition: { duration: 0.7 } });
        leftArmControls.start({ rotate: 20, y: 6, transition: { duration: 0.7 } });
        rightArmControls.start({ rotate: -20, y: 6, transition: { duration: 0.7 } });
      }
    } catch (e) {
      // Silently ignore animation errors
    }
  }, [state, headControls, bodyControls, leftArmControls, rightArmControls]);

  return (
    <div className="fixed bottom-4 right-4 z-40 w-24 h-24 pointer-events-none select-none md:w-32 md:h-32">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
        {/* Shadow */}
        <ellipse cx="100" cy="185" rx="50" ry="8" fill="rgba(0,0,0,0.3)" />

        {/* Body */}
        <motion.g animate={bodyControls}>
          <ellipse cx="65" cy="175" rx="18" ry="12" fill="#d4ab83" />
          <ellipse cx="135" cy="175" rx="18" ry="12" fill="#d4ab83" />
          <rect x="55" y="105" width="90" height="70" rx="35" fill="#e8c4a0" />
          <ellipse cx="100" cy="140" rx="30" ry="24" fill="#fcf6ec" />

          {/* Left Arm */}
          <motion.g animate={leftArmControls} style={{ originX: '60px', originY: '115px' }}>
            <rect x="30" y="105" width="30" height="20" rx="10" fill="#d4ab83" />
          </motion.g>

          {/* Right Arm */}
          <motion.g animate={rightArmControls} style={{ originX: '140px', originY: '115px' }}>
            <rect x="140" y="105" width="30" height="20" rx="10" fill="#d4ab83" />
          </motion.g>

          {/* HEAD */}
          <motion.g animate={headControls} style={{ originX: '100px', originY: '105px' }}>
            {/* Ears */}
            <circle cx="55" cy="45" r="22" fill="#d4ab83" />
            <circle cx="55" cy="45" r="12" fill="#f0c2a8" />
            <circle cx="145" cy="45" r="22" fill="#d4ab83" />
            <circle cx="145" cy="45" r="12" fill="#f0c2a8" />
            {/* Head */}
            <circle cx="100" cy="90" r="46" fill="#e8c4a0" />
            {/* Muzzle */}
            <ellipse cx="100" cy="105" rx="18" ry="12" fill="#fcf6ec" />
            {/* Nose */}
            <polygon points="94,98 106,98 100,104" fill="#583f2e" />

            {/* Mouth — state-driven */}
            {state === 'laughing' ? (
              <path d="M95,109 Q100,119 105,109" fill="#900c3f" stroke="#583f2e" strokeWidth="2.5" strokeLinecap="round" />
            ) : state === 'sad' ? (
              <path d="M96,114 Q100,108 104,114" fill="none" stroke="#583f2e" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M96,108 Q100,112 104,108" fill="none" stroke="#583f2e" strokeWidth="2" strokeLinecap="round" />
            )}

            {/* Eyes — state-driven */}
            {(state === 'laughing' || state === 'celebrating') ? (
              <>
                <path d="M72,83 Q80,75 88,83" fill="none" stroke="#483424" strokeWidth="3" strokeLinecap="round" />
                <path d="M112,83 Q120,75 128,83" fill="none" stroke="#483424" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : state === 'shy' ? (
              <>
                <path d="M74,78 Q82,85 86,78" fill="none" stroke="#483424" strokeWidth="3" strokeLinecap="round" />
                <path d="M114,78 Q118,85 126,78" fill="none" stroke="#483424" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : state === 'sad' ? (
              // Sad: drooping inner brow, downward-facing eyes
              <>
                <path d="M72,83 Q80,90 88,83" fill="none" stroke="#483424" strokeWidth="3" strokeLinecap="round" />
                <path d="M112,83 Q120,90 128,83" fill="none" stroke="#483424" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="80" cy="80" r="7" fill="#483424" />
                <circle cx="78" cy="78" r="2" fill="#ffffff" />
                <circle cx="120" cy="80" r="7" fill="#483424" />
                <circle cx="118" cy="78" r="2" fill="#ffffff" />
              </>
            )}

            {/* Blushing cheeks */}
            <motion.circle
              cx="64" cy="98"
              r={state === 'shy' ? 9 : state === 'laughing' ? 7 : 5}
              fill="#ffa4b4"
              opacity={state === 'idle' || state === 'sad' ? 0.2 : 0.85}
            />
            <motion.circle
              cx="136" cy="98"
              r={state === 'shy' ? 9 : state === 'laughing' ? 7 : 5}
              fill="#ffa4b4"
              opacity={state === 'idle' || state === 'sad' ? 0.2 : 0.85}
            />

            {/* Sweat drop (Nervous) */}
            {state === 'nervous' && (
              <motion.path
                d="M136,55 C136,55 140,62 138,66 C136,68 132,68 132,65 C132,62 136,55 136,55 Z"
                fill="#8cd4f4"
                animate={{ y: [0, 8], opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'easeIn' }}
              />
            )}

            {/* Gentle single teardrop (Sad) — not dramatic */}
            {state === 'sad' && (
              <motion.ellipse
                cx="125" cy="92"
                rx="3" ry="4"
                fill="#93c5fd"
                opacity={0.7}
                animate={{ y: [0, 12], opacity: [0.7, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeIn', delay: 0.5 }}
              />
            )}
          </motion.g>

          {/* Banner Sign (Celebrating) */}
          {state === 'celebrating' && (
            <motion.g
              initial={{ scale: 0, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              style={{ originX: '100px', originY: '140px' }}
            >
              <rect x="97" y="110" width="6" height="36" fill="#8b5a2b" rx="2" />
              <rect x="25" y="72" width="150" height="42" rx="8" fill="#ff7da2" stroke="#ffffff" strokeWidth="2" />
              <text x="100" y="98" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="Inter" textAnchor="middle">
                SHE SAID YES! ❤️
              </text>
            </motion.g>
          )}

          {/* Small Floating Heart (Shy) */}
          {state === 'shy' && (
            <motion.path
              d="M100,50 C98,42 88,42 88,50 C88,56 100,66 100,66 C100,66 112,56 112,50 C112,42 102,42 100,50 Z"
              fill="#d64577"
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: [1, 1.15, 1], y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ originX: '100px', originY: '58px' }}
            />
          )}
        </motion.g>
      </svg>
    </div>
  );
}
