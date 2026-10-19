import React, { useEffect, useRef } from 'react';

export default function ThreeDHeartBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';
    const totalElements = 140;

    for (let i = 0; i < totalElements; i++) {
      const word = document.createElement('div');
      word.className = 'love-3d-word';
      word.innerText = 'I love you';

      const t = (i / totalElements) * Math.PI * 2;
      const scale = 14;
      const x = scale * 16 * Math.pow(Math.sin(t), 3);
      const y = -scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      const z = Math.sin(t * 2) * 55;

      const rotateY = t * (180 / Math.PI);
      const rotateZ = -30;

      word.style.position = 'absolute';
      word.style.left = '50%';
      word.style.top = '50%';
      word.style.color = '#ea80b0';
      word.style.fontSize = '1.1rem';
      word.style.fontFamily = 'serif';
      word.style.textShadow = '0 0 12px rgba(244, 114, 182, 0.9), 0 0 20px rgba(234, 128, 176, 0.6)';
      word.style.letterSpacing = '2px';
      word.style.whiteSpace = 'nowrap';
      word.style.transformStyle = 'preserve-3d';
      word.style.backfaceVisibility = 'visible';
      word.style.pointerEvents = 'none';
      word.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;

      container.appendChild(word);
    }
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden [perspective:1000px] z-10 opacity-75">
      <style>{`
        @keyframes rotate3dHeart {
          0% { transform: rotateY(0deg) rotateX(10deg); }
          100% { transform: rotateY(360deg) rotateX(10deg); }
        }
        .animate-heart-rotate {
          transform-style: preserve-3d;
          animation: rotate3dHeart 18s linear infinite;
        }
      `}</style>
      <div ref={containerRef} className="relative w-0 h-0 animate-heart-rotate" />
    </div>
  );
}
