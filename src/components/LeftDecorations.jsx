import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function LeftDecorations({ celebrating = false, scene = 'scene1_mystery' }) {
  const birdControls = useAnimation();
  const wingControls = useAnimation();
  const tailControls = useAnimation();
  const eyeControls = useAnimation();

  useEffect(() => {
    try {
      if (celebrating || scene === 'scene11_yes') {
        // Fly away across the screen
        birdControls.start({
          x: [0, 100, 300, 600],
          y: [0, -50, -180, -250],
          scale: [1, 1.1, 0.8, 0.4],
          rotate: [0, -10, 15, 10],
          opacity: [1, 1, 0.8, 0],
          transition: { duration: 3.5, ease: 'easeInOut' }
        });
        wingControls.start({
          rotate: [0, -35, 35, -35, 0],
          transition: { repeat: Infinity, duration: 0.25 }
        });
      } else {
        // Idle cycles
        birdControls.start({
          y: [0, -1.5, 0],
          transition: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }
        });
        wingControls.start({
          rotate: [0, -5, 0],
          transition: { repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }
        });
        tailControls.start({
          rotate: [0, 8, -8, 0],
          transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.5 }
        });

        const blink = () => {
          eyeControls.start({
            scaleY: [1, 0.1, 1],
            transition: { duration: 0.25 }
          });
          setTimeout(blink, 4000 + Math.random() * 2000);
        };
        const blinkTimeout = setTimeout(blink, 2000);
        return () => clearTimeout(blinkTimeout);
      }
    } catch (e) {
      console.warn("Left bird animation error", e);
    }
  }, [celebrating, scene, birdControls, wingControls, tailControls, eyeControls]);

  // Determine branch and bird visibility based on scene progression
  let branchOpacity = 1.0;
  let branchScale = 1.0;
  let birdOpacity = 1.0;

  if (scene === 'scene1_mystery') {
    branchOpacity = 0.15; // faint silhouette
    branchScale = 0.75;
    birdOpacity = 0.0; // Hidden first screen
  } else if (scene === 'scene2_check') {
    branchOpacity = 0.4; // Slightly visible
    branchScale = 0.85;
    birdOpacity = 0.0; // still sleeping
  } else if (scene === 'scene3_call') {
    branchOpacity = 0.75; // branch begins appearing
    branchScale = 0.95;
    birdOpacity = 1.0; // bird appears
  } else if (scene === 'scene9_suspense') {
    branchOpacity = 0.15; // fades back to silhouette
    branchScale = 0.85;
    birdOpacity = 0.0; // bird hides
  } else if (scene === 'scene10_proposal') {
    branchOpacity = 0.0; // complete darkness
    branchScale = 0.85;
    birdOpacity = 0.0;
  } else if (scene === 'let_me_think') {
    branchOpacity = 0.2; // dimmed
    branchScale = 0.9;
    birdOpacity = 0.3; // quiet drooping bird
  }

  return (
    <div 
      className="fixed -left-4 md:left-0 top-1/4 z-20 pointer-events-none select-none max-w-[80px] md:max-w-[200px] w-full h-[300px] transition-all duration-[2000ms]"
      style={{ opacity: branchOpacity, transform: `scale(${branchScale})`, transformOrigin: 'left center' }}
    >
      <svg
        viewBox="0 0 200 300"
        className="w-full h-full filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
      >
        {/* Flowering Branch */}
        <motion.path
          d="M0,150 Q60,140 100,180 T180,190"
          fill="none"
          stroke="#4b3525"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        
        {/* Sub branches */}
        <path d="M70,160 Q90,140 110,145" fill="none" stroke="#4b3525" strokeWidth="4" strokeLinecap="round" />
        <path d="M110,183 Q130,195 150,190" fill="none" stroke="#4b3525" strokeWidth="3" strokeLinecap="round" />

        {/* Pink Blossoms */}
        <g id="blossoms" className="transition-all duration-1000">
          <circle cx="85" cy="150" r="8" fill="#d64577" />
          <circle cx="80" cy="144" r="6" fill="#f285a8" />
          <circle cx="90" cy="144" r="6" fill="#f285a8" />
          <circle cx="80" cy="156" r="6" fill="#f285a8" />
          <circle cx="90" cy="156" r="6" fill="#f285a8" />
          <circle cx="85" cy="150" r="3" fill="#ffd43f" />

          <circle cx="125" cy="190" r="7" fill="#d64577" />
          <circle cx="120" cy="185" r="5" fill="#f285a8" />
          <circle cx="130" cy="185" r="5" fill="#f285a8" />
          <circle cx="120" cy="195" r="5" fill="#f285a8" />
          <circle cx="130" cy="195" r="5" fill="#f285a8" />
          <circle cx="125" cy="190" r="2.5" fill="#ffd43f" />

          <circle cx="100" cy="142" r="5" fill="#d64577" />
          <circle cx="150" cy="190" r="4" fill="#d64577" />
        </g>

        {/* Animated Bird */}
        <motion.g
          animate={birdControls}
          style={{ originX: '100px', originY: '180px', opacity: birdOpacity }}
          className="transition-opacity duration-1000"
        >
          <g transform="translate(85, 125)">
            {/* Tail */}
            <motion.g animate={tailControls} style={{ originX: '5px', originY: '35px' }}>
              <path d="M0,32 L-15,48 L-5,50 L5,35 Z" fill="#3b5998" />
              <path d="M5,32 L-5,52 L2,54 L10,35 Z" fill="#4d77cb" />
            </motion.g>

            {/* Body */}
            <ellipse cx="20" cy="20" rx="22" ry="16" fill="#4d77cb" />
            <ellipse cx="28" cy="22" rx="14" ry="12" fill="#e1f5fe" />

            {/* Head */}
            <circle cx="34" cy="3" r="14" fill="#3b5998" />
            <polygon points="46,-2 56,2 46,6" fill="#ffd43f" />

            {/* Wing */}
            <motion.g animate={wingControls} style={{ originX: '12px', originY: '18px' }}>
              <path d="M6,16 C6,16 1,28 12,32 C23,36 22,22 22,22 Z" fill="#2a3f70" />
            </motion.g>

            {/* Eye */}
            <motion.circle
              cx="38"
              cy="-2"
              r="2.5"
              fill="#ffffff"
              animate={eyeControls}
              style={{ originX: '38px', originY: '-2px' }}
            />
            <circle cx="39" cy="-3" r="0.8" fill="#000000" />
          </g>
        </motion.g>
      </svg>
    </div>
  );
}
