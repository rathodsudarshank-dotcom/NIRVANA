import { queryDatabase } from '../_lib/database.js';
import { applyCors, setSecurityHeaders, checkRateLimit, getDatabaseConfigured } from '../_lib/security.js';
import { buildDemoReports } from '../_lib/demoData.js';

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

  if (!checkRateLimit(req, { windowMs: 60000, maxRequests: 40, keyPrefix: 'reports' })) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return;
  }

  if (!getDatabaseConfigured()) {
    res.status(200).json(buildDemoReports());
    return;
  }

  try {
    const result = await databaseQuery('SELECT id, payload, created_at FROM reports ORDER BY created_at DESC LIMIT 100');
    const reports = result.rows.map((row) => ({
      ...row.payload,
      id: row.payload.id || row.id,
      createdAt: row.created_at,
    }));

    res.status(200).json({
      source: 'database',
      databaseConfigured: true,
      mode: 'connected',
      reports,
      total: reports.length,
    });
  } catch {
    res.status(503).json({ error: 'Reports are temporarily unavailable.' });
  }
}
