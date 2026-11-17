// Utility to progressively pre-decode heavy scene assets without blocking the main UI thread

const STAGED_SCENE_ASSETS = [
  // Stage 0: Initial scene & gate
  '/for.jpg',
  '/sa.jpg',
  '/sk.jpg',
  // Stage 1: Game levels
  '/level1_secret_garden.jpg',
  '/level3_choices_bridge.jpg',
  '/level4_unspoken_words.jpg',
  '/level5_final_heart.jpg',
  // Stage 2: Memory & Climax scenes
  '/mem-01.jpg',
  '/mem-02.jpg',
  '/mem-03.jpg',
  '/ph.jpg',
  '/ai_pencil_sketch.jpg',
  '/lp.jpg',
];

const preloadedSet = new Set();

export function preloadImage(src) {
  if (preloadedSet.has(src) || typeof window === 'undefined') return Promise.resolve();
  preloadedSet.add(src);

  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    if ('decode' in img) {
      img.decode()
        .then(() => resolve(img))
        .catch(() => resolve(img));
    } else {
      img.onload = () => resolve(img);
      img.onerror = () => resolve(img);
    }
  });
}

export function startBackgroundAssetPreload() {
  if (typeof window === 'undefined') return;

  const runPreload = () => {
    let index = 0;
    const preloadNext = () => {
      if (index >= STAGED_SCENE_ASSETS.length) return;
      const src = STAGED_SCENE_ASSETS[index++];
      preloadImage(src).then(() => {
        // Generous stagger interval keeps CPU and main thread completely free for active scenes
        if (typeof requestIdleCallback === 'function') {
          requestIdleCallback(() => preloadNext(), { timeout: 2000 });
        } else {
          setTimeout(preloadNext, 400);
        }
      });
    };
    preloadNext();
  };

  // Wait 4 seconds after initial page load so Love Story scene loads instantaneously with zero network contention
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(runPreload, { timeout: 4000 });
  } else {
    setTimeout(runPreload, 3500);
  }
}

