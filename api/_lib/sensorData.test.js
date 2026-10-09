import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildAnomaliesFromSensorRows,
  buildSummaryFromSensorRows,
  normalizeSensorReadings,
  SENSOR_DEFINITIONS,
} from './sensorData.js';

test('sensor ingestion normalizes trusted metadata and numeric values', () => {
  const readings = normalizeSensorReadings([
    { sensorId: 'ACC-01', value: '0.24', trend: '8', label: 'Untrusted label', unit: 'bad' },
  ], Date.parse('2026-10-09T12:00:00Z'));

  assert.deepEqual(readings[0], {
    sensorId: 'ACC-01',
    label: 'Vibration',
    value: 0.24,
    unit: 'g',
    trend: 8,
    recordedAt: '2026-10-09T12:00:00.000Z',
  });
});

test('sensor ingestion rejects unknown sensors, invalid numbers, and stale timestamps', () => {
  const now = Date.parse('2026-10-09T12:00:00Z');
  assert.throws(() => normalizeSensorReadings([{ sensorId: 'FAKE-01', value: 1 }], now), /Unknown sensor ID/);
  assert.throws(() => normalizeSensorReadings([{ sensorId: 'ACC-01', value: Infinity }], now), /Invalid value/);
  assert.throws(() => normalizeSensorReadings([
    { sensorId: 'ACC-01', value: 1, recordedAt: '2026-08-01T00:00:00Z' },
  ], now), /Invalid timestamp/);
});

test('risk screening uses recent sensor trends and requires all supported sensors', () => {
  const rows = SENSOR_DEFINITIONS.map((sensor, index) => ({
    id: sensor.id,
    value: index === 0 ? '0.41' : '10',
    trend: index === 0 ? '32' : '1',
  }));
  const summary = buildSummaryFromSensorRows(rows);

  assert.equal(summary.bridgeState.vibration.value, 0.41);
  assert.equal(summary.bridgeState.risk, 'HIGH');
  assert.equal(summary.isAnomaly, true);
  assert.equal(summary.aiState.source, 'rules');
  assert.equal(buildSummaryFromSensorRows(rows.slice(1)), null);
  assert.equal(buildAnomaliesFromSensorRows(rows).length, 1);

  const mediumRows = rows.map((row, index) => ({ ...row, trend: index === 0 ? '8' : '1' }));
  assert.equal(buildSummaryFromSensorRows(mediumRows).bridgeState.risk, 'MEDIUM');
  assert.equal(buildSummaryFromSensorRows(mediumRows).isAnomaly, true);
});