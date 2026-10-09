import { queryDatabase } from '../_lib/database.js';
import {
  applyCors,
  checkRateLimit,
  isApiKeyValid,
  readJsonBody,
  setSecurityHeaders,
} from '../_lib/security.js';
import { normalizeSensorReadings } from '../_lib/sensorData.js';

export default async function handler(req, res, databaseQuery = queryDatabase) {
  applyCors(req, res);
  setSecurityHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  if (!process.env.DATABASE_URL?.trim() || !process.env.INGEST_API_KEY) {
    res.status(503).json({ error: 'Telemetry ingestion is not configured.' });
    return;
  }

  if (!checkRateLimit(req, { windowMs: 60000, maxRequests: 30, keyPrefix: 'sensor-ingest' })) {
    res.status(429).json({ error: 'Too many ingestion requests. Please try again later.' });
    return;
  }

  const authorization = req.headers.authorization || '';
  const bearerKey = authorization.toLowerCase().startsWith('bearer ') ? authorization.slice(7).trim() : '';
  const apiKey = req.headers['x-api-key'];
  if (!isApiKeyValid(bearerKey, process.env.INGEST_API_KEY) && !isApiKeyValid(apiKey, process.env.INGEST_API_KEY)) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  let payload;
  try {
    payload = await readJsonBody(req, 20000);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Invalid payload.' });
    return;
  }

  let readings;
  try {
    readings = normalizeSensorReadings(payload.readings);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Invalid sensor readings.' });
    return;
  }

  const records = readings.map(({ sensorId, label, value, unit, trend, recordedAt }) => ({
    sensor_id: sensorId,
    label,
    value,
    unit,
    trend,
    recorded_at: recordedAt,
  }));

  try {
    const result = await databaseQuery(`
      INSERT INTO sensor_readings (sensor_id, label, value, unit, trend, recorded_at)
      SELECT item.sensor_id, item.label, item.value, item.unit, item.trend, item.recorded_at
      FROM jsonb_to_recordset($1::jsonb) AS item(
        sensor_id text, label text, value double precision, unit text,
        trend double precision, recorded_at timestamptz
      )
      RETURNING sensor_id
    `, [JSON.stringify(records)]);

    res.status(202).json({ accepted: true, stored: result.rowCount });
  } catch {
    res.status(503).json({ error: 'Unable to store sensor readings right now.' });
  }
}