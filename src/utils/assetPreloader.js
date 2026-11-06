// Utility to asynchronously pre-decode heavy scene assets without blocking the main UI thread

const CRITICAL_SCENE_ASSETS = [
  '/sa.jpg',
  '/sk.jpg',
  '/ph.jpg',
  '/ai_pencil_sketch.jpg',
  '/level1_secret_garden.jpg',
  '/lp.jpg',
  '/level3_choices_bridge.jpg',
  '/level4_unspoken_words.jpg',
  '/level5_final_heart.jpg',
  '/mem-01.jpg',
  '/mem-02.jpg',
  '/mem-03.jpg',
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
      if (index >= CRITICAL_SCENE_ASSETS.length) return;
      const src = CRITICAL_SCENE_ASSETS[index++];
      preloadImage(src).then(() => {
        // Stagger requests slightly to keep CPU/network bandwidth clear for active scene
        if (typeof requestIdleCallback === 'function') {
          requestIdleCallback(() => preloadNext(), { timeout: 1000 });
        } else {
          setTimeout(preloadNext, 200);
        }
      });
    };
    preloadNext();
  };

  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(runPreload, { timeout: 2000 });
  } else {
    setTimeout(runPreload, 1000);
  }
}
