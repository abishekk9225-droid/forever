import React, { createContext, useContext, useState, useEffect } from 'react';

const SceneContext = createContext(null);

export const SCENES = {
  INTRO: 'intro',
  GATECHECK: 'gatecheck',
  CALL: 'call',
  MEMORIES: 'memories',
  QUALITIES: 'qualities',
  GAME: 'game',
  BUILD: 'build',
  LETTER: 'letter',
  SUSPENSE: 'suspense',
  CONFESSION: 'confession',
  YES: 'yes',
  NO: 'no',
  LET_ME_THINK: 'let_me_think',
  GATECHECK_STOP: 'gatecheck_stop'
};

const INTENSITY_MAP = {
  [SCENES.INTRO]: 0.0,
  [SCENES.GATECHECK]: 0.1,
  [SCENES.CALL]: 0.2,
  [SCENES.MEMORIES]: 0.35,
  [SCENES.QUALITIES]: 0.5,
  [SCENES.GAME]: 0.6,
  [SCENES.BUILD]: 0.7,
  [SCENES.LETTER]: 0.75,
  [SCENES.SUSPENSE]: 0.1, // Dims to focus
  [SCENES.CONFESSION]: 0.05, // Black screen target
  [SCENES.YES]: 1.0, // Maximum intensity
  [SCENES.NO]: 0.2, // Wilting/dimmed
  [SCENES.LET_ME_THINK]: 0.2,
  [SCENES.GATECHECK_STOP]: 0.1
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
