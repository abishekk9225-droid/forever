// ============================================================================
// UNIFIED CINEMATIC AUDIO & HEARTBEAT ENGINE (Web Audio API)
// Provides studio-grade audio mixing, Web Audio GainNodes, glitch-free ramps,
// dynamic ducking (Priority 1: Heartbeat, Priority 2: Music), master compression,
// and single-instance lifetime management.
// ============================================================================

class UnifiedAudioEngine {
  // abi.mp3 ducking guard — prevents duplicate instances in StrictMode / rapid clicks
  _abiDuckPlaying = false;
  _abiDuckEndHandler = null;
  constructor() {
    this.audioCtx = null;
    this.masterCompressor = null;
    this.heartbeatGain = null;
    this.heartbeatFilter = null;
    this.musicGain = null;

    // Heartbeat state
    this.currentBPM = 54;
    this.targetBPM = 54;
    this.currentVolume = 0.26; // Starting level within 0.20 - 0.30
    this.targetVolume = 0.26;
    this.isMuted = false;
    this.isPaused = false;
    this.silenceUntil = 0;
    this.nextBeatTime = 0;
    this.schedulerTimer = null;

    // Music state
    this.currentTrack = 'intro'; // 'intro' | 'abi1' | 'celebration' | 'ka' | 'kk'
    this.isPlayingMusic = false;
    this.baseMusicVolume = 0.65; // High, clear, consistent BGM level
    this.bgmBreathingTimer = null;
    this.tracks = {};
    this.listeners = new Set();
    this.beatListeners = new Set();
    this.isInitialized = false;

    // Bindings
    this.scheduleLoop = this.scheduleLoop.bind(this);
    this.handleUserInteraction = this.handleUserInteraction.bind(this);
  }

  init() {
    if (this.isInitialized && this.audioCtx) return;

    try {
      const AudioCtxClass = typeof window !== 'undefined'
        ? (window.AudioContext || window.webkitAudioContext)
        : null;

      if (!AudioCtxClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtxClass();
      }

      const now = this.audioCtx.currentTime;

      // 1. Master Dynamics Compressor (Prevents any clipping / distortion at climax)
      if (!this.masterCompressor) {
        this.masterCompressor = this.audioCtx.createDynamicsCompressor();
        this.masterCompressor.threshold.setValueAtTime(-6, now);
        this.masterCompressor.knee.setValueAtTime(12, now);
        this.masterCompressor.ratio.setValueAtTime(12, now);
        this.masterCompressor.attack.setValueAtTime(0.003, now);
        this.masterCompressor.release.setValueAtTime(0.25, now);
        this.masterCompressor.connect(this.audioCtx.destination);
      }

      // 2. Heartbeat Gain & Lowpass Resonant Filter (tuned to 320Hz for rich warmth & punch)
      if (!this.heartbeatGain) {
        this.heartbeatGain = this.audioCtx.createGain();
        this.heartbeatGain.gain.setValueAtTime(this.targetVolume * 1.35, now);
        this.heartbeatGain.connect(this.masterCompressor);

        this.heartbeatFilter = this.audioCtx.createBiquadFilter();
        this.heartbeatFilter.type = 'lowpass';
        this.heartbeatFilter.frequency.setValueAtTime(320, now);
        this.heartbeatFilter.Q.setValueAtTime(1.6, now);
        this.heartbeatFilter.connect(this.heartbeatGain);
      }

      // 3. Music Master GainNode
      if (!this.musicGain) {
        this.musicGain = this.audioCtx.createGain();
        this.musicGain.gain.setValueAtTime(this.baseMusicVolume, now);
        this.musicGain.connect(this.masterCompressor);
      }

      // 4. Initialize Single-Instance HTML Audio Elements for core tracks
      this.initTrack('intro', '/bgm-intro.mp3');
      this.initTrack('abi1', '/abi.1.mp3');
      this.initTrack('celebration', '/bgm.mp3');
      this.initTrack('ka', '/ka.mp3');
      this.initTrack('kk', '/kk.mp3');

      this.nextBeatTime = now + 0.1;

      // 5. Start Heartbeat Scheduler Loop (35ms interval)
      if (!this.schedulerTimer) {
        this.schedulerTimer = setInterval(this.scheduleLoop, 35);
      }

      this.isInitialized = true;
    } catch (e) {
      console.warn('UnifiedAudioEngine initialization deferred:', e);
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('click', this.handleUserInteraction, { passive: true });
      window.addEventListener('touchstart', this.handleUserInteraction, { passive: true });
      window.addEventListener('keydown', this.handleUserInteraction, { passive: true });
    }
  }

