import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useScene, SCENES } from '../context/SceneProvider';

const isAccepted = (s) => s === SCENES.QUIZ || s === SCENES.PROMISE_VAULT || s === SCENES.CERTIFICATE || s === SCENES.FINALE;

export default function LeftDecorations() {
  const { currentScene } = useScene();
  const birdControls = useAnimation();
  const wingControls = useAnimation();
  const headControls = useAnimation();
  const eyeControls = useAnimation();
  const tailControls = useAnimation();

  useEffect(() => {
    let blinkInterval;
    let tiltTimeout;

    if (!isAccepted(currentScene)) {
      birdControls.set({ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 });
      wingControls.set({ rotate: 0 });
      headControls.set({ rotate: 0 });
      tailControls.set({ rotate: 0 });
    }

    try {
      if (isAccepted(currentScene)) {
        birdControls.start({
          x: [0, 150, 350, 750],
          y: [0, -60, -180, -220],
          scale: [1, 1.1, 0.75, 0.3],
          rotate: [0, -12, 10, 5],
          opacity: [1, 1, 0.8, 0],
          transition: { duration: 3.8, ease: 'easeInOut', delay: 2.5 }
        });
        wingControls.start({
          rotate: [0, -40, 40, -40, 0],
          transition: { repeat: Infinity, duration: 0.22, ease: 'linear', delay: 2.5 }
        });
      } else {
        // Active loops
        birdControls.start({
          y: [0, -2, 0],
          transition: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }
        });
        wingControls.start({
          rotate: [0, -4, 0],
          transition: { repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 }
        });

        const triggerBlink = () => {
          eyeControls.start({
            scaleY: [1, 0.1, 1],
            transition: { duration: 0.2 }
          });
          blinkInterval = setTimeout(triggerBlink, 3500 + Math.random() * 2500);
        };
        triggerBlink();

        const triggerHeadTilt = () => {
          const deg = (Math.random() - 0.5) * 16;
          headControls.start({
            rotate: deg,
            transition: { duration: 0.4, ease: 'easeInOut' }
          });
          tiltTimeout = setTimeout(triggerHeadTilt, 2000 + Math.random() * 2500);
        };
        triggerHeadTilt();
      }
    } catch (e) {
      console.warn('Left bird animation failure:', e);
    }

    return () => {
      clearTimeout(blinkInterval);
      clearTimeout(tiltTimeout);
    };
  }, [currentScene, birdControls, wingControls, headControls, eyeControls, tailControls]);

  // Determine branch and bird styling parameters dynamically
  let branchOpacity = 1.0;
  let scale = 1.0;
  let birdOpacity = 1.0;

  if (currentScene === SCENES.INTRO || currentScene === SCENES.ASK_DIALOGUE) {
    branchOpacity = 0.25; // faint branch silhouette
    scale = 0.75;
    birdOpacity = 0.25; // visible at low intensity
  } else if (currentScene === SCENES.CONFESSION) {
    branchOpacity = 0.0;
    birdOpacity = 0.0;
  }

  return (
    <div
      className="fixed -left-4 md:left-0 top-1/4 z-20 pointer-events-none select-none max-w-[100px] md:max-w-[210px] w-full h-[320px] transition-all duration-[2000ms]"
      style={{ opacity: branchOpacity, transform: `scale(${scale})`, transformOrigin: 'left center' }}
    >
      <svg
        viewBox="0 0 200 320"
        className="w-full h-full filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.55)]"
      >
        <motion.path
          d="M0,160 Q70,145 110,185 T190,195"
          fill="none"
          stroke="#402e20"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <path d="M75,170 Q95,150 115,155" fill="none" stroke="#402e20" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M120,188 Q140,200 160,195" fill="none" stroke="#402e20" strokeWidth="3" strokeLinecap="round" />

        <g id="blossoms-left">
          <circle cx="90" cy="155" r="7" fill="#d64577" />
          <circle cx="85" cy="150" r="5.5" fill="#f285a8" />
          <circle cx="95" cy="150" r="5.5" fill="#f285a8" />
          <circle cx="90" cy="155" r="2.5" fill="#ffd43f" />

          <circle cx="130" cy="192" r="6" fill="#d64577" />
          <circle cx="125" cy="188" r="4.5" fill="#f285a8" />
          <circle cx="135" cy="188" r="4.5" fill="#f285a8" />
          <circle cx="130" cy="192" r="2" fill="#ffd43f" />
        </g>

        {birdOpacity > 0 && (
          <motion.g
            animate={birdControls}
            style={{ originX: '100px', originY: '185px', opacity: birdOpacity }}
            className="transition-opacity duration-1000"
          >
            <g transform="translate(85, 128)">
              <motion.g animate={tailControls} style={{ originX: '5px', originY: '35px' }}>
                <path d="M0,32 L-18,48 L-8,50 L5,35 Z" fill="#314e8a" />
                <path d="M5,32 L-8,52 L2,54 L10,35 Z" fill="#4d77cb" />
              </motion.g>

              <ellipse cx="20" cy="20" rx="23" ry="17" fill="#4d77cb" />
              <ellipse cx="28" cy="22" rx="14" ry="11" fill="#e1f5fe" />

              <motion.g animate={headControls} style={{ originX: '34px', originY: '3px' }}>
                <circle cx="34" cy="3" r="14.5" fill="#314e8a" />
                <polygon points="46,-2 57,2 46,6" fill="#ffd43f" />
                
                <motion.circle
                  cx="37"
                  cy="-2"
                  r="2.5"
                  fill="#ffffff"
                  animate={eyeControls}
                  style={{ originX: '37px', originY: '-2px' }}
                />
                <circle cx="38" cy="-3" r="0.8" fill="#000000" />
              </motion.g>

              <motion.g animate={wingControls} style={{ originX: '12px', originY: '18px' }}>
                <path d="M6,16 C6,16 1,29 13,33 C25,37 23,22 23,22 Z" fill="#243763" />
              </motion.g>
            </g>
          </motion.g>
        )}
      </svg>
    </div>
  );
}
