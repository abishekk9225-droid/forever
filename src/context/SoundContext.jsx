import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const introAudioRef = useRef(null);
  const celebrationAudioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('intro'); // 'intro' | 'celebration'

  const playIntroTrack = () => {
    if (celebrationAudioRef.current) {
      celebrationAudioRef.current.pause();
      celebrationAudioRef.current.currentTime = 0;
    }
    if (introAudioRef.current) {
      introAudioRef.current.play().then(() => {
        setIsPlaying(true);
        setCurrentTrack('intro');
      }).catch(() => {});
    }
  };

  const playCelebrationTrack = (startTime = 0) => {
    if (introAudioRef.current) {
      introAudioRef.current.pause();
      introAudioRef.current.currentTime = 0;
    }
    if (celebrationAudioRef.current) {
      if (startTime > 0) {
        celebrationAudioRef.current.currentTime = startTime;
      }
      celebrationAudioRef.current.play().then(() => {
        setIsPlaying(true);
        setCurrentTrack('celebration');
      }).catch(() => {});
    }
  };

  const toggleSound = () => {
    const active = currentTrack === 'intro' ? introAudioRef.current : celebrationAudioRef.current;
    if (!active) return;
    if (isPlaying) {
      active.pause();
      setIsPlaying(false);
    } else {
      active.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  useEffect(() => {
    introAudioRef.current = new Audio('/bgm-intro.mp3');
    introAudioRef.current.loop = true;
    introAudioRef.current.volume = 0.5;

    celebrationAudioRef.current = new Audio('/bgm.mp3');
    celebrationAudioRef.current.loop = true;
    celebrationAudioRef.current.volume = 0.6;

    // Define triggerClimaxAudio globally to match original logic
    window.triggerClimaxAudio = () => {
      playCelebrationTrack(219);
    };

    // Handle initial browser user gesture unlock for audio
    const handleGlobalTap = () => {
      if (introAudioRef.current && !isPlaying) {
        introAudioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => console.warn("Initial playback failed:", err));
      }
      window.removeEventListener('click', handleGlobalTap);
      window.removeEventListener('touchstart', handleGlobalTap);
    };

    window.addEventListener('click', handleGlobalTap, { once: true });
    window.addEventListener('touchstart', handleGlobalTap, { once: true });

    return () => {
      if (introAudioRef.current) introAudioRef.current.pause();
      if (celebrationAudioRef.current) celebrationAudioRef.current.pause();
      window.removeEventListener('click', handleGlobalTap);
      window.removeEventListener('touchstart', handleGlobalTap);
    };
  }, []);

  return (
    <SoundContext.Provider value={{ currentTrack, isPlaying, playCelebrationTrack, playIntroTrack, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);