  initTrack(id, src) {
    if (this.tracks[id] || typeof window === 'undefined') return;

    try {
      const candidates = id === 'ka' ? ['/ka.mp3', '/ka.m4a', '/bgm.mp3'] : [src];
      let currentCandidateIdx = 0;
      const audio = new Audio(candidates[0]);
      audio.loop = true;
      audio.preload = 'auto';

      // Fallback element volume: calibrated for clear background music
      if (id === 'intro') {
        audio.volume = 0.65;
      } else if (id === 'ka') {
        audio.volume = 0.28;
      } else if (id === 'kk') {
        audio.volume = 0.35;
      } else if (id === 'celebration') {
        audio.volume = 0.40;
      } else {
        audio.volume = 0.35;
      }

      // Gracefully try candidate extensions if initial file fails to load
      audio.addEventListener('error', () => {
        if (currentCandidateIdx < candidates.length - 1) {
          currentCandidateIdx++;
          audio.src = candidates[currentCandidateIdx];
        }
      });

      let trackGain = null;
      let sourceNode = null;

      if (this.audioCtx) {
        try {
          trackGain = this.audioCtx.createGain();
          trackGain.gain.setValueAtTime(id === this.currentTrack ? 1.0 : 0.0001, this.audioCtx.currentTime);
          trackGain.connect(this.musicGain);

          sourceNode = this.audioCtx.createMediaElementSource(audio);
          sourceNode.connect(trackGain);
        } catch (err) {
          console.warn(`Web Audio routing for track "${id}" fell back to direct audio:`, err);
        }
      }

      this.tracks[id] = {
        element: audio,
        trackGain,
        sourceNode,
        src,
      };
    } catch (e) {
      console.warn(`Failed to initialize track ${id}:`, e);
    }
  }

