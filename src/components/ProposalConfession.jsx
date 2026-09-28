import React, { useState, useEffect } from 'react';
import CinematicRainbowBorder from './CinematicRainbowBorder';

// ==========================================
// CINEMATIC SVG CHERRY BLOSSOM FLOWER HELPER
// ==========================================
function BlossomCluster({ x, y, scale = 1, rotation = 0, opacity = 1 }) {
  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}
      opacity={opacity}
      className="pointer-events-none"
    >
      {/* Soft Ambient Flower Bloom */}
      <circle cx="0" cy="0" r="28" fill="url(#blossomAmbientGlow)" opacity="0.45" />

      {/* 5-Petal Rose / Sakura Blossom Formation */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <path
          key={i}
          d="M 0,0 C -9,-14 -16,-10 -14,2 C -12,12 -3,14 0,0 Z"
          transform={`rotate(${angle})`}
          fill={i % 2 === 0 ? 'url(#sakuraPetalDeep)' : 'url(#sakuraPetalLight)'}
          filter="url(#sakuraDropShadow)"
        />
      ))}

      {/* Central Florets & Stamen */}
      {[36, 108, 180, 252, 324].map((angle, i) => (
        <line
          key={`stamen-${i}`}
          x1="0"
          y1="0"
          x2="0"
          y2="-6"
          transform={`rotate(${angle})`}
          stroke="#fef08a"
          strokeWidth="1.2"
        />
      ))}
      <circle cx="0" cy="0" r="3.2" fill="#fffbeb" />
      <circle cx="0" cy="0" r="1.8" fill="#f59e0b" />
    </g>
  );
}

