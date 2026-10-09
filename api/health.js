import { applyCors, setSecurityHeaders, checkRateLimit } from './_lib/security.js';

export default async function handler(req, res) {
  applyCors(req, res);
  setSecurityHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  if (!checkRateLimit(req, { windowMs: 60000, maxRequests: 60, keyPrefix: 'health' })) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return;
  }

  const databaseConfigured = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim());

  res.status(200).json({
    status: 'ok',
    service: 'nirvana-api',
    mode: databaseConfigured ? 'connected' : 'demo',
    databaseConfigured,
    message: databaseConfigured
      ? 'Backend ready for persisted telemetry.'
      : 'Demo mode active: database and live telemetry are not configured for this deployment.',
  });
}
