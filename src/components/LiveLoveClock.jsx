import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Heart, Sparkles } from 'lucide-react';

const START_DATE = new Date('2026-05-19T01:30:00+05:30').getTime();

export default function LiveLoveClock() {
  const [elapsed, setElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, now - START_DATE);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setElapsed({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { label: 'Days', value: elapsed.days },
    { label: 'Hours', value: String(elapsed.hours).padStart(2, '0') },
    { label: 'Minutes', value: String(elapsed.minutes).padStart(2, '0') },
    { label: 'Seconds', value: String(elapsed.seconds).padStart(2, '0') },
  ];

  return (
    <div className="w-full max-w-lg mx-auto my-8 px-4 z-30">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 sm:p-8 rounded-3xl backdrop-blur-2xl bg-zinc-950/85 border border-rose-500/30 shadow-[0_0_45px_rgba(244,114,182,0.2)] text-center relative overflow-hidden"
      >
        <div className="flex items-center justify-center gap-2 mb-3 text-rose-400">
          <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-rose-300">
            Our Time Together
          </span>
          <Sparkles className="w-4 h-4 text-amber-300"/>
        </div>

        <h3 className="text-lg sm:text-xl font-serif text-white/90 mb-6">
          Every Single Second In Love With You ✨
        </h3>

        <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4">
          {timeUnits.map((item, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-4 rounded-2xl bg-white/[0.04] border border-rose-400/20 shadow-[0_0_15px_rgba(244,114,182,0.1)] flex flex-col items-center justify-center"
            >
              <span className="text-2xl sm:text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-rose-200 drop-shadow-[0_0_10px_rgba(244,114,182,0.5)]">
                {item.value}
              </span>
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-rose-300/70 mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[11px] font-mono text-rose-300/60 mt-3 flex items-center justify-center gap-1">
          <Heart className="w-3 h-3 text-rose-400 fill-rose-400"/>
          Since May 19, 2026 • 01:30 AM
        </p>
      </motion.div>
    </div>
  );
}
