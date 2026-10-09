import { useState, useCallback, useRef, useEffect } from 'react';
import { NORMAL_STATE, ANOMALY_STATE, AI_NORMAL, AI_ANOMALY } from '../data/bridgeData';
import { INITIAL_REPORTS, createSimulatedAnomalyReport } from '../data/reportData';
import { getHealth, getMonitoringSummary, getSensorReadings, getAnomalyResults, getReports } from '../lib/api';

export function useSimulation() {
  const [isAnomaly, setIsAnomaly] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [bridgeState, setBridgeState] = useState({ ...NORMAL_STATE });
  const [aiState, setAiState] = useState({ ...AI_NORMAL });
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [activeReportId, setActiveReportId] = useState(INITIAL_REPORTS[0]?.id || 'REP-2026-0915-01');
  const [backendMode, setBackendMode] = useState('demo');
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const animFrameRef = useRef(null);

  const animateValues = useCallback((from, to, aiTarget, duration = 1800) => {
    setIsTransitioning(true);
    const start = performance.now();

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      const interpolate = (a, b) => a + (b - a) * ease;

      setBridgeState({
        vibration: {
          ...to.vibration,
          value: parseFloat(interpolate(from.vibration.value, to.vibration.value).toFixed(2)),
          trend: Math.round(interpolate(from.vibration.trend, to.vibration.trend)),
        },
        strain: {
          ...to.strain,
          value: Math.round(interpolate(from.strain.value, to.strain.value)),
          trend: Math.round(interpolate(from.strain.trend, to.strain.trend)),
        },
        deflection: {
          ...to.deflection,
          value: parseFloat(interpolate(from.deflection.value, to.deflection.value).toFixed(1)),
          trend: Math.round(interpolate(from.deflection.trend, to.deflection.trend)),
        },
        tilt: {
          ...to.tilt,
          value: parseFloat(interpolate(from.tilt.value, to.tilt.value).toFixed(2)),
          trend: Math.round(interpolate(from.tilt.trend, to.tilt.trend)),
        },
        temperature: {
          ...to.temperature,
          value: parseFloat(interpolate(from.temperature.value, to.temperature.value).toFixed(1)),
          trend: Math.round(interpolate(from.temperature.trend, to.temperature.trend)),
        },
        humidity: {
          ...to.humidity,
          value: Math.round(interpolate(from.humidity.value, to.humidity.value)),
          trend: Math.round(interpolate(from.humidity.trend, to.humidity.trend)),
        },
        healthScore: Math.round(interpolate(from.healthScore, to.healthScore)),
        risk: progress > 0.5 ? to.risk : from.risk,
        riskPercent: Math.round(interpolate(from.riskPercent, to.riskPercent)),
      });

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsTransitioning(false);
        setAiState({ ...aiTarget });
      }
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  const simulateAnomaly = useCallback(() => {
    if (isAnomaly || isTransitioning) return;
    setIsAnomaly(true);

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const newSimReport = createSimulatedAnomalyReport(now, ANOMALY_STATE, AI_ANOMALY);

    setReports(prev => [newSimReport, ...prev]);
    setActiveReportId(newSimReport.id);

    animateValues(NORMAL_STATE, ANOMALY_STATE, AI_ANOMALY);
  }, [isAnomaly, isTransitioning, animateValues]);

  const resetSimulation = useCallback(() => {
    if (!isAnomaly || isTransitioning) return;
    setIsAnomaly(false);
    animateValues(ANOMALY_STATE, NORMAL_STATE, AI_NORMAL);
    // Historical reports are preserved (Requirement 6)
  }, [isAnomaly, isTransitioning, animateValues]);

  const clearDemoReports = useCallback(() => {
    setReports(prev => {
      const filtered = prev.filter(r => !r.isSimulated);
      setActiveReportId(filtered[0]?.id || '');
      return filtered;
    });
  }, []);

  useEffect(() => {
    let didCancel = false;

    const loadBackendState = async () => {
      try {
        setApiLoading(true);
        setApiError('');

        const health = await getHealth();
        if (didCancel) return;

        const isConnected = health?.mode === 'connected' && health?.databaseConfigured;

        if (!isConnected) {
          setBackendMode('demo');
          setApiLoading(false);
          return;
        }

        const [summary, readings, anomalies, reportData] = await Promise.all([
          getMonitoringSummary(),
          getSensorReadings(),
          getAnomalyResults(),
          getReports(),
        ]);

        if (didCancel) return;

        if (summary?.bridgeState) {
          setBridgeState(summary.bridgeState);
        }

        if (summary?.aiState) {
          setAiState(summary.aiState);
        }

        if (summary?.isAnomaly !== undefined) {
          setIsAnomaly(Boolean(summary.isAnomaly));
        }

        if (readings?.sensors?.length) {
          const sensorMap = {};
          readings.sensors.forEach((sensor) => {
            sensorMap[sensor.label?.toLowerCase()] = sensor;
          });

          setBridgeState((current) => ({
            ...current,
            vibration: sensorMap.vibration ? { ...current.vibration, value: sensorMap.vibration.value, unit: sensorMap.vibration.unit, trend: sensorMap.vibration.trend } : current.vibration,
            strain: sensorMap.strain ? { ...current.strain, value: sensorMap.strain.value, unit: sensorMap.strain.unit, trend: sensorMap.strain.trend } : current.strain,
            deflection: sensorMap.deflection ? { ...current.deflection, value: sensorMap.deflection.value, unit: sensorMap.deflection.unit, trend: sensorMap.deflection.trend } : current.deflection,
            tilt: sensorMap.tilt ? { ...current.tilt, value: sensorMap.tilt.value, unit: sensorMap.tilt.unit, trend: sensorMap.tilt.trend } : current.tilt,
            temperature: sensorMap.temperature ? { ...current.temperature, value: sensorMap.temperature.value, unit: sensorMap.temperature.unit, trend: sensorMap.temperature.trend } : current.temperature,
            humidity: sensorMap.humidity ? { ...current.humidity, value: sensorMap.humidity.value, unit: sensorMap.humidity.unit, trend: sensorMap.humidity.trend } : current.humidity,
          }));
        }

        if (anomalies?.anomalies?.length) {
          setIsAnomaly(Boolean(anomalies.anomalies.some((item) => item.status !== 'normal')));
        }

        if (Array.isArray(reportData?.reports)) {
          setReports(reportData.reports);
          setActiveReportId(reportData.reports[0]?.id || '');
        }

        setBackendMode('connected');
      } catch (error) {
        if (!didCancel) {
          setBackendMode('demo');
          setApiError(error.message || 'Backend unavailable. Using demo data.');
        }
      } finally {
        if (!didCancel) {
          setApiLoading(false);
        }
      }
    };

    loadBackendState();

    return () => {
      didCancel = true;
    };
  }, []);

  return {
    isAnomaly,
    isTransitioning,
    bridgeState,
    aiState,
    reports,
    activeReportId,
    backendMode,
    apiLoading,
    apiError,
    setActiveReportId,
    simulateAnomaly,
    resetSimulation,
    clearDemoReports,
  };
}
