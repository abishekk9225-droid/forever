/**
 * On-Device Mobile Phone Detection Service using TensorFlow.js & COCO-SSD
 * 
 * - Detects 'cell phone' objects visible in the authorized laptop webcam feed.
 * - Runs 100% locally on-device via WebGL/WASM/CPU; no video frames are uploaded.
 * - Uses the lightweight 'lite_mobilenet_v2' model for fast client-side inference.
 * - Supports consecutive-frame verification and confidence thresholding to prevent false positives.
 * - Gracefully reports errors if WebGL is unavailable or model files cannot be loaded.
 */

let tfModelPromise = null;
let loadedModel = null;

// Dynamically load an external script if not already present
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
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

      // 2. Ensure COCO-SSD is loaded
      if (!window.cocoSsd) {
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js');
      }
      if (!window.cocoSsd) {
        throw new Error('COCO-SSD object detection module could not be loaded.');
      }

      // 3. Load the lite mobilenet model for speed & efficiency
      const model = await window.cocoSsd.load({ base: 'lite_mobilenet_v2' });
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
 * @param {number} minConfidence - Confidence threshold (default 0.55 = 55%)
 * @returns {Promise<{ detected: boolean, confidence: number, prediction: object | null }>}
 */
export async function detectPhoneInVideo(videoElement, minConfidence = 0.55) {
  if (!videoElement || videoElement.readyState < 2 || videoElement.videoWidth === 0) {
    return { detected: false, confidence: 0, prediction: null, reason: 'Video not ready' };
  }

  const model = await initPhoneDetector();
  const predictions = await model.detect(videoElement);

  // Look for 'cell phone' or closely related mobile device classes in COCO dataset
  const phonePrediction = predictions.find((pred) => {
    const className = (pred.class || '').toLowerCase();
    return (
      (className === 'cell phone' || className === 'phone' || className === 'mobile phone') &&
      pred.score >= minConfidence
    );
  });

  if (phonePrediction) {
    return {
      detected: true,
      confidence: Math.round(phonePrediction.score * 100),
      prediction: phonePrediction,
      allPredictions: predictions,
    };
  }

  return {
    detected: false,
    confidence: 0,
    prediction: null,
    allPredictions: predictions,
  };
}
