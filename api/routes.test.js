import assert from 'node:assert/strict';
import test from 'node:test';
import healthHandler from './health.js';
import anomaliesHandler from './monitoring/anomalies.js';
import readingsHandler from './monitoring/readings.js';
import summaryHandler from './monitoring/summary.js';
import reportsHandler from './reports/index.js';

const readRoutes = [
  ['health', healthHandler],
  ['summary', summaryHandler],
  ['readings', readingsHandler],
  ['anomalies', anomaliesHandler],
  ['reports', reportsHandler],
];

async function invoke(handler, method, clientId, databaseQuery) {
  const res = {
    statusCode: 0,
    headers: {},
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
    end() {},
  };

  await handler({
    method,
    headers: { origin: 'http://localhost:5173' },
    socket: { remoteAddress: `198.51.100.${clientId}` },
  }, res, databaseQuery);

  return res;
}

test('read-only API routes return their demo payloads when no database is configured', async () => {
  const previousDatabaseUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;

  try {
    const results = new Map();
    for (const [index, [name, handler]] of readRoutes.entries()) {
      results.set(name, await invoke(handler, 'GET', index + 1));
    }

    for (const response of results.values()) assert.equal(response.statusCode, 200);
    assert.equal(results.get('health').body.mode, 'demo');
    assert.equal(results.get('summary').body.source, 'demo');
    assert.equal(results.get('readings').body.sensors.length, 6);
    assert.equal(results.get('anomalies').body.source, 'demo');
    assert.equal(results.get('reports').body.source, 'demo');
  } finally {
    if (previousDatabaseUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousDatabaseUrl;
  }
});

test('read-only API routes return connected-mode response shapes when configured', async () => {
  const previousDatabaseUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = 'postgresql://test.invalid/nirvana';
  const readings = [
    { id: 'ACC-01', label: 'Vibration', value: '0.41', unit: 'g', trend: '32', recordedAt: new Date().toISOString() },
    { id: 'SG-01', label: 'Strain', value: '387', unit: 'µε', trend: '21', recordedAt: new Date().toISOString() },
    { id: 'LVDT-01', label: 'Deflection', value: '8.7', unit: 'mm', trend: '18', recordedAt: new Date().toISOString() },
    { id: 'TILT-01', label: 'Tilt', value: '0.19', unit: '°', trend: '14', recordedAt: new Date().toISOString() },
    { id: 'TEMP-01', label: 'Temperature', value: '29.1', unit: '°C', trend: '1', recordedAt: new Date().toISOString() },
    { id: 'HUM-01', label: 'Humidity', value: '64', unit: '%', trend: '2', recordedAt: new Date().toISOString() },
  ];
  const databaseQuery = async (sql) => {
    if (sql.includes('COUNT(DISTINCT sensor_id)')) return { rows: [{ sensor_count: readings.length }] };
    if (sql.includes('FROM reports')) return { rows: [{ id: 'stored-report', payload: { title: 'Stored report' }, created_at: new Date().toISOString() }] };
    return { rows: readings };
  };

  try {
    for (const [index, [name, handler]] of readRoutes.entries()) {
      const response = await invoke(handler, 'GET', index + 11, databaseQuery);
      assert.equal(response.statusCode, 200, `${name} status`);
      assert.equal(response.body.mode, 'connected', `${name} mode`);
    }
    const health = await invoke(healthHandler, 'GET', 20, databaseQuery);
    assert.equal(health.body.databaseConfigured, true);
    assert.equal(health.body.telemetryAvailable, true);
    const summary = await invoke(summaryHandler, 'GET', 30, databaseQuery);
    assert.equal(summary.body.bridgeState.vibration.value, 0.41);
    assert.equal(summary.body.aiState.source, 'rules');
    const reports = await invoke(reportsHandler, 'GET', 31, databaseQuery);
    assert.equal(reports.body.reports[0].title, 'Stored report');
  } finally {
    if (previousDatabaseUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousDatabaseUrl;
  }
});

test('read-only API routes reject unsupported methods', async () => {
  for (const [index, [name, handler]] of readRoutes.entries()) {
    const response = await invoke(handler, 'POST', index + 21);
    assert.equal(response.statusCode, 405, `${name} method`);
  }
});

test('health reports database failures instead of claiming a connected mode', async () => {
  const previousDatabaseUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = 'postgresql://test.invalid/nirvana';

  try {
    const response = await invoke(healthHandler, 'GET', 32, async () => {
      throw new Error('database unavailable');
    });
    assert.equal(response.statusCode, 503);
    assert.equal(response.body.mode, 'unavailable');
    assert.equal(response.body.telemetryAvailable, false);
  } finally {
    if (previousDatabaseUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousDatabaseUrl;
  }
});

test('health stays in demo mode until all supported sensors have recent readings', async () => {
  const previousDatabaseUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = 'postgresql://test.invalid/nirvana';

  try {
    const response = await invoke(healthHandler, 'GET', 33, async () => ({ rows: [{ sensor_count: 5 }] }));
    assert.equal(response.statusCode, 200);
    assert.equal(response.body.databaseConfigured, true);
    assert.equal(response.body.telemetryAvailable, false);
    assert.equal(response.body.mode, 'demo');
  } finally {
    if (previousDatabaseUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousDatabaseUrl;
  }
});