// ==========================================
// LEFT CINEMATIC FLOWERING TREE (ABISHEK)
// ==========================================
function LeftCinematicTree() {
  return (
    <div className="absolute left-0 bottom-0 top-0 w-[34%] sm:w-[36%] md:w-[38%] max-w-[440px] pointer-events-none z-[12] overflow-visible">
      {/* Volumetric Pink/Rose Atmospheric Backlight */}
      <div
        className="absolute -inset-10 opacity-60 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 25% 65%, rgba(244,63,94,0.38) 0%, rgba(236,72,153,0.25) 45%, rgba(168,85,247,0.15) 70%, transparent 100%)',
        }}
      />

      <svg
        viewBox="0 0 500 900"
        preserveAspectRatio="xMinYMax meet"
        className="w-full h-full overflow-visible drop-shadow-[0_0_30px_rgba(244,63,94,0.4)]"
      >
        <defs>
          {/* Gradients for Trunk & Bark */}
          <linearGradient id="leftTrunkGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#12060b" />
            <stop offset="25%" stopColor="#240c17" />
            <stop offset="60%" stopColor="#3d1425" />
            <stop offset="90%" stopColor="#5c1e38" />
            <stop offset="100%" stopColor="#831843" />
          </linearGradient>

          {/* Golden Bough Rim Lighting */}
          <linearGradient id="goldRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          {/* Blossom Petal Gradients */}
          <radialGradient id="sakuraPetalDeep" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="45%" stopColor="#f43f5e" />
            <stop offset="85%" stopColor="#be123c" />
            <stop offset="100%" stopColor="#881337" />
          </radialGradient>

          <radialGradient id="sakuraPetalLight" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fff1f2" />
            <stop offset="40%" stopColor="#fbcfe8" />
            <stop offset="80%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#be185d" />
          </radialGradient>

          <radialGradient id="blossomAmbientGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#ec4899" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="fairyLightRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          <filter id="sakuraDropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.5" />
          </filter>

          <filter id="fairyGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* BACKGROUND SOFT CANOPY MASSES (Lush Volumetric Blossom Depth) */}
        <g opacity="0.55" filter="url(#sakuraDropShadow)">
          <circle cx="140" cy="180" r="110" fill="#9d174d" />
          <circle cx="260" cy="130" r="95" fill="#be185d" />
          <circle cx="360" cy="160" r="85" fill="#881337" />
          <circle cx="100" cy="300" r="90" fill="#9d174d" />
          <circle cx="220" cy="280" r="95" fill="#be185d" />
          <circle cx="330" cy="310" r="80" fill="#a21caf" />
          <circle cx="70" cy="450" r="85" fill="#881337" />
          <circle cx="170" cy="430" r="90" fill="#9d174d" />
        </g>

        {/* ORGANIC MAIN TREE TRUNK & GNARLED BARK */}
        <g>
          {/* Main Gnarled Trunk Rising from Bottom-Left */}
          <path
            d="M 0,900 C 35,840 60,740 65,650 C 70,550 45,460 60,370 C 75,270 120,210 180,150 C 230,100 290,70 370,45 C 330,85 270,135 220,190 C 175,245 145,320 135,420 C 125,510 150,650 160,780 C 168,840 175,880 190,900 Z"
            fill="url(#leftTrunkGrad)"
          />

          {/* Golden Bough Edge Highlights */}
          <path
            d="M 60,370 C 75,270 120,210 180,150 C 230,100 290,70 370,45"
            stroke="url(#goldRimGrad)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />

          {/* Major Branch 1: High Canopy Arch toward Center-Left */}
          <path
            d="M 180,150 C 240,110 320,100 410,115 C 445,120 480,140 500,165 C 460,150 415,145 375,148 C 310,152 245,185 200,210 Z"
            fill="url(#leftTrunkGrad)"
          />
          <path
            d="M 240,110 C 320,100 410,115 480,140"
            stroke="url(#goldRimGrad)"
            strokeWidth="3"
            fill="none"
          />

          {/* Major Branch 2: Mid Bough reaching toward Center */}
          <path
            d="M 135,420 C 180,370 260,330 350,320 C 395,315 440,325 470,345 C 430,340 380,340 340,350 C 270,368 200,410 160,455 Z"
            fill="url(#leftTrunkGrad)"
          />
          <path
            d="M 180,370 C 260,330 350,320 440,325"
            stroke="url(#goldRimGrad)"
            strokeWidth="2.5"
            fill="none"
          />

          {/* Major Branch 3: Lower Arch gracefully flanking margin */}
          <path
            d="M 145,550 C 190,520 250,510 320,520 C 360,525 400,545 425,565 C 385,550 345,545 305,548 C 245,552 195,575 160,610 Z"
            fill="url(#leftTrunkGrad)"
          />

          {/* Fine Secondary Twigs with Budding Nodes */}
          <path
            d="M 280,125 Q 315,75 350,60 M 340,140 Q 380,110 420,95 M 240,340 Q 275,290 310,270 M 320,335 Q 365,295 405,285 M 220,530 Q 260,490 295,475"
            stroke="#5c1e38"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* BRANCH TRAVELLING LIGHT RUNNERS (Energy Pulse Through Branches) */}
          <path
            d="M 60,370 C 75,270 120,210 180,150 C 230,100 290,70 370,45"
            stroke="#fef08a"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="60 340"
            filter="url(#fairyGlowFilter)"
            style={{ animation: 'branchLightTravel 6s linear infinite' }}
          />
          <path
            d="M 180,150 C 240,110 320,100 410,115 C 445,120 480,140 500,165"
            stroke="#f472b6"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="50 300"
            filter="url(#fairyGlowFilter)"
            style={{ animation: 'branchLightTravel 7s linear infinite', animationDelay: '1.5s' }}
          />
        </g>

        {/* HANGING WEEPING BLOSSOM GARLANDS & DELICATE TENDRILS */}
        <g opacity="0.9">
          {[
            { x: 190, y: 220, l: 6 },
            { x: 260, y: 175, l: 8 },
            { x: 340, y: 170, l: 9 },
            { x: 420, y: 180, l: 7 },
            { x: 280, y: 360, l: 7 },
            { x: 360, y: 355, l: 8 },
            { x: 430, y: 365, l: 6 },
            { x: 250, y: 550, l: 5 },
            { x: 330, y: 555, l: 6 },
          ].map((tendril, tidx) => (
            <g key={`tendril-${tidx}`}>
              <line
                x1={tendril.x}
                y1={tendril.y}
                x2={tendril.x - 10}
                y2={tendril.y + tendril.l * 12}
                stroke="rgba(244,63,94,0.4)"
                strokeWidth="1"
                strokeDasharray="2 3"
              />
              {[...Array(tendril.l)].map((_, fi) => (
                <circle
                  key={`tfl-${fi}`}
                  cx={tendril.x - (fi * 1.5)}
                  cy={tendril.y + (fi * 12) + 6}
                  r={5.5 - (fi * 0.4)}
                  fill={fi % 2 === 0 ? '#fda4af' : '#f43f5e'}
                  opacity={0.9}
                  filter="url(#sakuraDropShadow)"
                />
              ))}
            </g>
          ))}
        </g>

        {/* DENSE LUXURIOUS BLOSSOM CLUSTERS ACROSS CANOPY */}
        <g style={{ animation: 'flowerClusterBreathe 5s ease-in-out infinite' }}>
          {/* High Canopy Clusters */}
          <BlossomCluster x={120} y={160} scale={1.4} rotation={15} />
          <BlossomCluster x={180} y={130} scale={1.5} rotation={-25} />
          <BlossomCluster x={240} y={90} scale={1.3} rotation={45} />
          <BlossomCluster x={300} y={70} scale={1.4} rotation={-10} />
          <BlossomCluster x={360} y={60} scale={1.2} rotation={35} />
          <BlossomCluster x={420} y={80} scale={1.3} rotation={-20} />
          <BlossomCluster x={470} y={120} scale={1.1} rotation={18} />

          {/* Upper-Mid Bough Clusters */}
          <BlossomCluster x={150} y={230} scale={1.3} rotation={-15} />
          <BlossomCluster x={210} y={190} scale={1.4} rotation={30} />
          <BlossomCluster x={270} y={160} scale={1.5} rotation={-5} />
          <BlossomCluster x={330} y={150} scale={1.3} rotation={40} />
          <BlossomCluster x={390} y={160} scale={1.4} rotation={-30} />
          <BlossomCluster x={450} y={180} scale={1.2} rotation={22} />

          {/* Mid Branch Clusters (Extending toward Center-Left margin) */}
          <BlossomCluster x={110} y={320} scale={1.2} rotation={12} />
          <BlossomCluster x={170} y={290} scale={1.4} rotation={-18} />
          <BlossomCluster x={230} y={270} scale={1.3} rotation={25} />
          <BlossomCluster x={290} y={260} scale={1.4} rotation={-12} />
          <BlossomCluster x={350} y={270} scale={1.3} rotation={35} />
          <BlossomCluster x={410} y={290} scale={1.2} rotation={-15} />
          <BlossomCluster x={460} y={320} scale={1.1} rotation={20} />

          {/* Lower Bough Clusters */}
          <BlossomCluster x={80} y={430} scale={1.2} rotation={-10} />
          <BlossomCluster x={140} y={400} scale={1.3} rotation={28} />
          <BlossomCluster x={200} y={380} scale={1.4} rotation={-22} />
          <BlossomCluster x={260} y={370} scale={1.3} rotation={15} />
          <BlossomCluster x={320} y={380} scale={1.2} rotation={-35} />
          <BlossomCluster x={380} y={400} scale={1.1} rotation={10} />

          {/* Flank Clusters along lower trunk */}
          <BlossomCluster x={100} y={530} scale={1.1} rotation={20} />
          <BlossomCluster x={160} y={510} scale={1.2} rotation={-15} />
          <BlossomCluster x={220} y={490} scale={1.2} rotation={30} />
          <BlossomCluster x={280} y={490} scale={1.1} rotation={-25} />
          <BlossomCluster x={340} y={510} scale={1.0} rotation={18} />
          <BlossomCluster x={90} y={630} scale={1.0} rotation={-12} />
          <BlossomCluster x={150} y={610} scale={1.1} rotation={25} />
        </g>

        {/* WARM GOLDEN FAIRY LIGHTS & HANGING HEART LANTERNS */}
        <g filter="url(#fairyGlowFilter)">
          {/* Hanging Golden Heart Lanterns swaying softly */}
          {[
            { x: 210, y: 220, l: 38 },
            { x: 310, y: 180, l: 45 },
            { x: 390, y: 190, l: 32 },
            { x: 280, y: 380, l: 40 },
            { x: 370, y: 370, l: 35 },
          ].map((lantern, li) => (
            <g
              key={`lantern-${li}`}
              style={{
                transformOrigin: `${lantern.x}px ${lantern.y}px`,
                animation: `lanternSway ${3.5 + (li * 0.4)}s ease-in-out infinite`,
                animationDelay: `${li * 0.7}s`,
              }}
            >
              <line
                x1={lantern.x}
                y1={lantern.y}
                x2={lantern.x}
                y2={lantern.y + lantern.l}
                stroke="#fbbf24"
                strokeWidth="1.2"
              />
              <circle
                cx={lantern.x}
                cy={lantern.y + lantern.l}
                r="7"
                fill="url(#fairyLightRadial)"
              />
              <path
                d={`M ${lantern.x},${lantern.y + lantern.l - 4} C ${lantern.x - 4},${lantern.y + lantern.l - 8} ${lantern.x - 8},${lantern.y + lantern.l - 4} ${lantern.x},${lantern.y + lantern.l + 5} C ${lantern.x + 8},${lantern.y + lantern.l - 4} ${lantern.x + 4},${lantern.y + lantern.l - 8} ${lantern.x},${lantern.y + lantern.l - 4} Z`}
                fill="#f43f5e"
                opacity="0.9"
              />
            </g>
          ))}

          {/* Twinkling Fairy Light Orbs along Branches */}
          {[
            { cx: 160, cy: 150, r: 4.5 },
            { cx: 220, cy: 110, r: 4 },
            { cx: 280, cy: 90, r: 5 },
            { cx: 340, cy: 80, r: 4 },
            { cx: 400, cy: 95, r: 4.5 },
            { cx: 180, cy: 210, r: 4 },
            { cx: 250, cy: 180, r: 5 },
            { cx: 320, cy: 170, r: 4 },
            { cx: 380, cy: 185, r: 4.5 },
            { cx: 210, cy: 290, r: 4 },
            { cx: 280, cy: 275, r: 4.5 },
            { cx: 350, cy: 285, r: 4 },
            { cx: 170, cy: 410, r: 4 },
            { cx: 240, cy: 390, r: 4.5 },
            { cx: 310, cy: 400, r: 4 },
            { cx: 150, cy: 520, r: 4 },
            { cx: 210, cy: 505, r: 4.5 },
          ].map((light, lidx) => (
            <circle
              key={`fl-${lidx}`}
              cx={light.cx}
              cy={light.cy}
              r={light.r}
              fill="url(#fairyLightRadial)"
              style={{
                animation: 'fairyTwinkle 2.8s ease-in-out infinite',
                animationDelay: `${lidx * 0.22}s`,
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

// ==========================================
// RIGHT CINEMATIC FLOWERING TREE (SARANYA)
// ==========================================
function RightCinematicTree() {
  return (
    <div className="absolute right-0 bottom-0 top-0 w-[34%] sm:w-[36%] md:w-[38%] max-w-[440px] pointer-events-none z-[12] overflow-visible">
      {/* Volumetric Purple/Rose Atmospheric Backlight */}
      <div
        className="absolute -inset-10 opacity-60 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 75% 65%, rgba(236,72,153,0.38) 0%, rgba(168,85,247,0.25) 45%, rgba(244,63,94,0.15) 70%, transparent 100%)',
        }}
      />

      <svg
        viewBox="0 0 500 900"
        preserveAspectRatio="xMaxYMax meet"
        className="w-full h-full overflow-visible drop-shadow-[0_0_30px_rgba(236,72,153,0.4)]"
      >
        <defs>
          <linearGradient id="rightTrunkGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#12060b" />
            <stop offset="25%" stopColor="#240c17" />
            <stop offset="60%" stopColor="#3d1425" />
            <stop offset="90%" stopColor="#5c1e38" />
            <stop offset="100%" stopColor="#831843" />
          </linearGradient>

          <linearGradient id="rightGoldRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="rightSakuraPetalDeep" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="45%" stopColor="#ec4899" />
            <stop offset="85%" stopColor="#be185d" />
            <stop offset="100%" stopColor="#831843" />
          </radialGradient>

          <radialGradient id="rightSakuraPetalLight" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fff1f2" />
            <stop offset="40%" stopColor="#f472b6" />
            <stop offset="80%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#a21caf" />
          </radialGradient>

          <radialGradient id="rightBlossomAmbientGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#a855f7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="rightFairyLightRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#ec4899" stopOpacity="0.8" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          <filter id="rightSakuraDropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.5" />
          </filter>

          <filter id="rightFairyGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Mirrored container group: flips coordinates so trunk sits at bottom-right and branches reach inward toward center */}
        <g transform="translate(500, 0) scale(-1, 1)">

        {/* Mirrored background masses, organic trunk, dense clusters, lanterns & lights */}
        <g opacity="0.55" filter="url(#sakuraDropShadow)">
          <circle cx="140" cy="180" r="110" fill="#9d174d" />
          <circle cx="260" cy="130" r="95" fill="#be185d" />
          <circle cx="360" cy="160" r="85" fill="#881337" />
          <circle cx="100" cy="300" r="90" fill="#9d174d" />
          <circle cx="220" cy="280" r="95" fill="#be185d" />
          <circle cx="330" cy="310" r="80" fill="#a21caf" />
          <circle cx="70" cy="450" r="85" fill="#881337" />
          <circle cx="170" cy="430" r="90" fill="#9d174d" />
        </g>

        {/* ORGANIC MAIN TREE TRUNK */}
        <g>
          <path
            d="M 0,900 C 35,840 60,740 65,650 C 70,550 45,460 60,370 C 75,270 120,210 180,150 C 230,100 290,70 370,45 C 330,85 270,135 220,190 C 175,245 145,320 135,420 C 125,510 150,650 160,780 C 168,840 175,880 190,900 Z"
            fill="url(#rightTrunkGrad)"
          />
          <path
            d="M 60,370 C 75,270 120,210 180,150 C 230,100 290,70 370,45"
            stroke="url(#goldRimGrad)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 180,150 C 240,110 320,100 410,115 C 445,120 480,140 500,165 C 460,150 415,145 375,148 C 310,152 245,185 200,210 Z"
            fill="url(#rightTrunkGrad)"
          />
          <path
            d="M 240,110 C 320,100 410,115 480,140"
            stroke="url(#goldRimGrad)"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M 135,420 C 180,370 260,330 350,320 C 395,315 440,325 470,345 C 430,340 380,340 340,350 C 270,368 200,410 160,455 Z"
            fill="url(#rightTrunkGrad)"
          />
          <path
            d="M 180,370 C 260,330 350,320 440,325"
            stroke="url(#goldRimGrad)"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M 145,550 C 190,520 250,510 320,520 C 360,525 400,545 425,565 C 385,550 345,545 305,548 C 245,552 195,575 160,610 Z"
            fill="url(#rightTrunkGrad)"
          />
          <path
            d="M 280,125 Q 315,75 350,60 M 340,140 Q 380,110 420,95 M 240,340 Q 275,290 310,270 M 320,335 Q 365,295 405,285 M 220,530 Q 260,490 295,475"
            stroke="#5c1e38"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* BRANCH TRAVELLING LIGHT RUNNERS (Energy Pulse Through Branches) */}
          <path
            d="M 60,370 C 75,270 120,210 180,150 C 230,100 290,70 370,45"
            stroke="#fef08a"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="60 340"
            filter="url(#fairyGlowFilter)"
            style={{ animation: 'branchLightTravel 6s linear infinite' }}
          />
          <path
            d="M 180,150 C 240,110 320,100 410,115 C 445,120 480,140 500,165"
            stroke="#ec4899"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="50 300"
            filter="url(#fairyGlowFilter)"
            style={{ animation: 'branchLightTravel 7s linear infinite', animationDelay: '1.5s' }}
          />
        </g>

        {/* WEEPING GARLANDS */}
        <g opacity="0.9">
          {[
            { x: 190, y: 220, l: 6 },
            { x: 260, y: 175, l: 8 },
            { x: 340, y: 170, l: 9 },
            { x: 420, y: 180, l: 7 },
            { x: 280, y: 360, l: 7 },
            { x: 360, y: 355, l: 8 },
            { x: 430, y: 365, l: 6 },
            { x: 250, y: 550, l: 5 },
            { x: 330, y: 555, l: 6 },
          ].map((tendril, tidx) => (
            <g key={`r-tendril-${tidx}`}>
              <line
                x1={tendril.x}
                y1={tendril.y}
                x2={tendril.x - 10}
                y2={tendril.y + tendril.l * 12}
                stroke="rgba(236,72,153,0.4)"
                strokeWidth="1"
                strokeDasharray="2 3"
              />
              {[...Array(tendril.l)].map((_, fi) => (
                <circle
                  key={`r-tfl-${fi}`}
                  cx={tendril.x - (fi * 1.5)}
                  cy={tendril.y + (fi * 12) + 6}
                  r={5.5 - (fi * 0.4)}
                  fill={fi % 2 === 0 ? '#fbcfe8' : '#ec4899'}
                  opacity={0.9}
                  filter="url(#sakuraDropShadow)"
                />
              ))}
            </g>
          ))}
        </g>

        {/* DENSE FLOWER BLOSSOM CANOPY */}
        <g style={{ animation: 'flowerClusterBreathe 5s ease-in-out infinite' }}>
          <BlossomCluster x={120} y={160} scale={1.4} rotation={-15} />
          <BlossomCluster x={180} y={130} scale={1.5} rotation={25} />
          <BlossomCluster x={240} y={90} scale={1.3} rotation={-45} />
          <BlossomCluster x={300} y={70} scale={1.4} rotation={10} />
          <BlossomCluster x={360} y={60} scale={1.2} rotation={-35} />
          <BlossomCluster x={420} y={80} scale={1.3} rotation={20} />
          <BlossomCluster x={470} y={120} scale={1.1} rotation={-18} />

          <BlossomCluster x={150} y={230} scale={1.3} rotation={15} />
          <BlossomCluster x={210} y={190} scale={1.4} rotation={-30} />
          <BlossomCluster x={270} y={160} scale={1.5} rotation={5} />
          <BlossomCluster x={330} y={150} scale={1.3} rotation={-40} />
          <BlossomCluster x={390} y={160} scale={1.4} rotation={30} />
          <BlossomCluster x={450} y={180} scale={1.2} rotation={-22} />

          <BlossomCluster x={110} y={320} scale={1.2} rotation={-12} />
          <BlossomCluster x={170} y={290} scale={1.4} rotation={18} />
          <BlossomCluster x={230} y={270} scale={1.3} rotation={-25} />
          <BlossomCluster x={290} y={260} scale={1.4} rotation={12} />
          <BlossomCluster x={350} y={270} scale={1.3} rotation={-35} />
          <BlossomCluster x={410} y={290} scale={1.2} rotation={15} />
          <BlossomCluster x={460} y={320} scale={1.1} rotation={-20} />

          <BlossomCluster x={80} y={430} scale={1.2} rotation={10} />
          <BlossomCluster x={140} y={400} scale={1.3} rotation={-28} />
          <BlossomCluster x={200} y={380} scale={1.4} rotation={22} />
          <BlossomCluster x={260} y={370} scale={1.3} rotation={-15} />
          <BlossomCluster x={320} y={380} scale={1.2} rotation={35} />
          <BlossomCluster x={380} y={400} scale={1.1} rotation={-10} />

          <BlossomCluster x={100} y={530} scale={1.1} rotation={-20} />
          <BlossomCluster x={160} y={510} scale={1.2} rotation={15} />
          <BlossomCluster x={220} y={490} scale={1.2} rotation={-30} />
          <BlossomCluster x={280} y={490} scale={1.1} rotation={25} />
          <BlossomCluster x={340} y={510} scale={1.0} rotation={-18} />
          <BlossomCluster x={90} y={630} scale={1.0} rotation={12} />
          <BlossomCluster x={150} y={610} scale={1.1} rotation={-25} />
        </g>

        {/* FAIRY LIGHTS & HANGING HEARTS */}
        <g filter="url(#fairyGlowFilter)">
          {[
            { x: 210, y: 220, l: 38 },
            { x: 310, y: 180, l: 45 },
            { x: 390, y: 190, l: 32 },
            { x: 280, y: 380, l: 40 },
            { x: 370, y: 370, l: 35 },
          ].map((lantern, li) => (
            <g
              key={`r-lantern-${li}`}
              style={{
                transformOrigin: `${lantern.x}px ${lantern.y}px`,
                animation: `lanternSway ${3.8 + (li * 0.3)}s ease-in-out infinite`,
                animationDelay: `${li * 0.6 + 0.3}s`,
              }}
            >
              <line
                x1={lantern.x}
                y1={lantern.y}
                x2={lantern.x}
                y2={lantern.y + lantern.l}
                stroke="#fbbf24"
                strokeWidth="1.2"
              />
              <circle
                cx={lantern.x}
                cy={lantern.y + lantern.l}
                r="7"
                fill="url(#fairyLightRadial)"
              />
              <path
                d={`M ${lantern.x},${lantern.y + lantern.l - 4} C ${lantern.x - 4},${lantern.y + lantern.l - 8} ${lantern.x - 8},${lantern.y + lantern.l - 4} ${lantern.x},${lantern.y + lantern.l + 5} C ${lantern.x + 8},${lantern.y + lantern.l - 4} ${lantern.x + 4},${lantern.y + lantern.l - 8} ${lantern.x},${lantern.y + lantern.l - 4} Z`}
                fill="#ec4899"
                opacity="0.9"
              />
            </g>
          ))}

          {[
            { cx: 160, cy: 150, r: 4.5 },
            { cx: 220, cy: 110, r: 4 },
            { cx: 280, cy: 90, r: 5 },
            { cx: 340, cy: 80, r: 4 },
            { cx: 400, cy: 95, r: 4.5 },
            { cx: 180, cy: 210, r: 4 },
            { cx: 250, cy: 180, r: 5 },
            { cx: 320, cy: 170, r: 4 },
            { cx: 380, cy: 185, r: 4.5 },
            { cx: 210, cy: 290, r: 4 },
            { cx: 280, cy: 275, r: 4.5 },
            { cx: 350, cy: 285, r: 4 },
            { cx: 170, cy: 410, r: 4 },
            { cx: 240, cy: 390, r: 4.5 },
            { cx: 310, cy: 400, r: 4 },
            { cx: 150, cy: 520, r: 4 },
            { cx: 210, cy: 505, r: 4.5 },
          ].map((light, lidx) => (
            <circle
              key={`r-fl-${lidx}`}
              cx={light.cx}
              cy={light.cy}
              r={light.r}
              fill="url(#fairyLightRadial)"
              style={{
                animation: 'fairyTwinkle 2.8s ease-in-out infinite',
                animationDelay: `${lidx * 0.22 + 0.15}s`,
              }}
            />
          ))}
        </g>
        </g>
      </svg>
    </div>
  );
}

// ==========================================
// SYNCHRONIZED NAME REVEAL COMPONENT
// ==========================================
function CinematicNameReveal({ name, side }) {
  const letters = name.split('');
  const isLeft = side === 'left';
  const animPrefix = isLeft ? 'letterDropLeft' : 'letterDropRight';

  return (
    <div
      className={`absolute ${
        isLeft
          ? 'left-0 w-[32%] sm:w-[35%] md:w-[37%]'
          : 'right-0 w-[32%] sm:w-[35%] md:w-[37%]'
      } top-[12%] sm:top-[14%] md:top-[16%] pointer-events-none z-[25] flex flex-col items-center justify-center`}
      style={{
        animation: 'wordSynchronizedPulse 9s ease-in-out infinite',
      }}
    >
      {/* Radiant Atmospheric Backdrop Glow */}
      <div
        className="absolute -inset-10 rounded-full blur-2xl pointer-events-none opacity-85"
        style={{
          background: isLeft
            ? 'radial-gradient(ellipse at center, rgba(244,63,94,0.6) 0%, rgba(251,191,36,0.35) 50%, transparent 80%)'
            : 'radial-gradient(ellipse at center, rgba(236,72,153,0.6) 0%, rgba(168,85,247,0.35) 50%, transparent 80%)',
        }}
      />

      {/* Letters Staggered Sequence Emerging From Tree Branches */}
      <div className="relative flex items-center justify-center space-x-1 sm:space-x-1.5 md:space-x-2">
        {letters.map((char, index) => (
          <span
            key={`${name}-${index}`}
            className="inline-block font-serif font-black tracking-wide sm:tracking-wider md:tracking-widest text-2xl sm:text-3xl md:text-4xl lg:text-5xl select-none"
            style={{
              background:
                'linear-gradient(180deg, #ffffff 0%, #fffbeb 18%, #fef08a 38%, #f472b6 68%, #e11d48 88%, #881337 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter:
                'drop-shadow(0 2px 0 #881337) drop-shadow(0 4px 6px rgba(0,0,0,0.95)) drop-shadow(0 0 18px rgba(244,63,94,0.95)) drop-shadow(0 0 35px rgba(251,191,36,0.8))',
              animation: `${animPrefix}${index} 9s cubic-bezier(0.16, 1, 0.3, 1) infinite`,
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Romantic Golden Filigree Underline with Star */}
      <div
        className="relative flex items-center justify-center space-x-1 sm:space-x-1.5 mt-1 sm:mt-1.5 text-amber-200/90 text-[10px] sm:text-xs md:text-sm tracking-widest"
        style={{ animation: 'filigreeGlow 9s ease-in-out infinite' }}
      >
        <span className="w-6 sm:w-10 md:w-14 h-[1.5px] bg-gradient-to-r from-transparent via-rose-400 to-amber-300" />
        <span className="text-amber-200 animate-pulse text-xs sm:text-sm">✨</span>
        <span className="w-6 sm:w-10 md:w-14 h-[1.5px] bg-gradient-to-l from-transparent via-rose-400 to-amber-300" />
      </div>

      {/* Subtle 3D Glass Mirrored Reflection */}
      <div
        className="relative flex items-center justify-center space-x-1 sm:space-x-1.5 md:space-x-2 opacity-25 blur-[1px] select-none pointer-events-none -mt-1 sm:-mt-2 scale-y-[-0.5]"
        aria-hidden="true"
      >
        {letters.map((char, index) => (
          <span
            key={`refl-${name}-${index}`}
            className="inline-block font-serif font-black tracking-wide sm:tracking-wider md:tracking-widest text-xl sm:text-2xl md:text-3xl lg:text-4xl select-none text-rose-300"
          >
            {char}
          </span>
        ))}
      </div>

      {/* Climax Synchronized Glow Burst Accents (Flowers, sparkles, hearts) */}
      <div
        className="absolute -inset-6 pointer-events-none flex items-center justify-center"
        style={{ animation: 'nameClimaxBurst 9s ease-in-out infinite' }}
      >
        <span className="absolute -top-3 -left-3 text-pink-300 text-sm sm:text-base drop-shadow-[0_0_8px_rgba(244,63,94,0.9)]">✨</span>
        <span className="absolute -top-3 -right-3 text-amber-300 text-sm sm:text-base drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]">🌸</span>
        <span className="absolute -bottom-3 -left-2 text-rose-400 text-xs sm:text-sm drop-shadow-[0_0_8px_rgba(244,63,94,0.9)]">❤️</span>
        <span className="absolute -bottom-3 -right-2 text-pink-400 text-sm sm:text-base drop-shadow-[0_0_8px_rgba(236,72,153,0.9)]">✨</span>
      </div>
    </div>
  );
}

// ==========================================
// ONE-BY-ONE FALLING FLOWERS FROM TOP AREA
// ==========================================
const FALLING_FLOWERS = [
  { id: 0, left: '8%', delay: 0.0, dur: 7.8, dx: -45, rot: -220, size: 24, icon: '🌸' },
  { id: 1, left: '22%', delay: 0.55, dur: 8.2, dx: -30, rot: 190, size: 22, icon: '🌺' },
  { id: 2, left: '76%', delay: 1.10, dur: 7.6, dx: 40, rot: -180, size: 26, icon: '🌸' },
  { id: 3, left: '88%', delay: 1.65, dur: 8.4, dx: 35, rot: 240, size: 22, icon: '🌺' },
  { id: 4, left: '14%', delay: 2.20, dur: 8.8, dx: -55, rot: -300, size: 25, icon: '🌸' },
  { id: 5, left: '34%', delay: 2.75, dur: 8.0, dx: 30, rot: 180, size: 20, icon: '✨' },
  { id: 6, left: '68%', delay: 3.30, dur: 8.5, dx: -35, rot: -260, size: 22, icon: '🌸' },
  { id: 7, left: '82%', delay: 3.85, dur: 8.1, dx: 45, rot: 210, size: 24, icon: '🌺' },
  { id: 8, left: '6%', delay: 4.40, dur: 7.9, dx: -25, rot: 160, size: 24, icon: '🌸' },
  { id: 9, left: '92%', delay: 4.95, dur: 8.3, dx: 30, rot: -190, size: 26, icon: '🌸' },
  { id: 10, left: '26%', delay: 5.50, dur: 8.6, dx: 25, rot: 280, size: 22, icon: '🌺' },
  { id: 11, left: '72%', delay: 6.05, dur: 8.0, dx: -30, rot: -220, size: 22, icon: '✨' },
  { id: 12, left: '18%', delay: 6.60, dur: 8.4, dx: -45, rot: 190, size: 25, icon: '🌸' },
  { id: 13, left: '84%', delay: 7.15, dur: 8.7, dx: 40, rot: -240, size: 24, icon: '🌺' },
  { id: 14, left: '11%', delay: 7.70, dur: 8.2, dx: -35, rot: -180, size: 23, icon: '🌸' },
  { id: 15, left: '79%', delay: 8.25, dur: 8.5, dx: 35, rot: 200, size: 25, icon: '🌸' },
];

function OneByOneFallingFlowers() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[18] overflow-hidden">
      {FALLING_FLOWERS.map((fl) => (
        <div
          key={`falling-flower-${fl.id}`}
          className="absolute text-pink-300 drop-shadow-[0_0_12px_rgba(244,63,94,0.9)] select-none"
          style={{
            left: fl.left,
            fontSize: `${fl.size}px`,
            '--dx': `${fl.dx}px`,
            '--rot': `${fl.rot}deg`,
            animation: `oneByOneFlowerFall ${fl.dur}s linear infinite`,
            animationDelay: `${fl.delay}s`,
          }}
        >
          {fl.icon}
        </div>
      ))}
    </div>
  );
}

// ==========================================
// FLYING BUTTERFLIES INSIDE PROPOSAL FRAME
// ==========================================
function FrameButterflies() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[22] overflow-hidden">
      <Butterfly
        pathClass="[animation:flyInside1_11s_ease-in-out_infinite]"
        duration={11}
        wingGradientId="bfGrad1"
        size={28}
      />
      <Butterfly
        pathClass="[animation:flyInside2_13s_ease-in-out_infinite]"
        duration={13}
        delay="1.2s"
        wingGradientId="bfGrad2"
        size={26}
      />
      <Butterfly
        pathClass="[animation:flyInside3_9s_ease-in-out_infinite]"
        duration={9}
        delay="0.6s"
        wingGradientId="bfGrad3"
        size={24}
      />
      <Butterfly
        pathClass="[animation:flyInside4_10s_ease-in-out_infinite]"
        duration={10}
        delay="1.8s"
        wingGradientId="bfGrad4"
        size={25}
      />
      <Butterfly
        pathClass="[animation:flyInside5_15s_ease-in-out_infinite]"
        duration={15}
        delay="2.5s"
        wingGradientId="bfGrad5"
        size={22}
      />
      <Butterfly
        pathClass="[animation:flyInside6_8.5s_ease-in-out_infinite]"
        duration={8.5}
        delay="0.9s"
        wingGradientId="bfGrad6"
        size={24}
      />
      <Butterfly
        pathClass="[animation:flyInside7_9.5s_ease-in-out_infinite]"
        duration={9.5}
        delay="2.1s"
        wingGradientId="bfGrad7"
        size={23}
      />
    </div>
  );
}

// ==========================================
// CINEMATIC ANIMATED FLYING BUTTERFLIES
// ==========================================
function Butterfly({ pathClass, duration, delay = '0s', wingGradientId, size = 32 }) {
  return (
    <div
      className={`absolute pointer-events-none z-[25] ${pathClass}`}
      style={{
        animationDuration: `${duration}s`,
        animationDelay: delay,
      }}
    >
      <div className="relative">
        <svg
          width={size}
          height={Math.round(size * 0.85)}
          viewBox="0 0 34 28"
          className="overflow-visible drop-shadow-[0_0_10px_rgba(236,72,153,0.9)]"
        >
          <defs>
            <linearGradient id={wingGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Left Wing with rapid 3D fluttering */}
          <g
            style={{
              transformOrigin: '17px 14px',
              animation: 'wingFlapLeft 0.22s ease-in-out infinite',
            }}
          >
            <path
              d="M 16,14 C 11,3 3,2 1,7 C -1,13 4,20 16,16 Z"
              fill={`url(#${wingGradientId})`}
              opacity="0.95"
            />
            <path
              d="M 16,15 C 9,18 4,24 6,26 C 9,28 14,24 16,17 Z"
              fill={`url(#${wingGradientId})`}
              opacity="0.85"
            />
            {/* Delicate wing veins */}
            <path
              d="M 16,14 Q 8,8 3,8 M 16,15 Q 9,14 4,16"
              stroke="rgba(255,255,255,0.75)"
              strokeWidth="0.6"
              fill="none"
            />
          </g>

          {/* Central Thorax & Antennae */}
          <ellipse cx="17" cy="15" rx="1.2" ry="7" fill="#ffffff" />
          <circle cx="17" cy="8" r="1.5" fill="#fef08a" />
          <path
            d="M 17,7 Q 15,3 13,2 M 17,7 Q 19,3 21,2"
            stroke="#fef08a"
            strokeWidth="0.6"
            strokeLinecap="round"
            fill="none"
          />

          {/* Right Wing with synchronized 3D fluttering */}
          <g
            style={{
              transformOrigin: '17px 14px',
              animation: 'wingFlapRight 0.22s ease-in-out infinite',
            }}
          >
            <path
              d="M 18,14 C 23,3 31,2 33,7 C 35,13 30,20 18,16 Z"
              fill={`url(#${wingGradientId})`}
              opacity="0.95"
            />
            <path
              d="M 18,15 C 25,18 30,24 28,26 C 25,28 20,24 18,17 Z"
              fill={`url(#${wingGradientId})`}
              opacity="0.85"
            />
            <path
              d="M 18,14 Q 26,8 31,8 M 18,15 Q 25,14 30,16"
              stroke="rgba(255,255,255,0.75)"
              strokeWidth="0.6"
              fill="none"
            />
          </g>
        </svg>
        {/* Tiny trailing sparkle */}
        <span className="absolute -bottom-1 -left-1 text-[8px] text-amber-200 opacity-70 animate-ping">✨</span>
      </div>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function ProposalConfession({ onAccept, onReject, onNext }) {
  // Timeline Stages: 'BLACKOUT' -> 'PHOTO' -> 'SARANYA' -> 'ILOVEYOU' -> 'BUTTONS'
  const [stage, setStage] = useState('BLACKOUT');
  const [echoPhoto, setEchoPhoto] = useState(null);
  const [celebratingYes, setCelebratingYes] = useState(false);

  // Cinematic Heartbeat Integration with unified persistent engine
  const triggerHeartbeat = () => {
    if (window.heartbeatEngine) {
      window.heartbeatEngine.start();
    }
  };

  useEffect(() => {
    // Initial Climax Heartbeat (BPM: 138, Volume: 0.54)
    if (window.heartbeatEngine) {
      window.heartbeatEngine.setTargetBPM(138, 0.54);
    }
    triggerHeartbeat();

    // Phase 2 (1.8s - 2.5s): Memory Echo flashes
    const tEcho1 = setTimeout(() => {
      setEchoPhoto('/sa.jpg');
    }, 1800);
    const tEcho2 = setTimeout(() => {
      setEchoPhoto('/sk.jpg');
    }, 2200);

    // Phase 2 Climax (2.5s): Main Photo Focus (BPM: 142)
    const tPhoto = setTimeout(() => {
      setEchoPhoto(null);
      setStage('PHOTO');
      if (window.heartbeatEngine) {
        window.heartbeatEngine.setTargetBPM(142, 0.56);
      }
    }, 2500);

    // Phase 3 (4.5s): SARANYA text appears (BPM: 145)
    const tSaranya = setTimeout(() => {
      setStage('SARANYA');
      if (window.heartbeatEngine) {
        window.heartbeatEngine.setTargetBPM(145, 0.58);
      }
    }, 4500);

    // Brief 250ms silence immediately before "I LOVE YOU" (Emotional suspense)
    const tSilence = setTimeout(() => {
      if (window.heartbeatEngine) {
        window.heartbeatEngine.silence(250);
      }
    }, 6550);

    // Phase 4 (6.8s): Grand Climax "I LOVE YOU" + Lens Flare
    const tClimax = setTimeout(() => {
      setStage('ILOVEYOU');
      if (window.heartbeatEngine) {
        window.heartbeatEngine.setTargetBPM(148, 0.60);
      }
    }, 6800);

    // Phase 5 (9.8s): Buttons Fade in
    const tButtons = setTimeout(() => {
      setStage('BUTTONS');
      if (window.heartbeatEngine) {
        window.heartbeatEngine.setTargetBPM(142, 0.52);
      }
    }, 9800);

    return () => {
      clearTimeout(tEcho1);
      clearTimeout(tEcho2);
      clearTimeout(tPhoto);
      clearTimeout(tSaranya);
      clearTimeout(tSilence);
      clearTimeout(tClimax);
      clearTimeout(tButtons);
    };
  }, []);

  const handleYesClick = (e) => {
    setCelebratingYes(true);
    if (window.heartbeatEngine) {
      window.heartbeatEngine.setTargetBPM(88, 0.35);
      window.heartbeatEngine.start();
    }
    setTimeout(() => {
      if (typeof onAccept === 'function') {
        onAccept(e);
      } else if (typeof onNext === 'function') {
        onNext(e);
      }
    }, 600);
  };

  const handleNoClick = (e) => {
    if (typeof onReject === 'function') {
      onReject(e);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#03050c] text-slate-100 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden select-none z-[100]">
      
      {/* INLINE CSS FOR CINEMATIC LIGHTING, NAME REVEAL, RAINBOW BORDER, BUTTERFLIES */}
      <style>{`
        /* ====================================================
           1. CONTINUOUS TRAVELLING RAINBOW BORDER LIGHTING
           Travels: TOP -> RIGHT -> BOTTOM -> LEFT -> TOP
           Smooth, elegant, premium - No strobe/flashing
        ==================================================== */
        @keyframes rainbowBorderTravel {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes rainbowHaloGlow {
          0%, 100% {
            box-shadow:
              0 0 25px rgba(244, 63, 94, 0.45),
              0 0 55px rgba(217, 70, 239, 0.35),
              0 0 85px rgba(168, 85, 247, 0.25),
              0 0 120px rgba(251, 191, 36, 0.2);
          }
          33% {
            box-shadow:
              0 0 25px rgba(168, 85, 247, 0.45),
              0 0 55px rgba(59, 130, 246, 0.35),
              0 0 85px rgba(6, 182, 212, 0.25),
              0 0 120px rgba(244, 63, 94, 0.2);
          }
          66% {
            box-shadow:
              0 0 25px rgba(6, 182, 212, 0.45),
              0 0 55px rgba(245, 158, 11, 0.35),
              0 0 85px rgba(244, 63, 94, 0.25),
              0 0 120px rgba(168, 85, 247, 0.2);
          }
        }

        /* ====================================================
           2. STAGGERED NAME REVEAL FROM TREES (ABISHEK & SARANYA)
           Left letters emerge from left tree branches
           Right letters emerge from right tree branches
           Synchronized climax pulse & name glow
        ==================================================== */
        /* LEFT LETTERS (ABISHEK) EMERGING FROM LEFT TREE BRANCHES */
        @keyframes letterDropLeft0 {
          0% { opacity: 0; transform: translateY(-55px) translateX(-28px) rotate(-10deg) scale(0.5); filter: blur(5px); }
          7.0% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          84.5% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          92.0% { opacity: 0; transform: translateY(-8px) scale(0.95); filter: blur(4px); }
          100% { opacity: 0; transform: translateY(-55px) scale(0.5); }
        }
        @keyframes letterDropLeft1 {
          0%, 8.0% { opacity: 0; transform: translateY(-52px) translateX(-24px) rotate(-8deg) scale(0.5); filter: blur(5px); }
          15.0% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          84.5% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          92.0% { opacity: 0; transform: translateY(-8px) scale(0.95); filter: blur(4px); }
          100% { opacity: 0; }
        }
        @keyframes letterDropLeft2 {
          0%, 16.0% { opacity: 0; transform: translateY(-50px) translateX(-20px) rotate(-6deg) scale(0.5); filter: blur(5px); }
          23.0% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          84.5% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          92.0% { opacity: 0; transform: translateY(-8px) scale(0.95); filter: blur(4px); }
          100% { opacity: 0; }
        }
        @keyframes letterDropLeft3 {
          0%, 24.0% { opacity: 0; transform: translateY(-50px) translateX(-16px) rotate(-4deg) scale(0.5); filter: blur(5px); }
          31.0% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          84.5% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          92.0% { opacity: 0; transform: translateY(-8px) scale(0.95); filter: blur(4px); }
          100% { opacity: 0; }
        }
        @keyframes letterDropLeft4 {
          0%, 32.0% { opacity: 0; transform: translateY(-52px) translateX(-12px) rotate(4deg) scale(0.5); filter: blur(5px); }
          39.0% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          84.5% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          92.0% { opacity: 0; transform: translateY(-8px) scale(0.95); filter: blur(4px); }
          100% { opacity: 0; }
        }
        @keyframes letterDropLeft5 {
          0%, 40.0% { opacity: 0; transform: translateY(-54px) translateX(-8px) rotate(6deg) scale(0.5); filter: blur(5px); }
          47.0% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          84.5% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          92.0% { opacity: 0; transform: translateY(-8px) scale(0.95); filter: blur(4px); }
          100% { opacity: 0; }
        }
        @keyframes letterDropLeft6 {
          0%, 48.0% { opacity: 0; transform: translateY(-56px) translateX(-4px) rotate(8deg) scale(0.5); filter: blur(5px); }
          55.0% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          84.5% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          92.0% { opacity: 0; transform: translateY(-8px) scale(0.95); filter: blur(4px); }
          100% { opacity: 0; }
        }

        /* RIGHT LETTERS (SARANYA) EMERGING FROM RIGHT TREE BRANCHES */
        @keyframes letterDropRight0 {
          0%, 4.0% { opacity: 0; transform: translateY(-55px) translateX(28px) rotate(10deg) scale(0.5); filter: blur(5px); }
          11.0% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          84.5% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          92.0% { opacity: 0; transform: translateY(-8px) scale(0.95); filter: blur(4px); }
          100% { opacity: 0; }
        }
        @keyframes letterDropRight1 {
          0%, 12.0% { opacity: 0; transform: translateY(-52px) translateX(24px) rotate(8deg) scale(0.5); filter: blur(5px); }
          19.0% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          84.5% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          92.0% { opacity: 0; transform: translateY(-8px) scale(0.95); filter: blur(4px); }
          100% { opacity: 0; }
        }
        @keyframes letterDropRight2 {
          0%, 20.0% { opacity: 0; transform: translateY(-50px) translateX(20px) rotate(6deg) scale(0.5); filter: blur(5px); }
          27.0% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          84.5% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          92.0% { opacity: 0; transform: translateY(-8px) scale(0.95); filter: blur(4px); }
          100% { opacity: 0; }
        }
        @keyframes letterDropRight3 {
          0%, 28.0% { opacity: 0; transform: translateY(-50px) translateX(16px) rotate(-4deg) scale(0.5); filter: blur(5px); }
          35.0% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          84.5% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          92.0% { opacity: 0; transform: translateY(-8px) scale(0.95); filter: blur(4px); }
          100% { opacity: 0; }
        }
        @keyframes letterDropRight4 {
          0%, 36.0% { opacity: 0; transform: translateY(-52px) translateX(12px) rotate(-6deg) scale(0.5); filter: blur(5px); }
          43.0% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          84.5% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          92.0% { opacity: 0; transform: translateY(-8px) scale(0.95); filter: blur(4px); }
          100% { opacity: 0; }
        }
        @keyframes letterDropRight5 {
          0%, 44.0% { opacity: 0; transform: translateY(-54px) translateX(8px) rotate(-8deg) scale(0.5); filter: blur(5px); }
          51.0% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          84.5% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          92.0% { opacity: 0; transform: translateY(-8px) scale(0.95); filter: blur(4px); }
          100% { opacity: 0; }
        }
        @keyframes letterDropRight6 {
          0%, 52.0% { opacity: 0; transform: translateY(-56px) translateX(4px) rotate(-10deg) scale(0.5); filter: blur(5px); }
          59.0% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          84.5% { opacity: 1; transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: blur(0px); }
          92.0% { opacity: 0; transform: translateY(-8px) scale(0.95); filter: blur(4px); }
          100% { opacity: 0; }
        }

        /* Synchronized Radiance Pulse for Assembled Name */
        @keyframes wordSynchronizedPulse {
          0%, 61% {
            opacity: 0.95;
            transform: scale(1);
          }
          63%, 80% {
            opacity: 1;
            transform: scale(1.08);
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.95)) drop-shadow(0 0 35px rgba(244,63,94,1)) drop-shadow(0 0 65px rgba(251,191,36,0.95)) drop-shadow(0 0 95px rgba(236,72,153,0.85));
          }
          84.5% {
            opacity: 1;
            transform: scale(1);
          }
          92%, 100% {
            opacity: 0;
            transform: scale(0.95);
            filter: blur(4px);
          }
        }
        @keyframes filigreeGlow {
          0%, 45% { opacity: 0; transform: scaleX(0.4); }
          50%, 82% { opacity: 1; transform: scaleX(1); filter: drop-shadow(0 0 10px rgba(251,191,36,0.95)); }
          88%, 100% { opacity: 0; transform: scaleX(0.4); }
        }

        @keyframes nameClimaxBurst {
          0%, 62% { opacity: 0; transform: scale(0.5); }
          65%, 79% { opacity: 1; transform: scale(1.25); filter: drop-shadow(0 0 14px rgba(251,191,36,0.95)); }
          83%, 100% { opacity: 0; transform: scale(0.6); }
        }

        /* ====================================================
           3. ONE-BY-ONE FALLING FLOWERS FROM UPPER AREA
           Flowers drift from top to bottom across proposal frame
        ==================================================== */
        @keyframes oneByOneFlowerFall {
          0% {
            top: -8%;
            opacity: 0;
            transform: translateX(0px) rotate(0deg) scale(0.7);
          }
          12% {
            opacity: 0.95;
            transform: translateX(calc(var(--dx) * 0.25)) rotate(calc(var(--rot) * 0.25)) scale(0.95);
          }
          50% {
            opacity: 1;
            transform: translateX(calc(var(--dx) * 0.7)) rotate(calc(var(--rot) * 0.65)) scale(1.05);
            filter: drop-shadow(0 0 12px rgba(244,63,94,0.85));
          }
          85% {
            opacity: 0.85;
            transform: translateX(var(--dx)) rotate(calc(var(--rot) * 0.9)) scale(0.95);
          }
          100% {
            top: 108%;
            opacity: 0;
            transform: translateX(calc(var(--dx) * 1.25)) rotate(var(--rot)) scale(0.7);
            filter: drop-shadow(0 0 0px transparent);
          }
        }

        /* Branch Travelling Light Runner */
        @keyframes branchLightTravel {
          0% { stroke-dashoffset: 400; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { stroke-dashoffset: -400; opacity: 0; }
        }

        /* Flower Clusters Subtle Breathing Pulse */
        @keyframes flowerClusterBreathe {
          0%, 100% { opacity: 0.88; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.04); filter: drop-shadow(0 0 12px rgba(244,63,94,0.85)); }
        }

        /* Frame Internal Butterflies Flight Curves (Smooth percentage waypoint interpolation) */
        @keyframes flyInside1 {
          0% { left: 6%; top: 68%; transform: rotate(18deg) scale(0.85); }
          25% { left: 24%; top: 32%; transform: rotate(-8deg) scale(0.98); }
          50% { left: 16%; top: 16%; transform: rotate(22deg) scale(1.05); }
          75% { left: 9%; top: 42%; transform: rotate(-15deg) scale(0.9); }
          100% { left: 6%; top: 68%; transform: rotate(18deg) scale(0.85); }
        }
        @keyframes flyInside2 {
          0% { left: 88%; top: 65%; transform: rotate(-16deg) scale(0.88); }
          30% { left: 72%; top: 28%; transform: rotate(14deg) scale(1); }
          60% { left: 84%; top: 15%; transform: rotate(-24deg) scale(0.95); }
          85% { left: 91%; top: 44%; transform: rotate(18deg) scale(0.85); }
          100% { left: 88%; top: 65%; transform: rotate(-16deg) scale(0.88); }
        }
        @keyframes flyInside3 {
          0% { left: 14%; top: 40%; transform: rotate(-14deg) scale(0.8); }
          35% { left: 26%; top: 18%; transform: rotate(12deg) scale(0.92); }
          65% { left: 18%; top: 58%; transform: rotate(-18deg) scale(1); }
          85% { left: 8%; top: 30%; transform: rotate(15deg) scale(0.85); }
          100% { left: 14%; top: 40%; transform: rotate(-14deg) scale(0.8); }
        }
        @keyframes flyInside4 {
          0% { left: 82%; top: 42%; transform: rotate(14deg) scale(0.82); }
          30% { left: 68%; top: 22%; transform: rotate(-10deg) scale(0.94); }
          65% { left: 80%; top: 55%; transform: rotate(20deg) scale(1); }
          85% { left: 89%; top: 28%; transform: rotate(-15deg) scale(0.88); }
          100% { left: 82%; top: 42%; transform: rotate(14deg) scale(0.82); }
        }
        @keyframes flyInside5 {
          0% { left: 22%; top: 12%; transform: rotate(8deg) scale(0.75); }
          35% { left: 45%; top: 7%; transform: rotate(-6deg) scale(0.85); }
          70% { left: 72%; top: 11%; transform: rotate(10deg) scale(0.8); }
          85% { left: 52%; top: 8%; transform: rotate(-8deg) scale(0.78); }
          100% { left: 22%; top: 12%; transform: rotate(8deg) scale(0.75); }
        }
        @keyframes flyInside6 {
          0% { left: 10%; top: 22%; transform: rotate(-10deg) scale(0.78); }
          30% { left: 20%; top: 14%; transform: rotate(15deg) scale(0.88); }
          60% { left: 28%; top: 26%; transform: rotate(-12deg) scale(0.82); }
          85% { left: 15%; top: 34%; transform: rotate(8deg) scale(0.75); }
          100% { left: 10%; top: 22%; transform: rotate(-10deg) scale(0.78); }
        }
        @keyframes flyInside7 {
          0% { left: 86%; top: 24%; transform: rotate(12deg) scale(0.78); }
          30% { left: 76%; top: 15%; transform: rotate(-15deg) scale(0.88); }
          60% { left: 68%; top: 28%; transform: rotate(10deg) scale(0.82); }
          85% { left: 80%; top: 35%; transform: rotate(-8deg) scale(0.75); }
          100% { left: 86%; top: 24%; transform: rotate(12deg) scale(0.78); }
        }

        /* ====================================================
           3. TREE DECORATIONS: SWAYING LANTERNS & FAIRY LIGHTS
        ==================================================== */
        @keyframes lanternSway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes fairyTwinkle {
          0%, 100% { opacity: 0.35; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.25); filter: drop-shadow(0 0 8px rgba(254,240,138,0.95)); }
        }

        /* ====================================================
           4. ANIMATED BUTTERFLIES: WING FLAPS & FLIGHT PATHS
        ==================================================== */
        @keyframes wingFlapLeft {
          0%, 100% { transform: scaleX(1) rotate(0deg); }
          50% { transform: scaleX(0.18) rotate(16deg); }
        }
        @keyframes wingFlapRight {
          0%, 100% { transform: scaleX(1) rotate(0deg); }
          50% { transform: scaleX(0.18) rotate(-16deg); }
        }

        @keyframes flyPath1 {
          0% { transform: translate(5vw, 16vh) rotate(12deg) scale(0.85); }
          25% { transform: translate(16vw, 26vh) rotate(24deg) scale(0.95); }
          50% { transform: translate(9vw, 40vh) rotate(-10deg) scale(1); }
          75% { transform: translate(3vw, 28vh) rotate(-22deg) scale(0.9); }
          100% { transform: translate(5vw, 16vh) rotate(12deg) scale(0.85); }
        }
        @keyframes flyPath2 {
          0% { transform: translate(88vw, 20vh) rotate(-14deg) scale(0.9); }
          30% { transform: translate(77vw, 34vh) rotate(-28deg) scale(1); }
          60% { transform: translate(85vw, 48vh) rotate(15deg) scale(0.95); }
          85% { transform: translate(93vw, 32vh) rotate(22deg) scale(0.88); }
          100% { transform: translate(88vw, 20vh) rotate(-14deg) scale(0.9); }
        }
        @keyframes flyPath3 {
          0% { transform: translate(7vw, 76vh) rotate(-15deg) scale(0.8); }
          35% { transform: translate(13vw, 54vh) rotate(8deg) scale(0.92); }
          65% { transform: translate(17vw, 34vh) rotate(-12deg) scale(1); }
          85% { transform: translate(9vw, 58vh) rotate(18deg) scale(0.85); }
          100% { transform: translate(7vw, 76vh) rotate(-15deg) scale(0.8); }
        }
        @keyframes flyPath4 {
          0% { transform: translate(91vw, 74vh) rotate(14deg) scale(0.85); }
          30% { transform: translate(83vw, 50vh) rotate(-10deg) scale(0.95); }
          65% { transform: translate(87vw, 30vh) rotate(18deg) scale(1); }
          85% { transform: translate(93vw, 54vh) rotate(-14deg) scale(0.9); }
          100% { transform: translate(91vw, 74vh) rotate(14deg) scale(0.85); }
        }
        @keyframes flyPath5 {
          0% { transform: translate(22vw, 8vh) rotate(10deg) scale(0.75); }
          30% { transform: translate(42vw, 6vh) rotate(-5deg) scale(0.85); }
          60% { transform: translate(68vw, 8vh) rotate(12deg) scale(0.8); }
          80% { transform: translate(46vw, 10vh) rotate(-8deg) scale(0.78); }
          100% { transform: translate(22vw, 8vh) rotate(10deg) scale(0.75); }
        }
        @keyframes flyPath6 {
          0% { transform: translate(14vw, 24vh) rotate(-8deg) scale(0.95); }
          25% { transform: translate(16vw, 20vh) rotate(6deg) scale(1.05); }
          50% { transform: translate(12vw, 26vh) rotate(-14deg) scale(0.9); }
          75% { transform: translate(15vw, 28vh) rotate(10deg) scale(1); }
          100% { transform: translate(14vw, 24vh) rotate(-8deg) scale(0.95); }
        }

        /* ====================================================
           5. FLOATING HEARTS & DRAPING SAKURA PETALS
        ==================================================== */
        @keyframes floatingHeartDrift {
          0% { transform: translateY(105vh) translateX(0px) scale(0.7) rotate(-6deg); opacity: 0; }
          15% { opacity: 0.85; }
          50% { transform: translateY(52vh) translateX(24px) scale(0.92) rotate(8deg); }
          85% { opacity: 0.85; }
          100% { transform: translateY(-10vh) translateX(-18px) scale(1.08) rotate(-12deg); opacity: 0; }
        }
        @keyframes petalCascadingTwirl {
          0% { transform: translateY(-8vh) translateX(0px) rotate(0deg) scale(0.75); opacity: 0; }
          15% { opacity: 0.85; }
          50% { transform: translateY(52vh) translateX(36px) rotate(190deg) scale(0.95); }
          85% { opacity: 0.75; }
          100% { transform: translateY(108vh) translateX(12px) rotate(380deg) scale(1.1); opacity: 0; }
        }

        /* ====================================================
           6. EXISTING LIGHTING & CINEMATIC EFFECTS
        ==================================================== */
        @keyframes edgeGlowCycle {
          0% { box-shadow: inset 0 0 90px rgba(244,63,94,0.32), inset 0 0 170px rgba(251,191,36,0.18); }
          33% { box-shadow: inset 0 0 90px rgba(168,85,247,0.32), inset 0 0 170px rgba(236,72,153,0.22); }
          66% { box-shadow: inset 0 0 90px rgba(6,182,212,0.28), inset 0 0 170px rgba(99,102,241,0.22); }
          100% { box-shadow: inset 0 0 90px rgba(244,63,94,0.32), inset 0 0 170px rgba(251,191,36,0.18); }
        }
        @keyframes ambientBackdropPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.58; transform: scale(1.03); }
        }
        @keyframes lensFlareSweep {
          0% { transform: translateX(-150%) skewX(-25deg); opacity: 0; }
          40% { opacity: 0.9; }
          100% { transform: translateX(200%) skewX(-25deg); opacity: 0; }
        }
        @keyframes shimmerText {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes lightRayDrift {
          0%, 100% { transform: rotate(14deg) translateY(0px) scale(1); opacity: 0.18; }
          50% { transform: rotate(18deg) translateY(-20px) scale(1.05); opacity: 0.28; }
        }
        @keyframes lightLeakDrift {
          0%, 100% { opacity: 0.22; transform: translate(0, 0) scale(1); }
          50% { opacity: 0.38; transform: translate(25px, -15px) scale(1.1); }
        }
        @keyframes breathingAura {
          0%, 100% { box-shadow: 0 0 35px rgba(244,63,94,0.65), 0 0 70px rgba(251,191,36,0.35); transform: scale(1); }
          50% { box-shadow: 0 0 55px rgba(244,63,94,0.9), 0 0 90px rgba(251,191,36,0.55); transform: scale(1.03); }
        }
        .cinematic-edge {
          animation: edgeGlowCycle 10s ease-in-out infinite;
        }
        .hero-text-shimmer {
          background-size: 200% auto;
          animation: shimmerText 6s linear infinite;
        }
        .ray-drift {
          animation: lightRayDrift 12s ease-in-out infinite;
        }
        .light-leak-glow {
          animation: lightLeakDrift 9s ease-in-out infinite;
        }
        .breathing-yes {
          animation: breathingAura 3s ease-in-out infinite;
        }
      `}</style>

      {/* SVG NOISE FILTER FOR AUTHENTIC SUBTLE FILM GRAIN */}
      <svg className="hidden">
        <filter id="cinematic-film-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        className="absolute inset-0 pointer-events-none z-30 opacity-[0.035] mix-blend-overlay"
        style={{ filter: 'url(#cinematic-film-grain)' }}
      />

      {/* 1. CINEMATIC AMBIENT LIGHTING & SCREEN-EDGE VIGNETTE */}
      <div className="absolute inset-0 cinematic-edge pointer-events-none z-20" />
      
      {/* Radial Vignette outside the photo */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(3,5,12,0.6) 75%, rgba(3,5,12,0.98) 100%)',
        }}
      />
      
      {/* Warm Edge Light Leaks (Rose/Gold) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-amber-400/20 via-rose-500/20 to-transparent blur-3xl pointer-events-none z-20 light-leak-glow" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-tl from-pink-500/20 via-purple-600/15 to-transparent blur-3xl pointer-events-none z-20 light-leak-glow" />

      {/* Diagonal Cinematic Lens Rays */}
      <div className="absolute -inset-20 opacity-20 pointer-events-none z-20 mix-blend-screen bg-gradient-to-tr from-transparent via-rose-300/15 to-amber-200/25 blur-3xl ray-drift" />
      <div className="absolute -inset-10 opacity-15 pointer-events-none z-20 mix-blend-screen bg-gradient-to-bl from-transparent via-pink-400/10 to-indigo-300/15 blur-2xl ray-drift [animation-delay:4s]" />

      {/* Subtle Ambient Rose/Gold Light behind the Photo Frame */}
      <div
        className={`absolute w-full max-w-5xl lg:max-w-6xl h-[60vh] sm:h-[66vh] md:h-[72vh] rounded-[36px] bg-gradient-to-r from-rose-600/20 via-amber-500/15 to-pink-600/20 blur-3xl pointer-events-none transition-opacity duration-1000 -z-10 ${
          stage === 'BLACKOUT' ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ animation: 'ambientBackdropPulse 4s ease-in-out infinite' }}
      />

      {/* ====================================================
          2. CINEMATIC FLYING BUTTERFLIES (Real Wing Flutter)
      ==================================================== */}
      <Butterfly
        pathClass="[animation:flyPath1_13s_ease-in-out_infinite]"
        duration={13}
        wingGradientId="bfGrad1"
        size={34}
      />
      <Butterfly
        pathClass="[animation:flyPath2_15s_ease-in-out_infinite]"
        duration={15}
        delay="1.5s"
        wingGradientId="bfGrad2"
        size={32}
      />
      <Butterfly
        pathClass="[animation:flyPath3_11s_ease-in-out_infinite]"
        duration={11}
        delay="0.7s"
        wingGradientId="bfGrad3"
        size={28}
      />
      <Butterfly
        pathClass="[animation:flyPath4_14s_ease-in-out_infinite]"
        duration={14}
        delay="2.2s"
        wingGradientId="bfGrad4"
        size={30}
      />
      <Butterfly
        pathClass="[animation:flyPath5_18s_ease-in-out_infinite]"
        duration={18}
        delay="3.0s"
        wingGradientId="bfGrad5"
        size={26}
      />
      <Butterfly
        pathClass="[animation:flyPath6_9s_ease-in-out_infinite]"
        duration={9}
        delay="0.4s"
        wingGradientId="bfGrad6"
        size={32}
      />

      {/* ====================================================
          5. FLOATING HEARTS & CASCADING SAKURA PETALS
      ==================================================== */}
      <div className="absolute inset-0 pointer-events-none z-[16] overflow-hidden">
        {/* Floating Romantic Glowing Hearts (Left & Right Flanks) */}
        {[
          { left: '4%', delay: '0s', dur: '9.5s', size: 'text-rose-400 text-xl' },
          { left: '12%', delay: '2.5s', dur: '11s', size: 'text-pink-400 text-base' },
          { left: '19%', delay: '4.8s', dur: '10s', size: 'text-amber-300 text-lg' },
          { left: '78%', delay: '1.2s', dur: '10.5s', size: 'text-rose-400 text-lg' },
          { left: '85%', delay: '3.6s', dur: '12s', size: 'text-pink-300 text-xl' },
          { left: '92%', delay: '5.2s', dur: '9s', size: 'text-amber-200 text-base' },
        ].map((heart, hi) => (
          <div
            key={`flt-heart-${hi}`}
            className={`absolute ${heart.size} drop-shadow-[0_0_12px_rgba(244,63,94,0.9)]`}
            style={{
              left: heart.left,
              animation: `floatingHeartDrift ${heart.dur} linear infinite`,
              animationDelay: heart.delay,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* ====================================================
          6. WIDE LANDSCAPE CINEMATIC PHOTO FRAME
             UPGRADED WITH CONTINUOUS TRAVELLING RAINBOW BORDER
             (PHOTO, DIMENSIONS, CROPS, AND FACES UNCHANGED)
      ==================================================== */}
      <div
        className={`relative w-[96vw] max-w-5xl lg:max-w-6xl h-[60vh] sm:h-[66vh] md:h-[72vh] max-h-[720px] transition-all duration-1000 z-20 ${
          stage === 'BLACKOUT' ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {/* Animated Multi-Layer Travelling Rainbow Border Container */}
        <div
          className="relative w-full h-full rounded-2xl sm:rounded-3xl p-[3px] md:p-[3.5px] overflow-hidden"
          style={{
            animation: 'rainbowHaloGlow 8s ease-in-out infinite',
          }}
        >
          {/* Laser Travelling Rainbow Border */}
          <CinematicRainbowBorder mode="card" borderRadius={24} />
          {/* Continuous Rotating Rainbow Conic Gradient Base */}
          <div
            className="absolute -inset-[150%] pointer-events-none opacity-85"
            style={{
              background:
                'conic-gradient(from 0deg, #f43f5e 0deg, #ec4899 45deg, #d946ef 90deg, #a855f7 135deg, #3b82f6 180deg, #06b6d4 225deg, #8b5cf6 270deg, #fbbf24 315deg, #f43f5e 360deg)',
              animation: 'rainbowBorderTravel 6s linear infinite',
            }}
          />

          {/* Travelling High-Intensity Magical Light Sweep (Visibly Travels TOP -> RIGHT -> BOTTOM -> LEFT -> TOP) */}
          <div
            className="absolute -inset-[150%] pointer-events-none opacity-90 mix-blend-screen"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(255,255,255,0.3) 315deg, rgba(255,255,255,0.98) 348deg, #f43f5e 360deg)',
              animation: 'rainbowBorderTravel 6s linear infinite',
            }}
          />

          {/* Inner Photo Stage - Untouched Dimensions & Behavior */}
          <div className="relative w-full h-full rounded-[13px] sm:rounded-[21px] overflow-hidden bg-[#04060e] flex items-center justify-center">
            
            {/* Ambient Blurred Base (Fills wide landscape aspect ratio with matching atmosphere) */}
            <img
              src="/as.jpg"
              alt="Ambient Landscape Fill"
              className="absolute inset-0 w-full h-full object-cover filter blur-2xl md:blur-3xl scale-110 opacity-35 select-none pointer-events-none"
            />

            {/* Memory Flash Echoes (/sa.jpg & /sk.jpg) */}
            {echoPhoto && (
              <img
                src={echoPhoto}
                alt="Echo Memory"
                className="absolute inset-0 w-full h-full object-cover filter blur-lg opacity-30 mix-blend-screen transition-opacity duration-300 animate-pulse pointer-events-none z-10"
              />
            )}

            {/* ====================================================
                TREES & NAME REVEALS POSITIONED INSIDE PROPOSAL FRAME
            ==================================================== */}
            {/* LEFT TREE + ABISHEK NAME REVEAL (Inside Left Empty Space) */}
            <LeftCinematicTree />
            <CinematicNameReveal name="ABISHEK" side="left" />

            {/* RIGHT TREE + SARANYA NAME REVEAL (Inside Right Empty Space) */}
            <RightCinematicTree />
            <CinematicNameReveal name="SARANYA" side="right" />

            {/* FLOWERS FALLING FROM TOP ONE-BY-ONE */}
            <OneByOneFallingFlowers />

            {/* FLYING BUTTERFLIES INSIDE FRAME */}
            <FrameButterflies />

            {/* Crystal-Clear Sharp Foreground Photograph (Zero blur, both faces clearly visible & preserved) */}
            <div className="relative z-20 w-full h-full flex items-center justify-center pointer-events-none p-1 sm:p-3">
              <img
                src="/as.jpg"
                alt="Saranya & Abishek"
                className="w-full h-full object-contain object-center select-none"
                style={{
                  filter: 'contrast(1.05) brightness(1.02) saturate(1.06)',
                  dropShadow: '0 0 40px rgba(0,0,0,0.85)',
                }}
              />
            </div>

            {/* Subtle Vignette at bottom edge of frame for text contrast without darkening faces */}
            <div
              className="absolute inset-x-0 bottom-0 h-40 sm:h-52 pointer-events-none z-20"
              style={{
                background: 'linear-gradient(to top, rgba(3,5,12,0.88) 0%, rgba(3,5,12,0.45) 45%, transparent 100%)',
              }}
            />

            {/* SARANYA REVEAL (Phase 3) */}
            {stage === 'SARANYA' && (
              <div className="absolute inset-x-0 bottom-8 sm:bottom-12 z-30 flex flex-col items-center justify-center animate-in fade-in zoom-in-90 duration-700">
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-[0.35em] bg-gradient-to-r from-amber-200 via-rose-300 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] drop-shadow-[0_0_35px_rgba(244,63,94,0.9)] animate-pulse">
                  SARANYA
                </h2>
                <div className="w-20 h-0.5 bg-rose-500/50 mt-3 rounded-full blur-xs animate-pulse" />
              </div>
            )}

            {/* "I LOVE YOU" + SUBTITLE + BUTTONS (Phase 4 & 5) */}
            {(stage === 'ILOVEYOU' || stage === 'BUTTONS') && (
              <div className="absolute inset-x-0 bottom-2 sm:bottom-4 md:bottom-6 z-30 flex flex-col items-center justify-center text-center px-4 space-y-1.5 sm:space-y-2.5 max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-1000">
                
                {/* Hero "I LOVE YOU" with Lens Flare Sweep & Micro-Shimmer */}
                <div className="relative overflow-hidden px-4 py-1">
                  <h1 className="hero-text-shimmer text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-black tracking-wider bg-gradient-to-r from-amber-200 via-rose-200 to-pink-300 bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)] drop-shadow-[0_0_35px_rgba(244,63,94,0.75)]">
                    I LOVE YOU
                  </h1>
                  {/* Cinematic Lens Flare Streak */}
                  <div
                    className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
                    style={{ animation: 'lensFlareSweep 1.8s ease-out' }}
                  />
                </div>

                {/* Proposal Subtitle */}
                <div className="space-y-0.5">
                  <p className="text-pink-300 font-serif text-base sm:text-lg md:text-xl tracking-widest italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                    Saranya...
                  </p>
                  <p className="text-slate-100 font-serif text-base sm:text-xl md:text-2xl font-medium tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                    "Saranya, will you be mine forever and ever? 💍✨"
                  </p>
                </div>

                {/* 7. DELAYED BUTTONS (Phase 5) */}
                <div
                  className={`pt-2 sm:pt-4 flex items-center justify-center gap-4 sm:gap-6 transition-all duration-1000 ${
                    stage === 'BUTTONS'
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 translate-y-6 pointer-events-none'
                  }`}
                >
                  {/* YES BUTTON with Breathing Aura & Click Celebration */}
                  <button
                    onClick={handleYesClick}
                    disabled={celebratingYes}
                    className="breathing-yes px-8 sm:px-10 py-3 sm:py-3.5 rounded-full font-bold text-white text-sm sm:text-base md:text-lg bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 hover:opacity-95 shadow-[0_0_40px_rgba(244,63,94,0.6)] transform hover:scale-105 active:scale-95 transition-all duration-300 group flex items-center gap-2 cursor-pointer"
                  >
                    <span>Yes, Forever! 💍✨</span>
                  </button>

                  {/* NO BUTTON (Pure Choice, Functional & Clean) */}
                  <button
                    onClick={handleNoClick}
                    disabled={celebratingYes}
                    className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-full font-medium text-slate-300 text-xs sm:text-sm md:text-base bg-slate-900/80 border border-slate-700/80 hover:border-pink-500/40 backdrop-blur-md hover:text-white transition-all duration-300 cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
                  >
                    No 🤍
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* 7. BLACKOUT PULSE (Phase 1) */}
      {stage === 'BLACKOUT' && (
        <div className="relative z-40 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-rose-500/35 blur-xl animate-ping" />
        </div>
      )}

      {/* 8. YES CELEBRATION BURST OVERLAY */}
      {celebratingYes && (
        <div className="absolute inset-0 bg-rose-500/20 backdrop-blur-xs z-50 pointer-events-none flex items-center justify-center animate-in fade-in duration-500">
          <div className="text-6xl animate-ping">💖</div>
        </div>
      )}

    </div>
  );
}

export { ProposalConfession as ProposalScene };
