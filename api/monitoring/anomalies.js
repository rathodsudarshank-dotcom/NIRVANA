import { queryDatabase } from '../_lib/database.js';
import { buildAnomaliesFromSensorRows, LATEST_SENSOR_READINGS_SQL } from '../_lib/sensorData.js';
import { applyCors, setSecurityHeaders, checkRateLimit, getDatabaseConfigured } from '../_lib/security.js';
import { buildDemoAnomalies } from '../_lib/demoData.js';

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

  if (!checkRateLimit(req, { windowMs: 60000, maxRequests: 40, keyPrefix: 'anomalies' })) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return;
  }

  if (!getDatabaseConfigured()) {
    res.status(200).json(buildDemoAnomalies());
    return;
  }

  try {
    const result = await databaseQuery(LATEST_SENSOR_READINGS_SQL);
    const lastUpdated = result.rows.reduce((latest, row) => {
      const timestamp = new Date(row.recordedAt).toISOString();
      return timestamp > latest ? timestamp : latest;
    }, '');

    res.status(200).json({
      source: 'database',
      databaseConfigured: true,
      mode: 'connected',
      anomalies: buildAnomaliesFromSensorRows(result.rows),
      lastUpdated: lastUpdated || null,
    });
  } catch {
    res.status(503).json({ error: 'Anomaly screening is temporarily unavailable.' });
  }
}
