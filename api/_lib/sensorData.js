export const SENSOR_DEFINITIONS = [
  { id: 'ACC-01', label: 'Vibration', key: 'vibration', unit: 'g', range: '0.00 – 0.50 g' },
  { id: 'SG-01', label: 'Strain', key: 'strain', unit: 'µε', range: '0 – 500 µε' },
  { id: 'LVDT-01', label: 'Deflection', key: 'deflection', unit: 'mm', range: '0.0 – 15.0 mm' },
  { id: 'TILT-01', label: 'Tilt', key: 'tilt', unit: '°', range: '0.00 – 0.50°' },
  { id: 'TEMP-01', label: 'Temperature', key: 'temperature', unit: '°C', range: '-20 – 60 °C' },
  { id: 'HUM-01', label: 'Humidity', key: 'humidity', unit: '%', range: '0 – 100%' },
];

const sensorsById = new Map(SENSOR_DEFINITIONS.map((sensor) => [sensor.id, sensor]));

export const LATEST_SENSOR_READINGS_SQL = `
  SELECT DISTINCT ON (sensor_id)
    sensor_id AS id, label, value, unit, trend, recorded_at AS "recordedAt"
  FROM sensor_readings
  WHERE recorded_at >= NOW() - INTERVAL '10 minutes'
  ORDER BY sensor_id, recorded_at DESC, id DESC
`;

export function normalizeSensorReadings(readings, now = Date.now()) {
  if (!Array.isArray(readings) || readings.length < 1 || readings.length > 100) {
    throw new Error('Provide between 1 and 100 sensor readings.');
  }

  return readings.map((reading) => {
    if (!reading || typeof reading !== 'object' || Array.isArray(reading)) {
      throw new Error('Each sensor reading must be an object.');
    }

    const sensor = sensorsById.get(reading.sensorId);
    const value = Number(reading.value);
    const trend = Number(reading.trend ?? 0);
    const recordedAt = reading.recordedAt === undefined ? new Date(now) : new Date(reading.recordedAt);

    if (!sensor) throw new Error('Unknown sensor ID.');
    if (!Number.isFinite(value) || Math.abs(value) > 1_000_000_000) {
      throw new Error(`Invalid value for ${sensor.id}.`);
    }
    if (!Number.isFinite(trend) || Math.abs(trend) > 1000) {
      throw new Error(`Invalid trend for ${sensor.id}.`);
    }
    if (!Number.isFinite(recordedAt.getTime()) || recordedAt.getTime() > now + 5 * 60_000 || recordedAt.getTime() < now - 30 * 24 * 60 * 60_000) {
      throw new Error(`Invalid timestamp for ${sensor.id}.`);
    }

    return {
      sensorId: sensor.id,
      label: sensor.label,
      value,
      unit: sensor.unit,
      trend,
      recordedAt: recordedAt.toISOString(),
    };
  });
}

export function buildSummaryFromSensorRows(rows) {
  const rowsById = new Map(rows.map((row) => [row.id, row]));
  if (SENSOR_DEFINITIONS.some((sensor) => !rowsById.has(sensor.id))) return null;

  const metrics = Object.fromEntries(SENSOR_DEFINITIONS.map((sensor) => {
    const row = rowsById.get(sensor.id);
    return [sensor.key, {
      value: Number(row.value),
      unit: sensor.unit,
      trend: Number(row.trend),
      range: sensor.range,
    }];
  }));
  const riskPercent = Math.min(100, Math.max(0, Math.round(Math.max(...rows.map((row) => Number(row.trend))))));
  const risk = riskPercent >= 15 ? 'HIGH' : riskPercent >= 5 ? 'MEDIUM' : 'LOW';
  const findings = SENSOR_DEFINITIONS.map((sensor) => {
    const trend = Number(rowsById.get(sensor.id).trend);
    const status = trend >= 15 ? 'critical' : trend >= 5 ? 'warning' : 'ok';
    return { status, text: `${sensor.label} trend is ${trend}% against baseline.` };
  });

  return {
    isAnomaly: risk !== 'LOW',
    bridgeState: {
      ...metrics,
      healthScore: 100 - riskPercent,
      risk,
      riskPercent,
    },
    aiState: {
      source: 'rules',
      risk,
      confidence: null,
      findings,
      recommendation: risk === 'HIGH'
        ? 'High sensor trends detected. Arrange an on-site structural assessment.'
        : risk === 'MEDIUM'
          ? 'Elevated sensor trends detected. Review readings and increase monitoring.'
          : 'Sensor trends are within the configured screening thresholds.',
    },
  };
}

export function buildAnomaliesFromSensorRows(rows) {
  return rows
    .filter((row) => Number(row.trend) >= 5)
    .map((row) => {
      const sensor = sensorsById.get(row.id);
      const trend = Number(row.trend);
      return {
        id: `TREND-${row.id}`,
        status: trend >= 15 ? 'critical' : 'warning',
        title: `${sensor?.label || row.label} trend elevated`,
        severity: trend >= 15 ? 'HIGH' : 'MEDIUM',
        summary: `Latest reading is ${trend}% above its baseline trend. This is a rule-based screening alert, not an AI diagnosis.`,
      };
    });
}