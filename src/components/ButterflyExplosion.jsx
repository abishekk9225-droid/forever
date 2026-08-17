import React from 'react';
import { motion } from 'framer-motion';

const BUTTERFLY_COLORS = ['#F43F5E', '#EC4899', '#A855F7', '#38BDF8', '#34D399', '#FBBF24', '#FB7185', '#E879F9'];

export default function ButterflyExplosion() {
  const butterflies = Array.from({ length: 30 });

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {butterflies.map((_, i) => {
        const color = BUTTERFLY_COLORS[i % BUTTERFLY_COLORS.length];
        const startX = Math.random() * 100;
        const targetX = startX + (Math.random() * 40 - 20);
        const duration = 4 + Math.random() * 4;
        const delay = Math.random() * 2;
        const size = 16 + Math.random() * 14;

        return (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0, 
              x: `${startX}vw`, 
              y: '105vh',
              scale: 0.5 
            }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              x: [`${startX}vw`, `${targetX + 10}vw`, `${targetX}vw`], 
              y: '-10vh',
              scale: 1 
            }}
            transition={{ 
              duration: duration, 
              delay: delay, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute"
            style={{
              filter: `drop-shadow(0 0 10px ${color})`
            }}
          >
            {/* Flapping Wings SVG */}
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
              {/* Left Wing */}
              <motion.path
                d="M12 12 C8 4, 2 6, 2 12 C2 18, 8 20, 12 14 Z"
                fill={color}
                animate={{ scaleX: [1, 0.2, 1] }}
                transition={{ duration: 0.25, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "12px 12px" }}
              />
              {/* Right Wing */}
              <motion.path
                d="M12 12 C16 4, 22 6, 22 12 C22 18, 16 20, 12 14 Z"
                fill={color}
                animate={{ scaleX: [1, 0.2, 1] }}
                transition={{ duration: 0.25, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "12px 12px" }}
              />
              {/* Center Body */}
              <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}
