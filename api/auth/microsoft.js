import { createOAuthUser, createToken } from '../_lib/store.js';
import { sendJson } from '../_lib/response.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const { idToken } = req.body || {};
  if (typeof idToken !== 'string' || !idToken.trim()) {
    return sendJson(res, 400, { error: 'OAuth token is required' });
  }

  const email = `microsoft-${Date.now()}@example.com`;
  const { user } = createOAuthUser(email, 'microsoft');
  return sendJson(res, 200, { token: createToken(user), userId: user.id });
}