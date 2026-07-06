import { createToken, createUser } from '../_lib/store.js';
import { sendJson } from '../_lib/response.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const { username, password } = req.body || {};

  if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password.trim()) {
    return sendJson(res, 400, { error: 'Username and password are required' });
  }

  const result = createUser(username.trim(), password);
  if (result.error) {
    return sendJson(res, 409, { error: result.error });
  }

  return sendJson(res, 201, { message: 'User created successfully', token: createToken(result.user), userId: result.user.id });
}