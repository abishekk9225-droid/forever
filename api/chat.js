/**
 * Vercel Serverless Function Handler for /api/chat
 */
import { handleChatRequest } from '../server/server.js';

export default async function handler(req, res) {
  return handleChatRequest(req, res);
}

