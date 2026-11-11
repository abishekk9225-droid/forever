/**
 * Dedicated intro.mp3 Audio Controller
 * Manages reliable playback of /intro.mp3 for HeartbeatIntro scene.
 * Handles browser autoplay unlock via user gestures prior to HeartbeatIntro mount.
 */

let sharedIntroAudio = null;
let isIntroActive = false;

export function getIntroAudio() {
  if (typeof window === 'undefined') return null;
  if (!sharedIntroAudio) {
    const audio = new Audio('/intro.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 1.0;
    sharedIntroAudio = audio;
  }
  return sharedIntroAudio;
}

/**
 * Prime and unlock intro.mp3 on any legitimate user gesture (clicks/touches)
 * across prior scenes (Abishek AI Intro, Camera Permission, Face Scan).
 * This permanently grants playback permission in Chrome/Edge, preventing
 * autoplay blockage when HeartbeatIntro mounts asynchronously.
 */
export function primeIntroAudioOnUserGesture() {
  if (typeof window === 'undefined') return;
  const audio = getIntroAudio();
  if (!audio) return;

  // If HeartbeatIntro is currently active, ensure it plays at full volume
  if (isIntroActive) {
    if (audio.paused) {
      audio.volume = 1.0;
      audio.play().catch(() => {});
    }
    return;
  }

  // Pre-unlock the HTMLAudioElement within the trusted user gesture window
  // without producing audible sound prior to HeartbeatIntro entry.
  if (audio.paused) {
    const prevVol = audio.volume;
    audio.volume = 0.0001;
    const promise = audio.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          if (!isIntroActive) {
            audio.pause();
            audio.currentTime = 0;
            audio.volume = prevVol > 0 ? prevVol : 1.0;
          } else {
            audio.volume = 1.0;
          }
        })
        .catch(() => {});
    }
  }
}

/**
 * Start playing intro.mp3 at full volume (looping) for HeartbeatIntro.
 */
export function startIntroAudio() {
  isIntroActive = true;
  if (typeof window !== 'undefined') {
    window._heartbeatIntroActive = true;
  }

  const audio = getIntroAudio();
  if (!audio) return null;

  audio.volume = 1.0;
  audio.currentTime = 0;

  const promise = audio.play();
  if (promise !== undefined) {
    promise.catch((err) => {
      console.warn('intro.mp3 autoplay deferred to user interaction:', err);
    });
  }

  return audio;
}

/**
 * Stop intro.mp3 playback and reset state.
 * Supports optional smooth volume fade-out.
 */
export function stopIntroAudio(fadeMs = 0) {
  isIntroActive = false;
  if (typeof window !== 'undefined') {
    window._heartbeatIntroActive = false;
  }

  if (!sharedIntroAudio) return;
  const audio = sharedIntroAudio;

  if (fadeMs > 0 && !audio.paused && audio.volume > 0) {
    let vol = audio.volume;
    const stepInterval = 50;
    const steps = Math.max(1, Math.floor(fadeMs / stepInterval));
    const stepDec = vol / steps;

    const intervalId = setInterval(() => {
      vol = Math.max(0, vol - stepDec);
      audio.volume = vol;
      if (vol <= 0.01) {
        clearInterval(intervalId);
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 1.0;
      }
    }, stepInterval);
  } else {
    try {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 1.0;
    } catch {}
  }
}

export function isIntroAudioPlaying() {
  return isIntroActive && sharedIntroAudio && !sharedIntroAudio.paused;
}
