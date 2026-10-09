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

async function invoke(handler, method, clientId) {
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
  }, res);

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

  try {
    for (const [index, [name, handler]] of readRoutes.entries()) {
      const response = await invoke(handler, 'GET', index + 11);
      assert.equal(response.statusCode, 200, `${name} status`);
      assert.equal(response.body.mode, 'connected', `${name} mode`);
    }
    assert.equal((await invoke(healthHandler, 'GET', 20)).body.databaseConfigured, true);
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