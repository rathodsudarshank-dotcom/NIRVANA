import { queryDatabase } from './_lib/database.js';
import { SENSOR_DEFINITIONS } from './_lib/sensorData.js';
import { applyCors, setSecurityHeaders, checkRateLimit, getDatabaseConfigured } from './_lib/security.js';

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

  if (!checkRateLimit(req, { windowMs: 60000, maxRequests: 60, keyPrefix: 'health' })) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return;
  }

  const databaseConfigured = getDatabaseConfigured();

  if (!databaseConfigured) {
    res.status(200).json({
      status: 'ok',
      service: 'nirvana-api',
      mode: 'demo',
      databaseConfigured: false,
      telemetryAvailable: false,
      message: 'Demo mode active: database and live telemetry are not configured for this deployment.',
    });
    return;
  }

  try {
    const result = await databaseQuery(`
      SELECT COUNT(DISTINCT sensor_id)::int AS sensor_count
      FROM sensor_readings
      WHERE recorded_at >= NOW() - INTERVAL '10 minutes'
    `);
    const telemetryAvailable = Number(result.rows[0]?.sensor_count) >= SENSOR_DEFINITIONS.length;

    res.status(200).json({
      status: 'ok',
      service: 'nirvana-api',
      mode: telemetryAvailable ? 'connected' : 'demo',
      databaseConfigured,
      telemetryAvailable,
      message: telemetryAvailable
        ? 'Database connected with recent readings from all supported sensors.'
        : 'Database connected, but recent readings from all supported sensors are not available.',
    });
  } catch {
    res.status(503).json({
      status: 'error',
      service: 'nirvana-api',
      mode: 'unavailable',
      databaseConfigured: true,
      telemetryAvailable: false,
      message: 'Database is configured but unavailable or not initialized. Check the connection and apply api/_lib/schema.sql.',
    });
  }
}
