import { useState, useCallback, useRef } from 'react';
import { NORMAL_STATE, ANOMALY_STATE, AI_NORMAL, AI_ANOMALY } from '../data/bridgeData';
import { INITIAL_REPORTS, createSimulatedAnomalyReport } from '../data/reportData';

export function useSimulation() {
  const [isAnomaly, setIsAnomaly] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [bridgeState, setBridgeState] = useState({ ...NORMAL_STATE });
  const [aiState, setAiState] = useState({ ...AI_NORMAL });
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [activeReportId, setActiveReportId] = useState(INITIAL_REPORTS[0]?.id || 'REP-2026-0915-01');
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
      if (filtered.length > 0) {
        setActiveReportId(filtered[0].id);
      }
      return filtered.length > 0 ? filtered : INITIAL_REPORTS;
    });
  }, []);

  return {
    isAnomaly,
    isTransitioning,
    bridgeState,
    aiState,
    reports,
    activeReportId,
    setActiveReportId,
    simulateAnomaly,
    resetSimulation,
    clearDemoReports,
  };
}
