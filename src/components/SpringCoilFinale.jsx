import React from 'react';

export default function SpringCoilFinale() {
  return (
    <div className="relative flex flex-col items-center justify-center mt-8 pointer-events-none select-none">
      <svg className="coil" viewBox="0 0 100 100">
        <path
          className="coil-track"
          d="M 50 90 L 50 45 Q 50 20 30 15 M 50 45 Q 50 20 70 15 M 50 60 Q 50 35 25 35 M 50 60 Q 50 35 75 35"
        />
        {/* Blossoming glowing floral embers inside SVG */}
        <circle cx="30" cy="15" r="4.5" fill="#fde08b" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 4px #ea80b0)' }} />
        <circle cx="70" cy="15" r="4.5" fill="#fde08b" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 4px #ea80b0)' }} />
        <circle cx="25" cy="35" r="3.5" fill="#ea80b0" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 4px #ea80b0)' }} />
        <circle cx="75" cy="35" r="3.5" fill="#ea80b0" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 4px #ea80b0)' }} />
      </svg>
      <p className="text-amber-200/80 font-['Playfair_Display',serif] italic text-sm mt-3 tracking-widest drop-shadow-[0_0_8px_rgba(253,224,139,0.5)]">
        ...and make it count forever
      </p>
    </div>
  );
}
