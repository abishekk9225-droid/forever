import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { MessageCircleHeart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AskDialogueScene({ onNext }) {
  const buttonRef = useRef(null);
  
  // Spring physics settings for magnetic effect
  const springSetting = { damping: 15, stiffness: 150 };
  const magneticX = useSpring(useMotionValue(0), springSetting);
  const magneticY = useSpring(useMotionValue(0), springSetting);

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate distance from center
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    // Pull factor (limit how far the button can move)
    const pullX = deltaX * 0.35;
    const pullY = deltaY * 0.35;
    
    magneticX.set(pullX);
    magneticY.set(pullY);
  };

  const handleMouseLeave = () => {
    magneticX.set(0);
    magneticY.set(0);
  };

  const handleAskClick = () => {
    // Intense explosive confetti celebration
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#E0A899', '#B76E79', '#f43f5e', '#ffd700']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#E0A899', '#B76E79', '#f43f5e', '#ffd700']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    onNext();
  };

  // Chromatic text shadow style
  const chromaticStyle = {
    textShadow: `
      1px 1px 0px rgba(244, 63, 94, 0.75), 
      -1px -1px 0px rgba(14, 165, 233, 0.75), 
      0 0 10px rgba(224, 168, 153, 0.4)
    `
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 z-30 relative">
      
      {/* Background glow behind card */}
      <div className="absolute w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none animate-pulse -translate-x-1/2 left-1/2 top-1/2 -translate-y-1/2" />

      {/* Stylesheet for custom fluid gradient keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fluidGrad {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .bg-fluid-grad {
          background-size: 200% 200%;
          animation: fluidGrad 4s ease infinite;
        }
      `}} />

      {/* Main Frosted Card with Glowing Rose-Gold Borders */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full p-8 sm:p-10 rounded-3xl backdrop-blur-2xl relative z-10 space-y-7 overflow-hidden"
        style={{
          background: 'radial-gradient(circle at top left, rgba(20, 10, 30, 0.92) 0%, rgba(8, 4, 15, 0.96) 100%)',
          border: '1px solid rgba(224, 168, 153, 0.45)',
          boxShadow: `
            0 0 40px rgba(224, 168, 153, 0.2),
            inset 0 0 20px rgba(224, 168, 153, 0.08),
            0 20px 50px rgba(0, 0, 0, 0.7)
          `
        }}
      >
        
        {/* Subtle holographic line overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-40 mix-blend-overlay" />

        {/* Top Rose-Gold Pulsating Badge */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 0 15px rgba(224, 168, 153, 0.3)',
              '0 0 30px rgba(224, 168, 153, 0.6)',
              '0 0 15px rgba(224, 168, 153, 0.3)'
            ]
          }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-[#b76e79] to-[#e0a899] flex items-center justify-center text-zinc-950 border border-white/20"
        >
          <MessageCircleHeart className="w-8 h-8 fill-zinc-950/20"/>
        </motion.div>

        {/* Cinematic Heartfelt Message with Chromatic Shadow styling */}
        <div className="space-y-4 text-rose-100 font-serif leading-relaxed text-sm sm:text-base italic px-2 text-center tracking-wide">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={chromaticStyle}
          >
            "First of all sorry, entha situation-la etha kekakudadhuthaan, but yenaku kekanum nu thonuchu..."
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            style={chromaticStyle}
          >
            "Ni thappa yethum yeduthukatha ok va?"
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.8 }}
            style={chromaticStyle}
          >
            "Sollanum nu thonuchu, yenaku hope iruku un mela, atha solren..."
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.8 }}
            className="text-amber-300 font-bold not-italic text-base sm:text-lg pt-1"
            style={{
              textShadow: '0 0 12px rgba(251, 191, 36, 0.45)'
            }}
          >
            "Ni yethum nenachuka mattinu ok va, arambikalama? ✨"
          </motion.p>
        </div>

        {/* Magnetic Fluid-Gradient ASK Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2, duration: 0.8 }}
          className="pt-3 flex justify-center"
        >
          <motion.button
            ref={buttonRef}
            style={{ x: magneticX, y: magneticY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAskClick}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#b76e79] via-[#e0a899] to-[#ffd700] text-zinc-950 font-bold text-base sm:text-lg shadow-[0_0_35px_rgba(224,168,153,0.5)] flex items-center justify-center gap-3 cursor-pointer bg-fluid-grad border border-white/20 select-none transition-shadow"
          >
            <Sparkles className="w-5 h-5 animate-pulse fill-zinc-950/20"/>
            <span className="tracking-wide">Ask 💭 ✨ ➔</span>
          </motion.button>
        </motion.div>

      </motion.div>
    </div>
  );
}

