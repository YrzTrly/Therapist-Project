import { sendJson } from './_lib/response.js';

export default function handler(req, res) {
  return sendJson(res, 200, { status: 'ok', service: 'theramind-api' });
}