  handleUserInteraction() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    // Auto-start intro on first interaction if requested
    if (!this.isPlayingMusic && this.currentTrack === 'intro') {
      this.playIntroTrack();
    }
  }

  // ==========================================================================
  // MUSIC CONTROLLER
  // ==========================================================================

  playIntroTrack() {
    this.init();
    this.resumeContext();

    if (this.currentTrack === 'intro' && this.isPlayingMusic) {
      return;
    }

    const now = this.audioCtx ? this.audioCtx.currentTime : 0;

    // Smoothly fade out any other playing track
    ['abi1', 'celebration', 'ka'].forEach((otherId) => {
      const other = this.tracks[otherId];
      if (other && other.element && !other.element.paused) {
        if (other.trackGain && this.audioCtx) {
          other.trackGain.gain.cancelScheduledValues(now);
          other.trackGain.gain.setValueAtTime(other.trackGain.gain.value, now);
          other.trackGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);
          setTimeout(() => {
            other.element.pause();
            other.element.currentTime = 0;
          }, 1250);
        } else {
          other.element.pause();
          other.element.currentTime = 0;
        }
      }
    });

    const intro = this.tracks['intro'];
    if (intro && intro.element) {
      this.currentTrack = 'intro';

      if (intro.trackGain && this.audioCtx) {
        intro.trackGain.gain.cancelScheduledValues(now);
        intro.trackGain.gain.setValueAtTime(0.0001, now);
        intro.trackGain.gain.linearRampToValueAtTime(1.0, now + 1.5);
      }

      if (this.musicGain && this.audioCtx) {
        this.musicGain.gain.cancelScheduledValues(now);
        this.musicGain.gain.setValueAtTime(this.musicGain.gain.value || 0.0001, now);
        // High, clear, and consistent background music level throughout intro
        this.musicGain.gain.linearRampToValueAtTime(0.65, now + 1.5);
      }

      intro.element.volume = 0.65;
      intro.element.play().then(() => {
        this.isPlayingMusic = true;
        this.notifyState();
      }).catch((e) => {
        console.warn('Intro playback prevented by browser autoplay policy:', e);
      });
    }
  }

  // Requirement 4: abi.1 starts ONLY when Abishek's typing scene is reached
  // Ramp: 0.05 -> 0.08 -> 0.12 -> 0.15 -> maintain
  playAbi1Track() {
    this.init();
    this.resumeContext();

    if (this.currentTrack === 'abi1' && this.isPlayingMusic) {
      return;
    }

    const now = this.audioCtx ? this.audioCtx.currentTime : 0;

    // Smoothly fade out intro and celebration
    ['intro', 'celebration'].forEach((otherId) => {
      const other = this.tracks[otherId];
      if (other && other.element && !other.element.paused) {
        if (other.trackGain && this.audioCtx) {
          other.trackGain.gain.cancelScheduledValues(now);
          other.trackGain.gain.setValueAtTime(other.trackGain.gain.value, now);
          other.trackGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);
          setTimeout(() => {
            other.element.pause();
            other.element.currentTime = 0;
          }, 1250);
        } else {
          other.element.pause();
          other.element.currentTime = 0;
        }
      }
    });

    const abi1 = this.tracks['abi1'];
    if (abi1 && abi1.element) {
      this.currentTrack = 'abi1';

      if (abi1.trackGain && this.audioCtx) {
        abi1.trackGain.gain.cancelScheduledValues(now);
        abi1.trackGain.gain.setValueAtTime(1.0, now);
      }

      // Smooth volume ramp: 0.05 -> 0.08 -> 0.12 -> 0.15 -> maintain
      if (this.musicGain && this.audioCtx) {
        this.musicGain.gain.cancelScheduledValues(now);
        this.musicGain.gain.setValueAtTime(0.05, now);
        this.musicGain.gain.linearRampToValueAtTime(0.08, now + 1.5);
        this.musicGain.gain.linearRampToValueAtTime(0.12, now + 3.2);
        this.musicGain.gain.linearRampToValueAtTime(0.15, now + 5.0);
      }

      abi1.element.currentTime = 0;
      abi1.element.play().then(() => {
        this.isPlayingMusic = true;
        this.notifyState();
      }).catch((e) => {
        console.warn('abi.1 playback error:', e);
      });
    }
  }

  playCelebrationTrack(startTime = 0) {
    this.init();
    this.resumeContext();

    if (this.currentTrack === 'celebration' && this.isPlayingMusic && startTime === 0) {
      return;
    }

    const now = this.audioCtx ? this.audioCtx.currentTime : 0;

    ['intro', 'abi1', 'ka', 'kk'].forEach((otherId) => {
      const other = this.tracks[otherId];
      if (other && other.element && !other.element.paused) {
        if (other.trackGain && this.audioCtx) {
          other.trackGain.gain.cancelScheduledValues(now);
          other.trackGain.gain.setValueAtTime(other.trackGain.gain.value, now);
          other.trackGain.gain.linearRampToValueAtTime(0.0001, now + 1.0);
          setTimeout(() => {
            other.element.pause();
            other.element.currentTime = 0;
          }, 1100);
        } else {
          other.element.pause();
          other.element.currentTime = 0;
        }
      }
    });

    const celebration = this.tracks['celebration'];
    if (celebration && celebration.element) {
      this.currentTrack = 'celebration';

      if (celebration.trackGain && this.audioCtx) {
        celebration.trackGain.gain.cancelScheduledValues(now);
        // Requirement 2: Start with medium-low volume (~0.26)
        celebration.trackGain.gain.setValueAtTime(0.26, now);
      }

      if (this.musicGain && this.audioCtx) {
        this.musicGain.gain.cancelScheduledValues(now);
        // Slightly more audible than before, smooth baseline so heartbeat remains clearly dominant
        this.musicGain.gain.setValueAtTime(0.28, now);
      }

      // Smooth cinematic breathing/pulsing volume curve for bgm.mp3
      this.startBgmBreathingGain();

      if (startTime > 0) {
        celebration.element.currentTime = startTime;
      }

      celebration.element.volume = 0.40;
      celebration.element.play().then(() => {
        this.isPlayingMusic = true;
        this.notifyState();
      }).catch((e) => {
        console.warn('Celebration playback error:', e);
      });
    }
  }

  // Smooth cinematic breathing/pulsing volume effect for bgm.mp3
  // START: medium-low volume -> slowly increase -> slowly decrease -> increase slightly again
  startBgmBreathingGain() {
    this.stopBgmBreathingGain();
    if (!this.audioCtx) return;

    const scheduleBreathing = () => {
      if (this.currentTrack !== 'celebration' || !this.isPlayingMusic || !this.audioCtx) return;
      const celebration = this.tracks['celebration'];
      if (!celebration || !celebration.trackGain) return;

      const now = this.audioCtx.currentTime;
      const gain = celebration.trackGain.gain;
      gain.cancelScheduledValues(now);
      gain.setValueAtTime(gain.value || 0.26, now);
      // 1. Slowly increase volume: 0.26 -> 0.36 over 6.0s
      gain.linearRampToValueAtTime(0.36, now + 6.0);
      // 2. Slowly decrease volume: 0.36 -> 0.24 over 6.0s
      gain.linearRampToValueAtTime(0.24, now + 12.0);
      // 3. Increase slightly again: 0.24 -> 0.32 over 5.0s
      gain.linearRampToValueAtTime(0.32, now + 17.0);
      // 4. Return to medium-low baseline: 0.32 -> 0.26 over 5.0s
      gain.linearRampToValueAtTime(0.26, now + 22.0);
    };

    scheduleBreathing();
    this.bgmBreathingTimer = setInterval(scheduleBreathing, 21800);
  }

  stopBgmBreathingGain() {
    if (this.bgmBreathingTimer) {
      clearInterval(this.bgmBreathingTimer);
      this.bgmBreathingTimer = null;
    }
  }

  // Play ka track for the emotional waiting scene ("100 ஜென்மம் காத்திருப்பேன்...")
  playKaTrack() {
    this.init();
    this.resumeContext();

    if (!this.tracks['ka']) {
      this.initTrack('ka', '/ka.mp3');
    }

    if (this.currentTrack === 'ka' && this.isPlayingMusic) {
      return Promise.resolve();
    }

    this.stopBgmBreathingGain();
    const now = this.audioCtx ? this.audioCtx.currentTime : 0;

    // Smoothly fade out any currently playing track over 1.6 seconds
    ['intro', 'abi1', 'celebration', 'kk'].forEach((otherId) => {
      const other = this.tracks[otherId];
      if (other && other.element && !other.element.paused) {
        if (other.trackGain && this.audioCtx) {
          other.trackGain.gain.cancelScheduledValues(now);
          other.trackGain.gain.setValueAtTime(other.trackGain.gain.value, now);
          other.trackGain.gain.linearRampToValueAtTime(0.0001, now + 1.6);
          setTimeout(() => {
            other.element.pause();
          }, 1650);
        } else {
          other.element.pause();
        }
      }
    });

    const ka = this.tracks['ka'];
    if (ka && ka.element) {
      this.currentTrack = 'ka';

      if (ka.trackGain && this.audioCtx) {
        ka.trackGain.gain.cancelScheduledValues(now);
        ka.trackGain.gain.setValueAtTime(0.0001, now);
        ka.trackGain.gain.linearRampToValueAtTime(1.0, now + 2.0);
      }

      if (this.musicGain && this.audioCtx) {
        this.musicGain.gain.cancelScheduledValues(now);
        this.musicGain.gain.setValueAtTime(this.musicGain.gain.value || 0.05, now);
        this.musicGain.gain.linearRampToValueAtTime(0.28, now + 2.0);
      }

      ka.element.volume = 0.28;
      ka.element.currentTime = 0;
      return ka.element.play().then(() => {
        this.isPlayingMusic = true;
        this.notifyState();
      }).catch((e) => {
        console.warn('ka track playback notice:', e);
        throw e;
      });
    }
    return Promise.reject(new Error('ka track not found'));
  }

  // Cleanly stops ka.mp3 when leaving the emotional waiting scene
  stopKaTrack(fadeDuration = 1.2) {
    const ka = this.tracks['ka'];
    if (!ka || !ka.element || ka.element.paused) {
      if (this.currentTrack === 'ka') {
        this.isPlayingMusic = false;
        this.notifyState();
      }
      return;
    }

    const now = this.audioCtx ? this.audioCtx.currentTime : 0;
    if (ka.trackGain && this.audioCtx) {
      ka.trackGain.gain.cancelScheduledValues(now);
      ka.trackGain.gain.setValueAtTime(ka.trackGain.gain.value, now);
      ka.trackGain.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);
      setTimeout(() => {
        ka.element.pause();
        ka.element.currentTime = 0;
        if (this.currentTrack === 'ka') {
          this.isPlayingMusic = false;
          this.notifyState();
        }
      }, fadeDuration * 1000 + 50);
    } else {
      ka.element.pause();
      ka.element.currentTime = 0;
      if (this.currentTrack === 'ka') {
        this.isPlayingMusic = false;
        this.notifyState();
      }
    }
  }

  // Requirement 1: Play kk.mp3 after Emotional Waiting Screen is completely finished
  playKkTrack() {
    this.init();
    this.resumeContext();

    if (!this.tracks['kk']) {
      this.initTrack('kk', '/kk.mp3');
    }

    if (this.currentTrack === 'kk' && this.isPlayingMusic) {
      return Promise.resolve();
    }

    this.stopBgmBreathingGain();
    const now = this.audioCtx ? this.audioCtx.currentTime : 0;

    // Smoothly fade out any currently playing track over 1.4 seconds
    ['intro', 'abi1', 'celebration', 'ka'].forEach((otherId) => {
      const other = this.tracks[otherId];
      if (other && other.element && !other.element.paused) {
        if (other.trackGain && this.audioCtx) {
          other.trackGain.gain.cancelScheduledValues(now);
          other.trackGain.gain.setValueAtTime(other.trackGain.gain.value, now);
          other.trackGain.gain.linearRampToValueAtTime(0.0001, now + 1.4);
          setTimeout(() => {
            other.element.pause();
            other.element.currentTime = 0;
          }, 1450);
        } else {
          other.element.pause();
          other.element.currentTime = 0;
        }
      }
    });

    const kk = this.tracks['kk'];
    if (kk && kk.element) {
      this.currentTrack = 'kk';

      if (kk.trackGain && this.audioCtx) {
        kk.trackGain.gain.cancelScheduledValues(now);
        kk.trackGain.gain.setValueAtTime(0.0001, now);
        kk.trackGain.gain.linearRampToValueAtTime(1.0, now + 1.8);
      }

      if (this.musicGain && this.audioCtx) {
        this.musicGain.gain.cancelScheduledValues(now);
        this.musicGain.gain.setValueAtTime(this.musicGain.gain.value || 0.05, now);
        this.musicGain.gain.linearRampToValueAtTime(0.35, now + 1.8);
      }

      kk.element.volume = 0.35;
      kk.element.currentTime = 0;
      return kk.element.play().then(() => {
        this.isPlayingMusic = true;
        this.notifyState();
      }).catch((e) => {
        console.warn('kk track playback notice:', e);
      });
    }
    return Promise.resolve();
  }

  // Cleanly stops kk.mp3 when leaving the post-waiting flow
  stopKkTrack(fadeDuration = 1.0) {
    const kk = this.tracks['kk'];
    if (!kk || !kk.element || kk.element.paused) {
      if (this.currentTrack === 'kk') {
        this.isPlayingMusic = false;
        this.notifyState();
      }
      return;
    }

    const now = this.audioCtx ? this.audioCtx.currentTime : 0;
    if (kk.trackGain && this.audioCtx) {
      kk.trackGain.gain.cancelScheduledValues(now);
      kk.trackGain.gain.setValueAtTime(kk.trackGain.gain.value, now);
      kk.trackGain.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);
      setTimeout(() => {
        kk.element.pause();
        kk.element.currentTime = 0;
        if (this.currentTrack === 'kk') {
          this.isPlayingMusic = false;
          this.notifyState();
        }
      }, fadeDuration * 1000 + 50);
    } else {
      kk.element.pause();
      kk.element.currentTime = 0;
      if (this.currentTrack === 'kk') {
        this.isPlayingMusic = false;
        this.notifyState();
      }
    }
  }

  // Requirement 3: After voice recording scene is completed, DO NOT stop audio.
  // Smoothly reduce current music volume to a soft background ambience level (~0.045).
  fadeToSoftAmbience(targetGain = 0.045, durationSec = 3.5) {
    if (!this.audioCtx || !this.musicGain) return;
    // Do not fade intro if current track is intro
    if (this.currentTrack === 'intro') return;

    const now = this.audioCtx.currentTime;
    const currentGain = this.musicGain.gain.value;

    this.musicGain.gain.cancelScheduledValues(now);
    this.musicGain.gain.setValueAtTime(currentGain, now);
    this.musicGain.gain.linearRampToValueAtTime(targetGain, now + durationSec);
  }

  // General smooth music fade method
  fadeMusic(targetGain, durationSec = 1.5) {
    if (!this.audioCtx || !this.musicGain) return;
    if (this.currentTrack === 'intro') return;

    const now = this.audioCtx.currentTime;
    const currentGain = this.musicGain.gain.value;

    this.musicGain.gain.cancelScheduledValues(now);
    this.musicGain.gain.setValueAtTime(currentGain, now);
    this.musicGain.gain.linearRampToValueAtTime(targetGain, now + durationSec);
  }

  toggleSound() {
    const active = this.tracks[this.currentTrack];
    if (!active || !active.element) return;

    if (this.isPlayingMusic) {
      if (this.audioCtx && this.musicGain) {
        const now = this.audioCtx.currentTime;
        this.musicGain.gain.cancelScheduledValues(now);
        this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
        this.musicGain.gain.linearRampToValueAtTime(0.0001, now + 0.3);
        setTimeout(() => {
          active.element.pause();
          this.isPlayingMusic = false;
          this.notifyState();
        }, 320);
      } else {
        active.element.pause();
        this.isPlayingMusic = false;
        this.notifyState();
      }
    } else {
      this.resumeContext();
      if (this.audioCtx && this.musicGain) {
        const now = this.audioCtx.currentTime;
        const targetVol = this.currentTrack === 'intro' ? 0.65 : this.currentTrack === 'abi1' ? 0.15 : 0.28;
        this.musicGain.gain.cancelScheduledValues(now);
        this.musicGain.gain.setValueAtTime(0.0001, now);
        this.musicGain.gain.linearRampToValueAtTime(targetVol, now + 0.5);
      }
      active.element.play().then(() => {
        this.isPlayingMusic = true;
        this.notifyState();
      }).catch(() => {});
    }
  }

  resumeContext() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyState() {
    this.listeners.forEach((cb) => {
      try {
        cb({
          currentTrack: this.currentTrack,
          isPlaying: this.isPlayingMusic,
        });
      } catch {}
    });
  }

  // ==========================================================================
  // HEARTBEAT CONTROLLER & AUDIO DUCKING (PRIORITY 1)
  // ==========================================================================

  start() {
    this.init();
    this.resumeContext();
    this.isPaused = false;
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
    this.resumeContext();
  }

  setMuted(muted) {
    this.isMuted = !!muted;
    if (this.heartbeatGain && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      const target = this.isMuted ? 0.0001 : this.currentVolume * 1.35;
      this.heartbeatGain.gain.setTargetAtTime(target, now, 0.05);
    }
  }

  // Sets target BPM and Heartbeat Volume with automatic music ducking
  setTargetBPM(bpm, volume) {
    if (typeof bpm === 'number' && bpm > 0) {
      this.targetBPM = bpm;
    }
    if (typeof volume === 'number' && volume >= 0) {
      this.targetVolume = volume;
    }

    if (!this.audioCtx) {
      this.init();
    }

    // Dynamic ducking: When heartbeat becomes very intense (e.g. proposal climax >= 0.48),
    // smoothly dip music to ~0.12 so heartbeat is unmistakably dominant without silence
    if (this.audioCtx && this.musicGain && !this.isMuted) {
      const now = this.audioCtx.currentTime;
      const currentGain = this.musicGain.gain.value;

      if (this.currentTrack !== 'intro' && this.targetVolume >= 0.48 && currentGain > 0.14) {
        this.musicGain.gain.cancelScheduledValues(now);
        this.musicGain.gain.setValueAtTime(currentGain, now);
        this.musicGain.gain.linearRampToValueAtTime(0.12, now + 1.2);
      }
    }
  }

  // Dramatic silence (e.g. 250ms silence immediately before "I LOVE YOU")
  silence(durationMs = 250) {
    if (!this.audioCtx) return;
    this.silenceUntil = this.audioCtx.currentTime + durationMs / 1000;
  }

  // Precision Web Audio Heartbeat Synthesizer: "LUB" followed by "DUB"
  // Rich multi-harmonic sound with chest resonance (135Hz punch + 78Hz fundamental)
  // that is clearly, warmly audible on laptops, phones, and earphones alike.
  playBeat(time, bpm, volume) {
    if (!this.audioCtx || this.audioCtx.state !== 'running' || !this.heartbeatFilter) return;

    // Time gap between LUB and DUB shortens slightly as BPM accelerates
    const lubDubGap = Math.max(0.09, Math.min(0.15, 0.14 * (75 / Math.max(50, bpm))));

    try {
      // 1. "LUB" - Warm acoustic chest thud & punch
      // Fundamental sine (78Hz -> 48Hz)
      const oscLub = this.audioCtx.createOscillator();
      const gainLub = this.audioCtx.createGain();
      oscLub.type = 'sine';
      oscLub.frequency.setValueAtTime(78, time);
      oscLub.frequency.exponentialRampToValueAtTime(48, time + 0.15);

      gainLub.gain.setValueAtTime(0.0001, time);
      gainLub.gain.linearRampToValueAtTime(1.20, time + 0.022);
      gainLub.gain.exponentialRampToValueAtTime(0.0001, time + 0.16);

      // Acoustic chest punch (135Hz -> 68Hz - provides crisp presence on phone & laptop speakers)
      const punchLub = this.audioCtx.createOscillator();
      const punchGainLub = this.audioCtx.createGain();
      punchLub.type = 'sine';
      punchLub.frequency.setValueAtTime(135, time);
      punchLub.frequency.exponentialRampToValueAtTime(68, time + 0.10);

      punchGainLub.gain.setValueAtTime(0.0001, time);
      punchGainLub.gain.linearRampToValueAtTime(0.85, time + 0.018);
      punchGainLub.gain.exponentialRampToValueAtTime(0.0001, time + 0.11);

      // Deep sub-harmonic layer for headphone/subwoofer depth (44Hz -> 28Hz)
      const subLub = this.audioCtx.createOscillator();
      const subGainLub = this.audioCtx.createGain();
      subLub.type = 'sine';
      subLub.frequency.setValueAtTime(44, time);
      subLub.frequency.exponentialRampToValueAtTime(28, time + 0.16);

      subGainLub.gain.setValueAtTime(0.0001, time);
      subGainLub.gain.linearRampToValueAtTime(0.60, time + 0.024);
      subGainLub.gain.exponentialRampToValueAtTime(0.0001, time + 0.16);

      oscLub.connect(gainLub);
      gainLub.connect(this.heartbeatFilter);
      punchLub.connect(punchGainLub);
      punchGainLub.connect(this.heartbeatFilter);
      subLub.connect(subGainLub);
      subGainLub.connect(this.heartbeatFilter);

      oscLub.start(time);
      oscLub.stop(time + 0.17);
      punchLub.start(time);
      punchLub.stop(time + 0.12);
      subLub.start(time);
      subLub.stop(time + 0.17);

      // 2. "DUB" - Slightly higher frequency, shorter and crisper
      const tDub = time + lubDubGap;
      const oscDub = this.audioCtx.createOscillator();
      const gainDub = this.audioCtx.createGain();
      oscDub.type = 'sine';
      oscDub.frequency.setValueAtTime(98, tDub);
      oscDub.frequency.exponentialRampToValueAtTime(60, tDub + 0.11);

      gainDub.gain.setValueAtTime(0.0001, tDub);
      gainDub.gain.linearRampToValueAtTime(0.95, tDub + 0.016);
      gainDub.gain.exponentialRampToValueAtTime(0.0001, tDub + 0.12);

      // DUB chest punch (155Hz -> 82Hz)
      const punchDub = this.audioCtx.createOscillator();
      const punchGainDub = this.audioCtx.createGain();
      punchDub.type = 'sine';
      punchDub.frequency.setValueAtTime(155, tDub);
      punchDub.frequency.exponentialRampToValueAtTime(82, tDub + 0.08);

      punchGainDub.gain.setValueAtTime(0.0001, tDub);
      punchGainDub.gain.linearRampToValueAtTime(0.65, tDub + 0.014);
      punchGainDub.gain.exponentialRampToValueAtTime(0.0001, tDub + 0.09);

      oscDub.connect(gainDub);
      gainDub.connect(this.heartbeatFilter);
      punchDub.connect(punchGainDub);
      punchGainDub.connect(this.heartbeatFilter);

      oscDub.start(tDub);
      oscDub.stop(tDub + 0.13);
      punchDub.start(tDub);
      punchDub.stop(tDub + 0.10);

      // Broadcast visual triggers
      this.notifyBeatListeners('LUB', bpm, volume);
      setTimeout(() => {
        this.notifyBeatListeners('DUB', bpm, volume);
      }, lubDubGap * 1000);
    } catch {}
  }

  // Lookahead Scheduler for Heartbeat (Every 35ms, schedules next 120ms)
  scheduleLoop() {
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;

    // Smooth BPM and Volume interpolation
    this.currentBPM += (this.targetBPM - this.currentBPM) * 0.08;
    this.currentVolume += (this.targetVolume - this.currentVolume) * 0.08;

    // Update heartbeat master gain directly and smoothly
    if (this.heartbeatGain && !this.isMuted) {
      const hbGain = Math.max(0.0001, this.currentVolume * 1.35);
      this.heartbeatGain.gain.setValueAtTime(hbGain, now);
    }

    // Schedule beats within lookahead window (120ms)
    while (this.nextBeatTime < now + 0.12) {
      if (!this.isPaused && this.nextBeatTime > this.silenceUntil) {
        this.playBeat(this.nextBeatTime, this.currentBPM, this.currentVolume);
      }

      // Cardiac cycle period: 60 / BPM
      const beatInterval = 60 / Math.max(45, this.currentBPM);
      this.nextBeatTime += beatInterval;
    }
  }

  subscribeBeat(callback) {
    this.beatListeners.add(callback);
    return () => this.beatListeners.delete(callback);
  }

  notifyBeatListeners(type, bpm, volume) {
    this.beatListeners.forEach((cb) => {
      try {
        cb(type, bpm, volume);
      } catch {}
    });
  }

  // ==========================================================================
  // ABI.MP3 AUDIO DUCKING (bgm-intro only)
  // Smoothly ducks the intro BGM while abi.mp3 plays, then restores.
  // Accepts a pre-created Audio element so the caller can bypass autoplay blocks.
  // ==========================================================================

  duckIntroForAbi(abiAudio) {
    // Guard: never start a second instance
    if (this._abiDuckPlaying) return;
    // Only duck when intro is the active, playing track
    if (this.currentTrack !== 'intro' || !this.isPlayingMusic) {
      // Still play abi even if no ducking needed
      if (abiAudio && typeof abiAudio.play === 'function') {
        abiAudio.play().catch(() => {});
      }
      return;
    }

    if (!this.audioCtx || !this.musicGain) {
      // Fallback: just play abi at whatever volume it has
      if (abiAudio && typeof abiAudio.play === 'function') {
        abiAudio.play().catch(() => {});
      }
      return;
    }

    this._abiDuckPlaying = true;

    const now = this.audioCtx.currentTime;
    // Remember the pre-duck gain so we can restore it exactly
    const preDuckGain = this.musicGain.gain.value || this.baseMusicVolume;
    // Duck target: low enough for abi to be clearly audible, not silent
    const duckTarget = 0.18;
    const duckRamp = 1.2;   // seconds to reach ducked level
    const restoreRamp = 2.0; // seconds to restore after abi ends

    // Smoothly reduce musicGain — do NOT pause or restart intro
    this.musicGain.gain.cancelScheduledValues(now);
    this.musicGain.gain.setValueAtTime(preDuckGain, now);
    this.musicGain.gain.linearRampToValueAtTime(duckTarget, now + duckRamp);

    // Set abi to full intended volume
    if (abiAudio) {
      abiAudio.volume = 0.85;
    }

    // Remove any stale ended listener from a previous call
    if (this._abiDuckEndHandler && abiAudio) {
      abiAudio.removeEventListener('ended', this._abiDuckEndHandler);
    }

    // Restore musicGain when abi ends naturally
    this._abiDuckEndHandler = () => {
      this._abiDuckPlaying = false;
      this._abiDuckEndHandler = null;
      if (!this.audioCtx || !this.musicGain) return;
      const t = this.audioCtx.currentTime;
      // Restore to exactly the level it was before ducking
      this.musicGain.gain.cancelScheduledValues(t);
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, t);
      this.musicGain.gain.linearRampToValueAtTime(preDuckGain, t + restoreRamp);
    };

    if (abiAudio) {
      abiAudio.addEventListener('ended', this._abiDuckEndHandler, { once: true });
      abiAudio.play().catch(() => {
        // Playback failed — restore immediately
        this._abiDuckPlaying = false;
        const t = this.audioCtx ? this.audioCtx.currentTime : 0;
        if (this.audioCtx && this.musicGain) {
          this.musicGain.gain.cancelScheduledValues(t);
          this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, t);
          this.musicGain.gain.linearRampToValueAtTime(preDuckGain, t + 0.5);
        }
      });
    }
  }

  destroy() {
    if (this.schedulerTimer) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    Object.values(this.tracks).forEach((t) => {
      if (t.element) {
        t.element.pause();
        t.element.src = '';
      }
    });
    if (this.audioCtx) {
      try {
        this.audioCtx.close();
      } catch {}
      this.audioCtx = null;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('click', this.handleUserInteraction);
      window.removeEventListener('touchstart', this.handleUserInteraction);
      window.removeEventListener('keydown', this.handleUserInteraction);
    }
  }
}

// Single persistent global audio engine instance
export const globalAudioEngine = new UnifiedAudioEngine();

if (typeof window !== 'undefined') {
  window.heartbeatEngine = globalAudioEngine;
  window.unifiedAudioEngine = globalAudioEngine;
  window.toggleAudio = () => globalAudioEngine.toggleSound();
  window.toggleSound = () => globalAudioEngine.toggleSound();
  window.unlockAudio = () => {
    try {
      globalAudioEngine.resumeContext();
    } catch {}
  };
}
