import { applyCors, setSecurityHeaders, checkRateLimit, getModeFromConfig } from '../_lib/security.js';
import { buildDemoAnomalies } from '../_lib/demoData.js';

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

  if (!checkRateLimit(req, { windowMs: 60000, maxRequests: 40, keyPrefix: 'anomalies' })) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return;
  }

  if (getModeFromConfig() === 'demo') {
    res.status(200).json(buildDemoAnomalies());
    return;
  }

  res.status(200).json({
    source: 'database',
    databaseConfigured: true,
    mode: 'connected',
    anomalies: [],
    lastUpdated: new Date().toISOString(),
  });
}
