import { useState, useEffect, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { BRIDGE_INFO } from '../data/bridgeData';
import dashImg from '../assets/bridge4.jpeg';

const REPORT_TIMESTAMP = new Date().toISOString().slice(0, 19).replace('T', ' ');

function AnimatedNumber({ value, decimals = 0, duration = 1800 }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * ease;
      setDisplay(parseFloat(current.toFixed(decimals)));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        prevRef.current = end;
      }
    };

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(animate);

    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [value, decimals, duration]);

  return <>{display}</>;
}

function HealthRing({ score, risk }) {
  const circumference = 2 * Math.PI * 68;
  const offset = circumference - (score / 100) * circumference;
  const color = risk === 'HIGH' ? 'var(--status-red)' : risk === 'MEDIUM' ? 'var(--status-amber)' : 'var(--status-green)';

  return (
    <div className="health-score__ring">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle className="health-score__ring-bg" cx="80" cy="80" r="68" fill="none" strokeWidth="8" />
        <circle
          className="health-score__ring-fill"
          cx="80" cy="80" r="68"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="health-score__value">
        <div className="health-score__number" style={{ color }}>
          <AnimatedNumber value={score} />
        </div>
        <div className="health-score__max">/ 100</div>
      </div>
    </div>
  );
}

export default function Dashboard({ bridgeState, aiState, isAnomaly, isTransitioning, simulateAnomaly, resetSimulation, compact = false }) {
  const ref = useScrollReveal();
  const [activeTab, setActiveTab] = useState('overview');

  const riskClass = bridgeState.risk === 'LOW' ? 'risk-low' : bridgeState.risk === 'HIGH' ? 'risk-high' : 'risk-medium';
  const riskBarColor = bridgeState.risk === 'HIGH' ? 'var(--status-red)' : bridgeState.risk === 'MEDIUM' ? 'var(--status-amber)' : 'var(--status-green)';

  const metrics = [
    { label: 'Vibration', ...bridgeState.vibration },
    { label: 'Strain', ...bridgeState.strain },
    { label: 'Deflection', ...bridgeState.deflection },
    { label: 'Temperature', ...bridgeState.temperature },
    { label: 'Humidity', ...bridgeState.humidity },
  ];

  const tabs = ['Overview', 'Sensors', 'Images', 'Reports'];

  const content = (
    <div className={`dashboard ${compact ? 'dashboard--compact' : ''}`}>
      {/* Tabs */}
      <div className="dashboard__tabs" role="tablist">
        {tabs.map(tab => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab.toLowerCase()}
            className={`dashboard__tab ${activeTab === tab.toLowerCase() ? 'dashboard__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="dashboard__header">
        <div className="dashboard__bridge-info">
          <div>
            <div className="dashboard__bridge-name">{BRIDGE_INFO.name}</div>
            <div className="dashboard__bridge-id">{BRIDGE_INFO.id} — {BRIDGE_INFO.type}</div>
          </div>
        </div>
        <div className={`dashboard__status-badge ${riskClass}`}>
          <span className={`status-dot ${bridgeState.risk === 'HIGH' ? 'status-dot--red' : bridgeState.risk === 'MEDIUM' ? 'status-dot--amber' : 'status-dot--green'}`} />
          {BRIDGE_INFO.status}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="dashboard__body">
          {/* Metrics */}
          <div className="dashboard__metrics">
            {metrics.map((m, i) => (
              <div className="metric-card" key={i}>
                <div className="metric-card__label">{m.label}</div>
                <div className="metric-card__value">
                  <AnimatedNumber value={m.value} decimals={m.unit === 'g' || m.unit === '°' ? 2 : m.unit === 'mm' || m.unit === '°C' ? 1 : 0} />
                  <span className="metric-card__unit">{m.unit}</span>
                </div>
                <div className={`metric-card__trend ${m.trend > 0 ? 'trend-up' : 'trend-down'}`}>
                  {m.trend > 0 ? '↑' : '↓'} {Math.abs(m.trend)}%
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row */}
          <div className="dashboard__bottom">
            {/* Health Score */}
            <div className="health-score">
              <div className="health-score__label">Infrastructure Health Score</div>
              <HealthRing score={bridgeState.healthScore} risk={bridgeState.risk} />
            </div>

            {/* Risk Panel */}
            <div className="risk-panel">
              <div className="risk-panel__header">
                <span className="risk-panel__title">Risk Assessment</span>
                <span className={`risk-panel__badge ${riskClass}`}>{bridgeState.risk}</span>
              </div>

              <div className="risk-panel__bar">
                <div
                  className="risk-panel__bar-fill"
                  style={{ width: `${bridgeState.riskPercent}%`, background: riskBarColor }}
                />
              </div>
              <div className="risk-panel__percent">
                Risk: <AnimatedNumber value={bridgeState.riskPercent} />%
              </div>

              {/* Explainability */}
              {isAnomaly && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>
                    Why is the risk {bridgeState.risk}?
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {[
                      { label: 'Vibration', value: `↑ ${bridgeState.vibration.trend}%` },
                      { label: 'Strain', value: `↑ ${bridgeState.strain.trend}%` },
                      { label: 'Deflection', value: `↑ ${bridgeState.deflection.trend}%` },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                        <span style={{ color: 'var(--status-red)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Simulation Controls */}
              <div className="simulation-controls">
                {!isAnomaly ? (
                  <button className="btn btn--danger btn--sm" onClick={simulateAnomaly} disabled={isTransitioning}>
                    ⚡ Simulate Anomaly
                  </button>
                ) : (
                  <button className="btn btn--reset btn--sm" onClick={resetSimulation} disabled={isTransitioning}>
                    ↺ Reset Simulation
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          <AIAnalysisPanel aiState={aiState} />
        </div>
      )}

      {activeTab === 'sensors' && (
        <div className="dashboard__body">
          <div className="dashboard__metrics" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              { id: 'ACC-01', label: 'Vibration', ...bridgeState.vibration },
              { id: 'SG-01', label: 'Strain', ...bridgeState.strain },
              { id: 'LVDT-01', label: 'Deflection', ...bridgeState.deflection },
              { id: 'TILT-01', label: 'Tilt', ...bridgeState.tilt },
              { id: 'TEMP-01', label: 'Temperature', ...bridgeState.temperature },
              { id: 'HUM-01', label: 'Humidity', ...bridgeState.humidity },
            ].map((s, i) => {
              const status = s.trend > 15 ? 'CRITICAL' : s.trend > 5 ? 'WARNING' : 'NORMAL';
              const statusColor = status === 'CRITICAL' ? 'var(--status-red)' : status === 'WARNING' ? 'var(--status-amber)' : 'var(--status-green)';
              return (
                <div className="metric-card" key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)' }}>{s.id}</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 600, color: statusColor, padding: '2px 8px', borderRadius: 4, background: status === 'CRITICAL' ? 'var(--status-red-bg)' : status === 'WARNING' ? 'var(--status-amber-bg)' : 'var(--status-green-bg)' }}>
                      {status}
                    </span>
                  </div>
                  <div className="metric-card__label">{s.label}</div>
                  <div className="metric-card__value">
                    {s.value} <span className="metric-card__unit">{s.unit}</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>Range: {s.range}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'images' && (
        <div className="images-tab">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
            <div className="images-tab__container">
              <img
                className="images-tab__img"
                src={dashImg}
                alt="Bridge structural inspection view"
                loading="lazy"
              />
              <div className="images-tab__detection">
                <div className="images-tab__detection-label">Possible Crack — 93%</div>
              </div>
            </div>
            <div className="images-tab__info">
              <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent)', marginBottom: 12 }}>
                AI Detection — CAM-01
              </div>
              <div className="images-tab__info-row">
                <span className="images-tab__info-label">Detection</span>
                <span className="images-tab__info-value">Possible Surface Crack</span>
              </div>
              <div className="images-tab__info-row">
                <span className="images-tab__info-label">Confidence</span>
                <span className="images-tab__info-value" style={{ color: 'var(--status-amber)' }}>93%</span>
              </div>
              <div className="images-tab__info-row">
                <span className="images-tab__info-label">Status</span>
                <span className="images-tab__info-value" style={{ color: 'var(--status-amber)' }}>Review Required</span>
              </div>
              <div className="images-tab__info-row">
                <span className="images-tab__info-label">Camera</span>
                <span className="images-tab__info-value">CAM-01 — Tower Position</span>
              </div>
              <div className="images-tab__info-row">
                <span className="images-tab__info-label">Timestamp</span>
                <span className="images-tab__info-value">2026-10-08 14:32:17</span>
              </div>
              <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', borderLeft: '3px solid var(--status-amber)' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 4 }}>Note</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  AI detection is decision support. Human inspection remains essential for confirmation and structural assessment.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="dashboard__body">
          <ReportsTab bridgeState={bridgeState} aiState={aiState} />
        </div>
      )}
    </div>
  );

  if (compact) {
    return content;
  }

  return (
    <section className="section" id="live-demo">
      <div className="container container--wide">
        <div ref={ref} className="reveal">
          <div className="section__label">Live Dashboard</div>
          <h2 className="section__title">Structural Health Monitoring</h2>
          <p className="section__subtitle">
            Real-time infrastructure metrics, AI analysis, and risk assessment —
            all in one integrated monitoring interface.
          </p>
        </div>

        {content}
      </div>
    </section>
  );
}

function AIAnalysisPanel({ aiState }) {
  const findingIcon = (status) => {
    if (status === 'ok') return { cls: 'ai-analysis__finding-icon--ok', icon: '✓' };
    if (status === 'warning') return { cls: 'ai-analysis__finding-icon--warning', icon: '!' };
    return { cls: 'ai-analysis__finding-icon--critical', icon: '✕' };
  };

  return (
    <div className="ai-analysis">
      <div className="ai-analysis__header">
        <div className="ai-analysis__title">
          <span className="ai-analysis__title-dot" />
          NIRVANA AI Analysis
        </div>
        <div className="ai-analysis__confidence">
          Model Confidence: {aiState.confidence}%
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Current Risk Level</span>
        <span className={`risk-panel__badge ${aiState.risk === 'LOW' ? 'risk-low' : aiState.risk === 'HIGH' ? 'risk-high' : 'risk-medium'}`}>
          {aiState.risk}
        </span>
      </div>

      <div className="ai-analysis__findings">
        {aiState.findings.map((f, i) => {
          const { cls, icon } = findingIcon(f.status);
          return (
            <div key={i} className="ai-analysis__finding">
              <div className={`ai-analysis__finding-icon ${cls}`}>{icon}</div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{f.text}</span>
            </div>
          );
        })}
      </div>

      <div className="ai-analysis__recommendation">
        <div className="ai-analysis__recommendation-label">Recommendation</div>
        <div className="ai-analysis__recommendation-text">{aiState.recommendation}</div>
      </div>
    </div>
  );
}

function ReportsTab({ bridgeState, aiState }) {
  const now = REPORT_TIMESTAMP;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: 16 }}>
          Bridge Health Report
        </div>

        {[
          { section: 'General Information', rows: [
            ['Bridge ID', BRIDGE_INFO.id],
            ['Bridge Name', BRIDGE_INFO.name],
            ['Type', BRIDGE_INFO.type],
            ['Span', BRIDGE_INFO.span],
            ['Location', BRIDGE_INFO.location],
            ['Monitoring Status', BRIDGE_INFO.status],
          ]},
          { section: 'Current Assessment', rows: [
            ['Health Score', `${bridgeState.healthScore} / 100`],
            ['Risk Level', bridgeState.risk],
            ['AI Confidence', `${aiState.confidence}%`],
            ['Report Timestamp', now],
          ]},
          { section: 'Sensor Readings', rows: [
            ['Vibration (ACC-01)', `${bridgeState.vibration.value} ${bridgeState.vibration.unit}`],
            ['Strain (SG-01)', `${bridgeState.strain.value} ${bridgeState.strain.unit}`],
            ['Deflection (LVDT-01)', `${bridgeState.deflection.value} ${bridgeState.deflection.unit}`],
            ['Tilt (TILT-01)', `${bridgeState.tilt.value} ${bridgeState.tilt.unit}`],
            ['Temperature (TEMP-01)', `${bridgeState.temperature.value} ${bridgeState.temperature.unit}`],
            ['Humidity', `${bridgeState.humidity.value} ${bridgeState.humidity.unit}`],
          ]},
        ].map((section, si) => (
          <div key={si} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>
              {section.section}
            </div>
            {section.rows.map(([label, value], ri) => (
              <div key={ri} className="report-modal__row">
                <span className="report-modal__row-label">{label}</span>
                <span className="report-modal__row-value">{value}</span>
              </div>
            ))}
          </div>
        ))}

        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>
            AI Recommendation
          </div>
          <div className="ai-analysis__recommendation">
            <div className="ai-analysis__recommendation-text">{aiState.recommendation}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
