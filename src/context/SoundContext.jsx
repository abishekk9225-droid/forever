import React, { createContext, useContext, useState, useEffect } from 'react';
import { globalAudioEngine } from '../utils/audioEngine';

const defaultSoundState = {
  currentTrack: 'intro',
  isPlaying: false,
  playCelebrationTrack: () => {},
  playIntroTrack: () => {},
  playAbi1Track: () => {},
  playKaTrack: () => {},
  stopKaTrack: () => {},
  playKkTrack: () => {},
  stopKkTrack: () => {},
  toggleSound: () => globalAudioEngine.toggleSound(),
  toggleAudio: () => globalAudioEngine.toggleSound(),
  fadeToSoftAmbience: () => {},
};

const SoundContext = createContext(defaultSoundState);

if (typeof window !== 'undefined') {
  window.toggleAudio = window.toggleAudio || (() => globalAudioEngine.toggleSound());
  window.toggleSound = window.toggleSound || (() => globalAudioEngine.toggleSound());
}

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

    window.toggleAudio = () => globalAudioEngine.toggleSound();
    window.toggleSound = () => globalAudioEngine.toggleSound();

    window.soundController = {
      playIntroTrack: () => globalAudioEngine.playIntroTrack(),
      playAbi1Track: () => globalAudioEngine.playAbi1Track(),
      playCelebrationTrack: (startTime) => globalAudioEngine.playCelebrationTrack(startTime),
      playKaTrack: () => globalAudioEngine.playKaTrack(),
      stopKaTrack: (fadeDuration) => globalAudioEngine.stopKaTrack(fadeDuration),
      playKkTrack: () => globalAudioEngine.playKkTrack(),
      stopKkTrack: (fadeDuration) => globalAudioEngine.stopKkTrack(fadeDuration),
      fadeToSoftAmbience: (target, duration) => globalAudioEngine.fadeToSoftAmbience(target, duration),
      toggleSound: () => globalAudioEngine.toggleSound(),
      toggleAudio: () => globalAudioEngine.toggleSound(),
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
    return globalAudioEngine.playKaTrack();
  };

  const stopKaTrack = (fadeDuration = 1.2) => {
    globalAudioEngine.stopKaTrack(fadeDuration);
  };

  const playKkTrack = () => {
    return globalAudioEngine.playKkTrack();
  };

  const stopKkTrack = (fadeDuration = 1.0) => {
    globalAudioEngine.stopKkTrack(fadeDuration);
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
        stopKaTrack,
        playKkTrack,
        stopKkTrack,
        toggleSound,
        toggleAudio: toggleSound,
        fadeToSoftAmbience,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);
