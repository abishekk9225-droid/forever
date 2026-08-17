import React from 'react';

export default function TextHeart3D() {
  // Generate 42 text points arranged along a 3D parametric heart curve
  const words = Array.from({ length: 42 });

  return (
    <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center perspective-[1000px] pointer-events-none select-none">
      <div className="relative w-full h-full transform-style:preserve-3d animate-[spin3d_16s_linear_infinite]">
        {words.map((_, i) => {
          const t = (i / words.length) * Math.PI * 2;
          // 3D Heart parametric formula
          const x = 16 * Math.pow(Math.sin(t), 3);
          const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
          const rotateZ = (t * 180) / Math.PI - 90;

          return (
            <span
              key={i}
              className="absolute text-xs sm:text-sm font-bold whitespace-nowrap love_word"
              style={{
                color: '#ea80b0',
                textShadow: '0 0 10px #ffffff, 0 0 18px #ea80b0',
                letterSpacing: '2px',
                transform: `translate3d(${x * 8}px, ${y * 8}px, ${Math.sin(t) * 40}px) rotateZ(${rotateZ}deg)`,
                transformOrigin: 'center center'
              }}
            >
              i love you
            </span>
          );
        })}
      </div>
    </div>
  );
}
