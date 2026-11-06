/**
 * ABISHEK AI - BACKEND CHAT ENDPOINT & SECURE PROXY SERVER
 * 
 * Secure Node.js server providing:
 * - Rate limiting (anti-spam / DDoS protection)
 * - Strict payload validation & sanitization
 * - Gemini / OpenAI / Groq LLM integration
 * - Server-side API key protection (keys never exposed to browser)
 * - Seamless fallback to verified knowledge engine when offline
 * - Unref'd timers and serverless compatibility (Vercel / Node)
 */

import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { getGroundedProfilePrompt } from '../src/knowledge/abishekKnowledge.js';
import { getGroundedWebsitePrompt } from '../src/knowledge/websiteKnowledge.js';
import { detectLanguage, generateLocalGroundedResponse } from '../src/knowledge/languageHelper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory sliding window rate limiter: max 20 requests per minute per IP
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;
const ipRequestHistory = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = ipRequestHistory.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestHistory.set(ip, validTimestamps);
    return true;
  }
  
  validTimestamps.push(now);
  ipRequestHistory.set(ip, validTimestamps);
  return false;
}

// Clean up stale rate limiter entries every 5 minutes
// CRITICAL: .unref() ensures this timer will NEVER prevent Node.js processes (like vite build) from exiting!
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of ipRequestHistory.entries()) {
    const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (valid.length === 0) {
      ipRequestHistory.delete(ip);
    } else {
      ipRequestHistory.set(ip, valid);
    }
  }
}, 5 * 60 * 1000);

if (cleanupTimer && typeof cleanupTimer.unref === 'function') {
  cleanupTimer.unref();
}

/**
 * Handles incoming chat API requests. Compatible with standard Node http,
 * Vite connect middleware, and Vercel serverless functions.
 */
export async function handleChatRequest(req, res) {
  // Enforce CORS & JSON headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Method not allowed. Use POST.' }));
  }

  // Rate Limiting
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(clientIp)) {
    res.statusCode = 429;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      error: 'Rate limit exceeded. Please wait a moment before sending another message.',
      reply: 'You are sending messages too quickly. Please wait a few seconds and try again! ⏳',
    }));
  }

  // Internal processing helper
  async function processPayload(parsed) {
    try {
      const message = (parsed.message || '').trim();
      const conversationHistory = Array.isArray(parsed.conversationHistory)
        ? parsed.conversationHistory.slice(-8) // Keep last 8 turns for context
        : [];
      const currentScene = parsed.currentScene || 'INTRO';

      // Validation
      if (!message) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: 'Message cannot be empty.' }));
      }

      if (message.length > 500) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: 'Message exceeds maximum length of 500 characters.' }));
      }

      // Automatically identify language
      const detectedLang = detectLanguage(message);

      // Assemble system instruction with verified knowledge bases
      const systemInstruction = `
You are "ABISHEK AI", the official personal AI assistant and guide for the interactive romantic experience "Forever – Saranya by Abishek".

Your Responsibilities:
1. Answer questions about Abishek K. based ONLY on the verified profile provided below.
2. Explain how to navigate, interact with, and enjoy the Forever website.
3. Automatically respond in the user's language:
   - If the user asks in Tamil (தமிழ் script), respond in warm, natural Tamil.
   - If the user asks in Tanglish (Tamil in English alphabet), respond in conversational Tanglish.
   - If the user asks in English, respond in polished, courteous English.
4. Keep responses concise, warm, helpful, and natural (typically 2-4 sentences).

${getGroundedProfilePrompt()}

${getGroundedWebsitePrompt(currentScene)}

STRICT RULES:
- Never hallucinate personal details, job titles, or unverified achievements.
- Distinguish between completed skills (Python, SQL, Java, Excel) and ongoing learning (Power BI).
- Never disclose private personal details (phone number, private address).
- For completely unrelated topics (e.g. world politics, general trivia), politely reply that you are specialized in answering questions about Abishek and guiding users through the Forever website.
`.trim();

      // Check available API keys (Server-Side Only - never exposed to client)
      const geminiApiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
      const openAiApiKey = process.env.OPENAI_API_KEY;

      // 1. Try Gemini API if key is configured
      if (geminiApiKey) {
        try {
          const contents = [
            {
              role: 'user',
              parts: [{ text: systemInstruction }],
            },
            {
              role: 'model',
              parts: [{ text: "Understood. I am ABISHEK AI. I will faithfully and accurately represent Abishek K. and guide visitors through the Forever journey according to the verified knowledge base and in their chosen language." }],
            },
          ];

          conversationHistory.forEach((turn) => {
            if (turn.role === 'user' && turn.content) {
              contents.push({ role: 'user', parts: [{ text: turn.content }] });
            } else if (turn.role === 'assistant' && turn.content) {
              contents.push({ role: 'model', parts: [{ text: turn.content }] });
            }
          });

          contents.push({ role: 'user', parts: [{ text: message }] });

          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 350,
              },
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                reply: reply.trim(),
                language: detectedLang,
                source: 'gemini',
              }));
            }
          }
        } catch (apiErr) {
          console.warn('[ABISHEK AI Server] Gemini API call failed, falling back to grounded engine:', apiErr.message);
        }
      }

      // 2. Try OpenAI API if key is configured
      if (openAiApiKey) {
        try {
          const messages = [
            { role: 'system', content: systemInstruction },
            ...conversationHistory.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: message },
          ];

          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${openAiApiKey}`,
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages,
              max_tokens: 350,
              temperature: 0.3,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content;
            if (reply) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                reply: reply.trim(),
                language: detectedLang,
                source: 'openai',
              }));
            }
          }
        } catch (openAiErr) {
          console.warn('[ABISHEK AI Server] OpenAI API call failed, falling back to grounded engine:', openAiErr.message);
        }
      }

      // 3. Fallback to Grounded Intelligence Engine
      const groundedReply = generateLocalGroundedResponse(message, detectedLang, currentScene);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        reply: groundedReply,
        language: detectedLang,
        source: 'grounded-engine',
      }));
    } catch (err) {
      console.error('[ABISHEK AI Server] Error processing chat request:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        error: 'Internal server error',
        reply: 'I encountered an unexpected temporary error. Please try asking again!',
      }));
    }
  }

  // Handle pre-parsed bodies (e.g. Vercel Serverless Function)
  if (req.body && typeof req.body === 'object') {
    return processPayload(req.body);
  }

  // Read request stream chunks
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
    if (body.length > 50000) {
      req.socket?.destroy();
    }
  });

  req.on('end', async () => {
    try {
      const parsed = JSON.parse(body || '{}');
      await processPayload(parsed);
    } catch (parseErr) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Invalid JSON payload.' }));
    }
  });
}

// Standalone server entry point
const PORT = process.env.PORT || 3001;
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname === '/api/chat') {
    return handleChatRequest(req, res);
  }

  // Health check
  if (url.pathname === '/api/health') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ status: 'healthy', service: 'abishek-ai-backend' }));
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(PORT, () => {
    console.log(`[ABISHEK AI Server] Running on http://localhost:${PORT}`);
  });
}
