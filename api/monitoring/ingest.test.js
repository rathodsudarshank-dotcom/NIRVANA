import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import test from 'node:test';
import ingestHandler from './ingest.js';

let nextClientId = 40;

async function callIngest({ headers = {}, body, databaseQuery = async () => ({ rowCount: 0 }) } = {}) {
  const req = Object.assign(new EventEmitter(), {
    method: 'POST',
    headers,
    socket: { remoteAddress: `203.0.113.${nextClientId++}` },
  });
  const res = {
    statusCode: 0,
    headers: {},
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
    end() {},
  };
  const pending = ingestHandler(req, res, databaseQuery);
  if (body !== undefined) req.emit('data', Buffer.from(JSON.stringify(body)));
  req.emit('end');
  await pending;
  return res;
}

test('sensor ingestion requires a valid API key', async () => {
  const previous = [process.env.DATABASE_URL, process.env.INGEST_API_KEY];
  process.env.DATABASE_URL = 'postgresql://test.invalid/nirvana';
  process.env.INGEST_API_KEY = 'test-ingest-secret';

  try {
    const response = await callIngest({ body: { readings: [] } });
    assert.equal(response.statusCode, 401);
  } finally {
    if (previous[0] === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previous[0];
    if (previous[1] === undefined) delete process.env.INGEST_API_KEY;
    else process.env.INGEST_API_KEY = previous[1];
  }
});

test('sensor ingestion validates and stores normalized sensor data', async () => {
  const previous = [process.env.DATABASE_URL, process.env.INGEST_API_KEY];
  process.env.DATABASE_URL = 'postgresql://test.invalid/nirvana';
  process.env.INGEST_API_KEY = 'test-ingest-secret';
  let insertedRecords;

  try {
    const response = await callIngest({
      headers: { 'x-api-key': 'test-ingest-secret' },
      body: { readings: [{ sensorId: 'ACC-01', value: 0.24, trend: 8, label: 'Spoofed', unit: 'bad' }] },
      databaseQuery: async (sql, values) => {
        assert.match(sql, /INSERT INTO sensor_readings/);
        insertedRecords = JSON.parse(values[0]);
        return { rowCount: insertedRecords.length };
      },
    });

    assert.equal(response.statusCode, 202);
    assert.equal(response.body.stored, 1);
    assert.equal(insertedRecords[0].label, 'Vibration');
    assert.equal(insertedRecords[0].unit, 'g');
    assert.equal(insertedRecords[0].value, 0.24);
  } finally {
    if (previous[0] === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previous[0];
    if (previous[1] === undefined) delete process.env.INGEST_API_KEY;
    else process.env.INGEST_API_KEY = previous[1];
  }
});

test('sensor ingestion rejects unknown sensors and failed database writes', async () => {
  const previous = [process.env.DATABASE_URL, process.env.INGEST_API_KEY];
  process.env.DATABASE_URL = 'postgresql://test.invalid/nirvana';
  process.env.INGEST_API_KEY = 'test-ingest-secret';

  try {
    const headers = { authorization: 'Bearer test-ingest-secret' };
    const invalid = await callIngest({ headers, body: { readings: [{ sensorId: 'FAKE-01', value: 1 }] } });
    assert.equal(invalid.statusCode, 400);

    const unavailable = await callIngest({
      headers,
      body: { readings: [{ sensorId: 'ACC-01', value: 0.12 }] },
      databaseQuery: async () => { throw new Error('write failed'); },
    });
    assert.equal(unavailable.statusCode, 503);
  } finally {
    if (previous[0] === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previous[0];
    if (previous[1] === undefined) delete process.env.INGEST_API_KEY;
    else process.env.INGEST_API_KEY = previous[1];
  }
});