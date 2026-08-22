import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Sparkles } from 'lucide-react';
import ThreeDHeartBackground from './ThreeDHeartBackground';
import { useSound } from '../context/SoundContext';

export default function ProposalConfession({ onAccept }) {
  const { playCelebrationTrack } = useSound();
  const leftCanvasRef = useRef(null);
  const rightCanvasRef = useRef(null);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  const handleYes = () => {
    playCelebrationTrack();
    onAccept();
  };

  // Background Three.js Particle Heart Generator
  useEffect(() => {
    const initHeartCanvas = (canvas) => {
      if (!canvas) return;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      camera.position.z = 35;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(220, 220);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Parametric Heart Particles
      const particleCount = 1800;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const t = Math.PI * 2 * Math.random();
        // Mathematical Heart Curve
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        const z = (Math.random() - 0.5) * 6;

        positions[i * 3] = (x + (Math.random() - 0.5) * 1.5) * 0.9;
        positions[i * 3 + 1] = (y + (Math.random() - 0.5) * 1.5) * 0.9;
        positions[i * 3 + 2] = z;

        // Rose / Golden tint
        colors[i * 3] = 0.98;
        colors[i * 3 + 1] = 0.2 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.5 + Math.random() * 0.4;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      let animId;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        points.rotation.y += 0.008;
        points.rotation.z += 0.003;
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(animId);
        renderer.dispose();
      };
    };

    const cleanupLeft = initHeartCanvas(leftCanvasRef.current);
    const cleanupRight = initHeartCanvas(rightCanvasRef.current);

    return () => {
      if (cleanupLeft) cleanupLeft();
      if (cleanupRight) cleanupRight();
    };
  }, []);

  const moveNoButton = () => {
    const randomX = (Math.random() - 0.5) * 220;
    const randomY = (Math.random() - 0.5) * 180;
    setNoPos({ x: randomX, y: randomY });
  };

  return (
    <div className="relative min-h-[550px] w-full flex flex-col items-center justify-center bg-black/40 overflow-hidden px-4 select-none rounded-3xl border border-rose-500/10">

      {/* CENTER 3D HEART PRESERVATION */}
      <ThreeDHeartBackground />

      {/* LEFT THREE.JS PARTICLE HEART */}
      <div className="absolute left-2 sm:left-10 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 filter drop-shadow-[0_0_20px_rgba(244,63,94,0.6)]">
        <canvas ref={leftCanvasRef} className="w-40 h-40 sm:w-56 sm:h-56" />
      </div>

      {/* RIGHT THREE.JS PARTICLE HEART */}
      <div className="absolute right-2 sm:right-10 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 filter drop-shadow-[0_0_20px_rgba(244,63,94,0.6)]">
        <canvas ref={rightCanvasRef} className="w-40 h-40 sm:w-56 sm:h-56" />
      </div>

      {/* PROPOSAL CONTAINER WRAPPER - FULL VISIBILITY */}
      <div className="relative z-20 w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center px-2 py-4 select-none">

        {/* STRICT STAGGERED SEQUENTIAL "I LOVE YOU" */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-black tracking-normal sm:tracking-wider mb-6 whitespace-nowrap overflow-visible">
          
          {/* 1. "I" (Left -> In | Pure 24K Radiant Gold | Delay: 0.3s) */}
          <motion.span
            initial={{ opacity: 0, x: -120, scale: 0.7 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-600 drop-shadow-[0_0_35px_rgba(250,204,21,1)]"
          >
            I
          </motion.span>

          {/* 2. "LOVE" (Top -> In | Ruby Rose Neon | Delay: 1.4s) */}
          <motion.span
            initial={{ opacity: 0, y: -120, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-red-600 drop-shadow-[0_0_40px_rgba(244,63,94,1)] mx-1"
          >
            LOVE
          </motion.span>

          {/* 3. "YOU" (Right -> In | Pure 24K Radiant Gold | Delay: 2.5s) */}
          <motion.span
            initial={{ opacity: 0, x: 120, scale: 0.7 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 2.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-600 drop-shadow-[0_0_35px_rgba(250,204,21,1)]"
          >
            YOU
          </motion.span>

        </div>

        {/* SUBTITLE */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 3.2 }}
          className="text-sm sm:text-lg md:text-xl font-serif italic text-rose-100 drop-shadow-[0_0_15px_rgba(244,63,94,0.6)] mb-8 px-4"
        >
          "Saranya, will you be mine forever and ever? 💍✨"
        </motion.p>

        {/* PROPOSAL ACTION BUTTONS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 min-h-[90px] w-full"
        >
          {/* YES BUTTON */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleYes}
            className="px-10 py-4 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white font-serif font-bold text-lg shadow-[0_0_35px_rgba(244,63,94,0.6)] flex items-center gap-2 cursor-pointer z-10"
          >
            <span>YES 💖</span>
            <Sparkles className="w-4 h-4"/>
          </motion.button>

          {/* EVASIVE NO BUTTON */}
          <motion.button
            animate={{ x: noPos.x, y: noPos.y }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
            onMouseEnter={moveNoButton}
            onTouchStart={moveNoButton}
            onClick={moveNoButton}
            className="px-6 py-2.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-zinc-500 text-xs font-mono hover:bg-zinc-800 cursor-pointer"
          >
            No 🥺
          </motion.button>
        </motion.div>
      </div>

      {/* BOTTOM-RIGHT CRYING TOY WITH 'PLEASE GIVE YES' BOARD */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, type: "spring" }}
        className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-30 flex flex-col items-center pointer-events-none"
      >
        {/* Held Board */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-950/90 to-black border border-rose-400/40 text-rose-300 text-xs font-mono font-semibold shadow-[0_0_15px_rgba(244,114,182,0.4)] mb-1"
        >
          Please give YES 🥺👉👈
        </motion.div>

        {/* Crying Mascot / Toy */}
        <div className="relative">
          <motion.div
            animate={{
              rotate: [-4, 4, -4],
              scale: [1, 1.05, 1],
            }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="text-4xl sm:text-5xl filter drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]"
          >
            🧸😭
          </motion.div>

          {/* Animated Falling Tears */}
          <motion.span
            animate={{ y: [0, 18], opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "easeIn" }}
            className="absolute -bottom-1 left-2 text-xs"
          >
            💧
          </motion.span>
          <motion.span
            animate={{ y: [0, 18], opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: 0.4, ease: "easeIn" }}
            className="absolute -bottom-1 right-2 text-xs"
          >
            💧
          </motion.span>
        </div>
      </motion.div>

    </div>
  );
}
