import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { useSound } from '../context/SoundContext';
import photoHeart from '../assets/mem-01.jpg';

export default function ProposalConfession({ onNext, onAccept }) {
  const mountRef = useRef(null);
  const { playCelebrationTrack } = useSound();

  const handleYes = () => {
    if (typeof playCelebrationTrack === 'function') {
      playCelebrationTrack();
    }
    if (typeof onAccept === 'function') {
      onAccept();
    } else if (typeof onNext === 'function') {
      onNext();
    }
  };

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Setup Scene, Camera, and Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      5000
    );
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 2. Generate Heart Geometry using Mathematical Formulas
    const particleCount = 3500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const t = Math.PI * 2 * (i / particleCount);
      let x = 16 * Math.pow(Math.sin(t), 3);
      let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      let z = (Math.random() - 0.5) * 10;

      const scale = 12;
      positions[i * 3] = x * scale;
      positions[i * 3 + 1] = y * scale;
      positions[i * 3 + 2] = z * scale;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // 3. Create Particle Texture and Material
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 16;
    pCanvas.height = 16;
    const ctx = pCanvas.getContext('2d');
    const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 16, 16);
    const texture = new THREE.CanvasTexture(pCanvas);

    const material = new THREE.PointsMaterial({
      color: 0xea80b0,
      size: 4,
      map: texture,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    });

    const heartParticles = new THREE.Points(geometry, material);
    scene.add(heartParticles);

    // 4. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      heartParticles.rotation.y += 0.006;
      heartParticles.rotation.z = Math.sin(Date.now() * 0.001) * 0.08;
      renderer.render(scene, camera);
    };
    animate();

    // 5. Handle Window Resizing
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-black text-center select-none overflow-hidden z-30">
      
      {/* Responsive SVG ClipPath Definition for Heart Shape */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.5, 0.28 C 0.5, 0.28, 0.62, 0.05, 0.81, 0.05 C 0.93, 0.05, 1, 0.18, 1, 0.33 C 1, 0.55, 0.78, 0.78, 0.5, 0.95 C 0.22, 0.78, 0, 0.55, 0, 0.33 C 0, 0.18, 0.07, 0.05, 0.19, 0.05 C 0.38, 0.05, 0.5, 0.28, 0.5, 0.28 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* THREE.JS PARTICLE HEART CONTAINER */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center my-2">
        <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center" />

        {/* CENTER PHOTO FRAME WITH HEART SHAPE MASK */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center z-10 shadow-[0_0_50px_rgba(244,63,94,0.8)]"
          style={{
            clipPath: "url(#heart-clip)"
          }}
        >
          <img 
            src={photoHeart} 
            alt="Our Special Memory" 
            className="w-full h-full object-cover" 
          />
        </motion.div>
      </div>

      {/* "I LOVE YOU" TEXT SECTION WITH STAGGERED TIMING */}
      <div className="flex items-center justify-center gap-3 sm:gap-5 my-2 relative z-20 w-full">
        
        <motion.span
          initial={{ opacity: 0, y: 20, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl sm:text-6xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-600 drop-shadow-[0_0_35px_rgba(250,204,21,0.9)]"
        >
          I
        </motion.span>

        <motion.span
          initial={{ opacity: 0, y: 20, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-3xl sm:text-5xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-red-600 drop-shadow-[0_0_35px_rgba(244,63,94,0.9)] tracking-widest"
        >
          LOVE
        </motion.span>

        <motion.span
          initial={{ opacity: 0, y: 20, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="text-4xl sm:text-6xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-600 drop-shadow-[0_0_35px_rgba(250,204,21,0.9)]"
        >
          YOU
        </motion.span>

      </div>

      {/* SUBTITLE & ACTION BUTTON */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2.1 }}
        className="text-sm sm:text-xl font-serif italic text-rose-100 drop-shadow-[0_0_15px_rgba(244,63,94,0.7)] mb-4 px-4 relative z-20"
      >
        "Saranya, will you be mine forever and ever? 💍✨"
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.5 }}
        className="relative z-20"
      >
        <button
          onClick={handleYes}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 text-zinc-950 font-bold text-sm sm:text-base shadow-[0_0_40px_rgba(251,191,36,0.6)] cursor-pointer"
        >
          Yes, Forever! 💖✨
        </button>
      </motion.div>

    </div>
  );
}
