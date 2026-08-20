import React, { createContext, useContext, useState, useEffect } from 'react';

const SceneContext = createContext(null);

export const SCENES = {
  INTRO: 'INTRO',
  MEMORIES: 'MEMORIES',
  GAME: 'GAME',
  LETTER: 'LETTER',
  CONFESSION: 'CONFESSION',
  LOCK_REVEAL: 'LOCK_REVEAL',
  QUIZ: 'QUIZ',
  BOTTLE_REVEAL: 'BOTTLE_REVEAL',
  CERTIFICATE: 'CERTIFICATE',
  FINALE: 'FINALE',
};

const INTENSITY_MAP = {
  [SCENES.INTRO]: 0.1,
  [SCENES.MEMORIES]: 0.45,
  [SCENES.GAME]: 0.6,
  [SCENES.LETTER]: 0.75,
  [SCENES.CONFESSION]: 0.05,
  [SCENES.LOCK_REVEAL]: 1.0,
  [SCENES.QUIZ]: 1.0,
  [SCENES.BOTTLE_REVEAL]: 1.0,
  [SCENES.CERTIFICATE]: 1.0,
  [SCENES.FINALE]: 1.0,
};

export function SceneProvider({ children }) {
  const [currentScene, setCurrentScene] = useState(SCENES.INTRO);
  const [historyStack, setHistoryStack] = useState([]);
  const [muted, setMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [isGardenAwakened, setIsGardenAwakened] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Simple check to identify low performance / memory limits
    const isMobileDevice = /Mobi|Android|iPhone/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency || 4;
    setIsLowEnd(isMobileDevice || cores <= 4);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const goToScene = (sceneId) => {
    if (!Object.values(SCENES).includes(sceneId)) {
      console.warn(`[SceneProvider] Invalid scene requested: ${sceneId}`);
      return;
    }
    console.log(`[SceneRouter] ${currentScene} ➔ ${sceneId}`);
    setHistoryStack((prev) => [...prev, currentScene]);
    setCurrentScene(sceneId);
  };

  const goBack = () => {
    if (historyStack.length === 0) return;
    const prev = historyStack[historyStack.length - 1];
    setHistoryStack((prevStack) => prevStack.slice(0, -1));
    setCurrentScene(prev);
  };

  const toggleMute = () => {
    setMuted((prev) => {
      const nextMuted = !prev;
      console.log(`[AudioEngine] Muted state: ${nextMuted}`);
      if (window.setAudioMuted) {
        window.setAudioMuted(nextMuted);
      }
      return nextMuted;
    });
  };

  const storyIntensity = INTENSITY_MAP[currentScene] || 0.0;

  return (
    <SceneContext.Provider
      value={{
        currentScene,
        historyStack,
        storyIntensity,
        muted,
        isMobile,
        isLowEnd,
        isGardenAwakened,
        setIsGardenAwakened,
        goToScene,
        goBack,
        toggleMute,
        setMuted
      }}
    >
      {children}
    </SceneContext.Provider>
  );
}

export function useScene() {
  const context = useContext(SceneContext);
  if (!context) {
    throw new Error('useScene must be used within a SceneProvider');
  }
  return context;
}
