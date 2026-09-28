import React, { createContext, useContext, useState, useEffect } from 'react';
import { globalAudioEngine } from '../utils/audioEngine';

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('intro');

  useEffect(() => {
    // Initialize engine upon mount
    globalAudioEngine.init();

    // Subscribe to engine music state changes
    const unsubscribe = globalAudioEngine.subscribe(({ currentTrack: track, isPlaying: playing }) => {
      setCurrentTrack(track);
      setIsPlaying(playing);
    });

    // Provide global climax audio trigger to match existing flow
    window.triggerClimaxAudio = () => {
      globalAudioEngine.playCelebrationTrack(219);
    };

    window.soundController = {
      playIntroTrack: () => globalAudioEngine.playIntroTrack(),
      playAbi1Track: () => globalAudioEngine.playAbi1Track(),
      playCelebrationTrack: (startTime) => globalAudioEngine.playCelebrationTrack(startTime),
      playKaTrack: () => globalAudioEngine.playKaTrack(),
      fadeToSoftAmbience: (target, duration) => globalAudioEngine.fadeToSoftAmbience(target, duration),
      toggleSound: () => globalAudioEngine.toggleSound(),
    };

    return () => {
      unsubscribe();
    };
  }, []);

  const playIntroTrack = () => {
    globalAudioEngine.playIntroTrack();
  };

  const playAbi1Track = () => {
    globalAudioEngine.playAbi1Track();
  };

  const playCelebrationTrack = (startTime = 0) => {
    globalAudioEngine.playCelebrationTrack(startTime);
  };

  const playKaTrack = () => {
    globalAudioEngine.playKaTrack();
  };

  const toggleSound = () => {
    globalAudioEngine.toggleSound();
  };

  const fadeToSoftAmbience = (targetGain = 0.045, durationSec = 3.5) => {
    globalAudioEngine.fadeToSoftAmbience(targetGain, durationSec);
  };

  return (
    <SoundContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playCelebrationTrack,
        playIntroTrack,
        playAbi1Track,
        playKaTrack,
        toggleSound,
        fadeToSoftAmbience,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);
