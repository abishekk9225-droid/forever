/**
 * Client-Side AI Service for ABISHEK AI
 * Handles communication with secure server /api/chat endpoint,
 * request timeouts, error handling, and seamless local fallback.
 */

import { detectLanguage, generateLocalGroundedResponse } from '../knowledge/languageHelper';

const CHAT_ENDPOINT = '/api/chat';
const REQUEST_TIMEOUT_MS = 12000; // 12-second timeout

/**
 * Sends a message to the ABISHEK AI backend endpoint.
 * 
 * @param {Object} options
 * @param {string} options.message - The user's input text
 * @param {Array<{role: string, content: string}>} [options.conversationHistory] - Previous conversation turns
 * @param {string} [options.currentScene] - The current active scene ID (e.g. 'INTRO', 'PHONE_CALL')
 * @returns {Promise<{reply: string, language: string, source: string}>}
 */
export async function sendChatMessage({ message, conversationHistory = [], currentScene = 'INTRO' }) {
  const cleanMessage = (message || '').trim();
  if (!cleanMessage) {
    throw new Error('Message cannot be empty.');
  }

  const detectedLanguage = detectLanguage(cleanMessage);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: cleanMessage,
        conversationHistory,
        currentScene,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.reply) {
        return {
          reply: data.reply,
          language: data.language || detectedLanguage,
          source: data.source || 'server',
        };
      }
    }

    // If server responded with an error (e.g. rate limit), check if custom message returned
    if (response.status === 429) {
      const errorData = await response.json().catch(() => ({}));
      return {
        reply: errorData.reply || 'You are asking questions quite quickly! Please give me a few seconds and try again. ⏳',
        language: detectedLanguage,
        source: 'rate-limit',
      };
    }

    throw new Error(`Server returned status ${response.status}`);
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('[ABISHEK AI Client] Backend call failed or offline, using local grounded response:', err.message);

    // Graceful offline fallback to verified knowledge base
    const localReply = generateLocalGroundedResponse(cleanMessage, detectedLanguage, currentScene);
    return {
      reply: localReply,
      language: detectedLanguage,
      source: 'local-fallback',
    };
  }
}
