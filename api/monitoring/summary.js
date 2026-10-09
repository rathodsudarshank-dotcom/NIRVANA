import { applyCors, setSecurityHeaders, checkRateLimit, getModeFromConfig } from '../_lib/security.js';
import { buildDemoSummary } from '../_lib/demoData.js';

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

  if (!checkRateLimit(req, { windowMs: 60000, maxRequests: 50, keyPrefix: 'monitoring-summary' })) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return;
  }

  const mode = getModeFromConfig();

  if (mode === 'demo') {
    const demo = buildDemoSummary();
    res.status(200).json(demo);
    return;
  }

  res.status(200).json({
    source: 'database',
    databaseConfigured: true,
    mode: 'connected',
    message: 'Connected mode is enabled when a durable database is configured.',
    isAnomaly: false,
    bridgeState: {
      vibration: { value: 0.12, unit: 'g', trend: -12 },
      strain: { value: 145, unit: 'µε', trend: -8 },
      deflection: { value: 2.3, unit: 'mm', trend: -10 },
      tilt: { value: 0.04, unit: '°', trend: -3 },
      temperature: { value: 28.4, unit: '°C', trend: -2 },
      humidity: { value: 62, unit: '%', trend: -5 },
      healthScore: 82,
      risk: 'LOW',
      riskPercent: 12,
    },
    aiState: {
      risk: 'LOW',
      confidence: 94,
      findings: [{ status: 'ok', text: 'Database-connected summary endpoint placeholder. Configure live telemetry to replace this synthetic state.' }],
      recommendation: 'Connect a durable database and telemetry source to replace the demo baseline with production data.',
    },
  });
}
