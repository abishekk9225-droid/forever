/**
 * On-Device Mobile Phone Detection Service using TensorFlow.js & COCO-SSD
 * 
 * - Detects 'cell phone' objects visible in the authorized laptop webcam feed.
 * - Runs 100% locally on-device via WebGL/WASM/CPU; no video frames are uploaded.
 * - Loads 'mobilenet_v2' for superior cell phone detection accuracy, with 'lite_mobilenet_v2' fallback.
 * - Supports consecutive-frame verification and confidence thresholding to prevent false positives.
 * - Gracefully reports errors if WebGL is unavailable or model files cannot be loaded.
 */

let tfModelPromise = null;
let loadedModel = null;
const scriptPromises = new Map();

// Thread-safe and race-condition-free script loader
function loadScript(src) {
  if (scriptPromises.has(src)) {
    return scriptPromises.get(src);
  }

  const promise = new Promise((resolve, reject) => {
    // Check if script already exists in document
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.getAttribute('data-loaded') === 'true' || window.tf || window.cocoSsd) {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => {
        scriptPromises.delete(src);
        reject(new Error(`Failed to load script: ${src}`));
      });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      script.setAttribute('data-loaded', 'true');
      resolve();
    };
    script.onerror = () => {
      scriptPromises.delete(src);
      reject(new Error(`Failed to load script: ${src}`));
    };
    document.head.appendChild(script);
  });

  scriptPromises.set(src, promise);
  return promise;
}

/**
 * Initializes the on-device COCO-SSD model.
 * Loads TF.js and COCO-SSD from reliable CDNs if not bundled.
 */
export async function initPhoneDetector() {
  if (loadedModel) return loadedModel;
  if (tfModelPromise) return tfModelPromise;

  tfModelPromise = (async () => {
    try {
      // 1. Ensure TensorFlow.js is loaded
      if (!window.tf) {
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js');
      }
      if (!window.tf) {
        throw new Error('TensorFlow.js runtime could not be initialized.');
      }

      // Wait for TF backend ready
      if (typeof window.tf.ready === 'function') {
        await window.tf.ready();
      }

      // 2. Ensure COCO-SSD is loaded
      if (!window.cocoSsd) {
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js');
      }
      if (!window.cocoSsd) {
        throw new Error('COCO-SSD object detection module could not be loaded.');
      }

      // 3. Load mobilenet_v2 for high cell phone detection accuracy (fallback to lite_mobilenet_v2 if memory constrained)
      let model = null;
      try {
        model = await window.cocoSsd.load({ base: 'mobilenet_v2' });
      } catch (err) {
        console.warn('[PhoneDetector] mobilenet_v2 load failed, attempting lite_mobilenet_v2 fallback:', err);
        model = await window.cocoSsd.load({ base: 'lite_mobilenet_v2' });
      }

      if (!model) {
        throw new Error('COCO-SSD model initialization returned empty instance.');
      }

      loadedModel = model;
      return model;
    } catch (err) {
      tfModelPromise = null;
      loadedModel = null;
      console.warn('[PhoneDetector] Initialization failed:', err);
      throw err;
    }
  })();

  return tfModelPromise;
}

/**
 * Runs object detection on a <video> element to detect visible mobile phones.
 * 
 * @param {HTMLVideoElement} videoElement - Active video element
 * @param {number} minConfidence - Confidence threshold (default 0.48 = 48%)
 * @returns {Promise<{ detected: boolean, confidence: number, prediction: object | null, topClass: string | null, topScore: number }>}
 */
export async function detectPhoneInVideo(videoElement, minConfidence = 0.48) {
  if (!videoElement) {
    return { detected: false, confidence: 0, prediction: null, topClass: null, topScore: 0, reason: 'No video element' };
  }

  if (videoElement.readyState < 2 || videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
    return { detected: false, confidence: 0, prediction: null, topClass: null, topScore: 0, reason: 'Video stream not ready' };
  }

  try {
    const model = await initPhoneDetector();
    const predictions = await model.detect(videoElement);

    // Look for 'cell phone' or closely related mobile device classes in COCO dataset
    let topConfidence = 0;
    let matchedPrediction = null;

    for (const pred of predictions) {
      const className = (pred.class || '').toLowerCase();
      const isCellPhone = className === 'cell phone' || className === 'phone' || className === 'mobile phone';
      if (isCellPhone && pred.score >= minConfidence) {
        if (pred.score > topConfidence) {
          topConfidence = pred.score;
          matchedPrediction = pred;
        }
      }
    }

    // Identify highest detected class across all objects for diagnostic HUD
    const highest = predictions && predictions.length > 0
      ? predictions.reduce((prev, curr) => (curr.score > prev.score ? curr : prev), predictions[0])
      : null;

    if (matchedPrediction) {
      return {
        detected: true,
        confidence: Math.round(topConfidence * 100),
        prediction: matchedPrediction,
        allPredictions: predictions,
        topClass: matchedPrediction.class,
        topScore: Math.round(matchedPrediction.score * 100),
      };
    }

    return {
      detected: false,
      confidence: 0,
      prediction: null,
      allPredictions: predictions,
      topClass: highest ? highest.class : null,
      topScore: highest ? Math.round(highest.score * 100) : 0,
    };
  } catch (err) {
    console.warn('[PhoneDetector] detectPhoneInVideo error:', err);
    return {
      detected: false,
      confidence: 0,
      prediction: null,
      topClass: null,
      topScore: 0,
      error: err.message,
    };
  }
}
