import { NORMAL_STATE, ANOMALY_STATE, AI_NORMAL, AI_ANOMALY } from '../../src/data/bridgeData.js';
import { INITIAL_REPORTS } from '../../src/data/reportData.js';

export function buildDemoSummary() {
  return {
    source: 'demo',
    databaseConfigured: false,
    mode: 'demo',
    message: 'Demo mode active: no database or live telemetry is configured for this deployment.',
    isAnomaly: false,
    bridgeState: { ...NORMAL_STATE },
    aiState: { ...AI_NORMAL },
    metrics: {
      healthScore: NORMAL_STATE.healthScore,
      risk: NORMAL_STATE.risk,
      riskPercent: NORMAL_STATE.riskPercent,
    },
  };
}

export function buildDemoReadings() {
  return {
    source: 'demo',
    databaseConfigured: false,
    sensors: [
      { id: 'ACC-01', label: 'Vibration', value: NORMAL_STATE.vibration.value, unit: NORMAL_STATE.vibration.unit, trend: NORMAL_STATE.vibration.trend },
      { id: 'SG-01', label: 'Strain', value: NORMAL_STATE.strain.value, unit: NORMAL_STATE.strain.unit, trend: NORMAL_STATE.strain.trend },
      { id: 'LVDT-01', label: 'Deflection', value: NORMAL_STATE.deflection.value, unit: NORMAL_STATE.deflection.unit, trend: NORMAL_STATE.deflection.trend },
      { id: 'TILT-01', label: 'Tilt', value: NORMAL_STATE.tilt.value, unit: NORMAL_STATE.tilt.unit, trend: NORMAL_STATE.tilt.trend },
      { id: 'TEMP-01', label: 'Temperature', value: NORMAL_STATE.temperature.value, unit: NORMAL_STATE.temperature.unit, trend: NORMAL_STATE.temperature.trend },
      { id: 'HUM-01', label: 'Humidity', value: NORMAL_STATE.humidity.value, unit: NORMAL_STATE.humidity.unit, trend: NORMAL_STATE.humidity.trend },
    ],
  };
}

export function buildDemoAnomalies() {
  return {
    source: 'demo',
    databaseConfigured: false,
    anomalies: [
      {
        id: 'SIM-ALERT-001',
        status: 'normal',
        title: 'No active anomaly in demo mode',
        severity: 'LOW',
        summary: 'The sample dashboard is operating on simulated baseline data. No real sensor telemetry is connected.',
      },
    ],
    lastUpdated: new Date().toISOString(),
  };
}

export function buildDemoReports() {
  return {
    source: 'demo',
    databaseConfigured: false,
    reports: INITIAL_REPORTS,
    total: INITIAL_REPORTS.length,
  };
}

export function buildDemoState() {
  return {
    bridgeState: { ...NORMAL_STATE },
    aiState: { ...AI_NORMAL },
    isAnomaly: false,
  };
}

export function buildAnomalyState() {
  return {
    bridgeState: { ...ANOMALY_STATE },
    aiState: { ...AI_ANOMALY },
    isAnomaly: true,
  };
}
