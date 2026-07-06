import { createToken, findUserByUsername } from '../_lib/store.js';
import { sendJson } from '../_lib/response.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const { username, password } = req.body || {};

  if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password.trim()) {
    return sendJson(res, 400, { error: 'Username and password are required' });
  }

  const user = findUserByUsername(username.trim());
  if (!user || user.password !== password) {
    return sendJson(res, 401, { error: 'Invalid username or password' });
  }

  return sendJson(res, 200, { token: createToken(user), userId: user.id });
}