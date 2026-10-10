import React from 'react';

export default function TextHeart3D() {
  const points = Array.from({ length: 42 });

  return (
    <div className="relative w-80 h-80 sm:w-[400px] sm:h-[400px] flex items-center justify-center perspective-[1000px] pointer-events-none select-none my-4">
      <div className="relative w-full h-full transform-style:preserve-3d animate-[spinHeart3D_18s_linear_infinite]">
        {points.map((_, i) => {
          const t = (i / points.length) * Math.PI * 2;
          const x = 16 * Math.pow(Math.sin(t), 3);
          const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
          const z = Math.sin(t * 2) * 35;
          const rotateZ = (t * 180) / Math.PI - 90;

          return (
            <span
              key={i}
              className="love_word absolute font-bold"
              style={{
                color: '#ea80b0',
                textShadow: '0 0 10px #ffffff, 0 0 18px #ea80b0',
                letterSpacing: '2px',
                whiteSpace: 'nowrap',
                transform: `translate3d(${x * 9}px, ${y * 9}px, ${z}px) rotateZ(${rotateZ}deg)`,
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
