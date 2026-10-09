import { queryDatabase } from '../_lib/database.js';
import { buildSummaryFromSensorRows, LATEST_SENSOR_READINGS_SQL } from '../_lib/sensorData.js';
import { applyCors, setSecurityHeaders, checkRateLimit, getDatabaseConfigured } from '../_lib/security.js';
import { buildDemoSummary } from '../_lib/demoData.js';

export default async function handler(req, res, databaseQuery = queryDatabase) {
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

  if (!getDatabaseConfigured()) {
    const demo = buildDemoSummary();
    res.status(200).json(demo);
    return;
  }

  try {
    const result = await databaseQuery(LATEST_SENSOR_READINGS_SQL);
    const summary = buildSummaryFromSensorRows(result.rows);
    if (!summary) {
      res.status(503).json({ error: 'Recent readings from all supported sensors are required for a connected summary.' });
      return;
    }

    res.status(200).json({
      source: 'database',
      databaseConfigured: true,
      mode: 'connected',
      ...summary,
    });
  } catch {
    res.status(503).json({ error: 'Monitoring summary is temporarily unavailable.' });
  }
}
