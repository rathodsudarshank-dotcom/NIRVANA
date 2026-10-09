import { queryDatabase } from '../_lib/database.js';
import { LATEST_SENSOR_READINGS_SQL } from '../_lib/sensorData.js';
import { applyCors, setSecurityHeaders, checkRateLimit, getDatabaseConfigured } from '../_lib/security.js';
import { buildDemoReadings } from '../_lib/demoData.js';

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

  if (!checkRateLimit(req, { windowMs: 60000, maxRequests: 60, keyPrefix: 'readings' })) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return;
  }

  if (!getDatabaseConfigured()) {
    res.status(200).json(buildDemoReadings());
    return;
  }

  try {
    const result = await databaseQuery(LATEST_SENSOR_READINGS_SQL);
    res.status(200).json({
      source: 'database',
      databaseConfigured: true,
      mode: 'connected',
      sensors: result.rows.map((row) => ({
        id: row.id,
        label: row.label,
        value: Number(row.value),
        unit: row.unit,
        trend: Number(row.trend),
      })),
    });
  } catch {
    res.status(503).json({ error: 'Sensor readings are temporarily unavailable.' });
  }
}
