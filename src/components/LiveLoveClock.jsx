import React, { useState, useEffect } from 'react';

export default function LiveLoveClock() {
  // Start date: May 28, 2026 at 01:30:00 AM IST
  const START_DATE = new Date('2026-05-28T01:30:00');

  const calculateTime = () => {
    const now = new Date();
    const difference = now.getTime() - START_DATE.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { days, hours, minutes, seconds };
  };

  const [time, setTime] = useState(calculateTime());

  useEffect(() => {
    // Recalculate every 1 second
    const interval = setInterval(() => {
      setTime(calculateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <div className="w-full flex flex-col items-center justify-center text-center space-y-4 my-6">
      {/* Header */}
      <div className="flex items-center gap-2 text-rose-400 text-xs sm:text-sm font-mono tracking-widest uppercase">
        <span>⏰ OUR TIME TOGETHER ✨</span>
      </div>

      <h1 className="text-2xl sm:text-4xl font-serif font-black text-white tracking-wider text-center">
        Infinite Memories, Timeless Moments With You 🌙
      </h1>

      {/* Dynamic Counter Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 my-4 max-w-md w-full">
        {/* DAYS */}
        <div className="p-3 sm:p-4 rounded-2xl bg-zinc-900/90 border border-rose-500/20 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.15)]">
          <span className="text-2xl sm:text-4xl font-mono font-black text-rose-100">
            {time.days}
          </span>
          <span className="text-[10px] sm:text-xs text-rose-400 font-mono tracking-wider uppercase mt-1">
            DAYS
          </span>
        </div>

        {/* HOURS */}
        <div className="p-3 sm:p-4 rounded-2xl bg-zinc-900/90 border border-rose-500/20 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.15)]">
          <span className="text-2xl sm:text-4xl font-mono font-black text-rose-100">
            {formatNumber(time.hours)}
          </span>
          <span className="text-[10px] sm:text-xs text-rose-400 font-mono tracking-wider uppercase mt-1">
            HOURS
          </span>
        </div>

        {/* MINUTES */}
        <div className="p-3 sm:p-4 rounded-2xl bg-zinc-900/90 border border-rose-500/20 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.15)]">
          <span className="text-2xl sm:text-4xl font-mono font-black text-rose-100">
            {formatNumber(time.minutes)}
          </span>
          <span className="text-[10px] sm:text-xs text-rose-400 font-mono tracking-wider uppercase mt-1">
            MINUTES
          </span>
        </div>

        {/* SECONDS */}
        <div className="p-3 sm:p-4 rounded-2xl bg-zinc-900/90 border border-rose-500/20 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.15)]">
          <span className="text-2xl sm:text-4xl font-mono font-black text-rose-100">
            {formatNumber(time.seconds)}
          </span>
          <span className="text-[10px] sm:text-xs text-rose-400 font-mono tracking-wider uppercase mt-1">
            SECONDS
          </span>
        </div>
      </div>

      {/* Subtext */}
      <p className="text-xs sm:text-sm text-rose-300 font-mono">
        💖 Since May 28, 2026 • 01:30 AM
      </p>
    </div>
  );
}
