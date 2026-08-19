import React from 'react';
import { useScene, SCENES } from '../context/SceneProvider';
import Mascot from './Mascot';

const isAccepted = (s) => s === SCENES.QUIZ || s === SCENES.CERTIFICATE || s === SCENES.FINALE;

export default function RightDecorations() {
  const { currentScene, storyIntensity } = useScene();

  // Determine vine and lantern opacity/scale based on scene progression
  let vineOpacity = 1.0;
  let vineScale = 1.0;
  let mascotOpacity = 1.0;
  let lanternGlowOpacity = 0.45;

  if (currentScene === SCENES.INTRO) {
    vineOpacity = 0.25; // faint silhouette
    vineScale = 0.75;
    mascotOpacity = 0.25; // visible at low intensity
    lanternGlowOpacity = 0.1; // faint flicker
  } else if (currentScene === SCENES.CONFESSION) {
    vineOpacity = 0.0; // complete dark suspense
    mascotOpacity = 0.0;
    lanternGlowOpacity = 0.0;
  } else {
    // Other scenes get full intensity
    vineOpacity = 1.0;
    vineScale = 1.0;
    mascotOpacity = 1.0;
    lanternGlowOpacity = 0.3 + storyIntensity * 0.4;
  }

  // Derive mascot state based on current story beat (with a delayed reaction on YES)
  const [delayedState, setDelayedState] = React.useState('idle');

  React.useEffect(() => {
    let timer;
    if (isAccepted(currentScene)) {
      setDelayedState('nervous'); // Keep nervous/shy during suspense
      timer = setTimeout(() => {
        setDelayedState('celebrating'); // Happy celebrating on impact
      }, 2500);
    } else {
      if (currentScene === SCENES.INTRO) {
        setDelayedState('curious');
      } else if (currentScene === SCENES.MEMORIES) {
        setDelayedState('excited');
      } else if (currentScene === SCENES.LETTER) {
        setDelayedState('shy');
      } else if (currentScene === SCENES.GAME) {
        setDelayedState('excited');
      } else if (currentScene === SCENES.CONFESSION) {
        setDelayedState('excited');
      } else {
        setDelayedState('idle');
      }
    }
    return () => clearTimeout(timer);
  }, [currentScene]);

  return (
    <div 
      className="fixed -right-2 md:right-0 top-1/4 bottom-0 z-20 pointer-events-none select-none w-[68px] md:w-[190px] flex flex-col justify-between items-end transition-all duration-[2000ms]"
      style={{ opacity: vineOpacity, transform: `scale(${vineScale})`, transformOrigin: 'right center' }}
    >
      {/* Hanging Vine and Glowing Lantern */}
      <svg
        viewBox="0 0 150 200"
        className="w-full h-[100px] md:h-[200px] filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
      >
        <path
          d="M150,0 Q120,50 110,90 T95,140"
          fill="none"
          stroke="#3b5936"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path d="M112,85 Q85,100 80,115" fill="none" stroke="#3b5936" strokeWidth="2.5" strokeLinecap="round" />
        
        <path d="M125,35 Q105,30 115,20 Q125,25 125,35 Z" fill="#4d7247" />
        <path d="M102,96 Q85,92 90,80 Q105,82 102,96 Z" fill="#4d7247" />
        <path d="M83,114 Q65,116 72,106 Q82,104 83,114 Z" fill="#4d7247" />
 
        <path d="M80,115 Q80,125 78,130" fill="none" stroke="#222222" strokeWidth="2" />
        
        {/* The Lantern */}
        <g transform="translate(63, 130)">
          <path d="M0,8 L15,0 L30,8 Z" fill="#5c4033" stroke="#2c1d11" strokeWidth="1" />
          <rect x="3" y="8" width="24" height="26" rx="4" fill="none" stroke="#5c4033" strokeWidth="2" />
          <rect x="0" y="34" width="30" height="6" rx="2" fill="#5c4033" />
          
          <circle cx="15" cy="20" r="7" fill="#ffd43f" opacity={lanternGlowOpacity > 0 ? 1 : 0} className="transition-opacity duration-1000" />
          <circle cx="15" cy="20" r="14" fill="#ffea9f" opacity={lanternGlowOpacity} className="animate-pulse transition-opacity duration-1000" />
          <circle cx="15" cy="20" r="25" fill="#ffe066" opacity={lanternGlowOpacity > 0.1 ? 0.12 : 0} className="animate-pulse transition-opacity duration-1000" style={{ animationDuration: '3s' }} />
        </g>
      </svg>
 
      {/* Mascot Rendering */}
      {mascotOpacity > 0 && (
        <div 
          className="w-full relative h-16 md:h-36 overflow-visible flex items-end justify-end p-1 md:p-2 mb-1 md:mb-2 transition-opacity duration-[2000ms]"
          style={{ opacity: mascotOpacity }}
        >
          <Mascot state={delayedState} />
        </div>
      )}
    </div>
  );
}
