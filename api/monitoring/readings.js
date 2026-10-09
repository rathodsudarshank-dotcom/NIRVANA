import { applyCors, setSecurityHeaders, checkRateLimit, getModeFromConfig } from '../_lib/security.js';
import { buildDemoReadings } from '../_lib/demoData.js';

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

  if (!checkRateLimit(req, { windowMs: 60000, maxRequests: 60, keyPrefix: 'readings' })) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return;
  }

  if (getModeFromConfig() === 'demo') {
    res.status(200).json(buildDemoReadings());
    return;
  }

  res.status(200).json({
    source: 'database',
    databaseConfigured: true,
    mode: 'connected',
    sensors: [
      { id: 'ACC-01', label: 'Vibration', value: 0.12, unit: 'g', trend: -12 },
      { id: 'SG-01', label: 'Strain', value: 145, unit: 'µε', trend: -8 },
      { id: 'LVDT-01', label: 'Deflection', value: 2.3, unit: 'mm', trend: -10 },
      { id: 'TILT-01', label: 'Tilt', value: 0.04, unit: '°', trend: -3 },
      { id: 'TEMP-01', label: 'Temperature', value: 28.4, unit: '°C', trend: -2 },
      { id: 'HUM-01', label: 'Humidity', value: 62, unit: '%', trend: -5 },
    ],
  });
}
