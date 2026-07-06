import { sendJson } from './_lib/response.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const { message } = req.body || {};
  if (typeof message !== 'string' || !message.trim()) {
    return sendJson(res, 400, { error: 'Message is required' });
  }

  const reply = `I received your message: ${message.trim()}`;
  return sendJson(res, 200, { reply, message: reply });
}