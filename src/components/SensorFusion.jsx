import { useScrollReveal } from '../hooks/useScrollReveal';
import { useSimulationContext } from '../context/SimulationContext';

const NORMAL_STATE = [
  { label: 'Vibration', value: 'NORMAL', status: 'ok' },
  { label: 'Strain', value: 'NORMAL', status: 'ok' },
  { label: 'Deflection', value: 'NORMAL', status: 'ok' },
  { label: 'Camera', value: 'NO DAMAGE', status: 'ok' },
  { label: 'Environment', value: 'NORMAL', status: 'ok' },
];

const ANOMALY_STATE = [
  { label: 'Vibration', value: 'ABNORMAL', status: 'error' },
  { label: 'Strain', value: 'HIGH', status: 'warning' },
  { label: 'Deflection', value: 'ELEVATED', status: 'warning' },
  { label: 'Camera', value: 'POSSIBLE DAMAGE', status: 'error' },
  { label: 'Environment', value: 'NORMAL', status: 'ok' },
];

export default function SensorFusion() {
  const headingRef = useScrollReveal();
  const diagramRef = useScrollReveal();
  const {
    isAnomaly,
    isTransitioning,
    simulateAnomaly,
    resetSimulation,
    backendMode,
    bridgeState,
    aiState,
  } = useSimulationContext();

  const isConnected = backendMode === 'connected';
  const liveInputs = [
    { label: 'Vibration', metric: bridgeState.vibration },
    { label: 'Strain', metric: bridgeState.strain },
    { label: 'Deflection', metric: bridgeState.deflection },
    { label: 'Tilt', metric: bridgeState.tilt },
    { label: 'Temperature', metric: bridgeState.temperature },
    { label: 'Humidity', metric: bridgeState.humidity },
  ].map(({ label, metric }) => ({
    label,
    value: `${metric.value} ${metric.unit}`,
    status: metric.trend >= 15 ? 'error' : metric.trend >= 5 ? 'warning' : 'ok',
  }));
  const inputs = isConnected ? liveInputs : isAnomaly ? ANOMALY_STATE : NORMAL_STATE;
  const risk = isConnected ? aiState.risk : isAnomaly ? 'HIGH' : 'LOW';
  const riskClass = risk === 'HIGH' ? 'risk-high' : risk === 'MEDIUM' ? 'risk-medium' : 'risk-low';
  const recommendation = isConnected
    ? aiState.recommendation
    : isAnomaly ? 'INSPECTION REQUIRED' : 'ROUTINE MONITORING';

  return (
    <section className="section">
      <div className="container">
        <div ref={headingRef} className="reveal">
          <div className="section__label">Sensor Fusion</div>
          <h2 className="section__title">Multimodal Data Integration</h2>
          <p className="section__subtitle">
            {isConnected
              ? 'Connected sensor readings are screened using fixed trend thresholds. This view does not represent an AI model.'
              : 'Explore a simulated sensor-fusion workflow with illustrative readings and risk findings.'}
          </p>
        </div>

        <div className="fusion__interactive reveal" ref={diagramRef}>
          {!isConnected && (
            <div className="fusion__controls" style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '40px' }}>
              <button
                className={`btn ${!isAnomaly ? 'btn--primary' : 'btn--secondary'}`}
                onClick={resetSimulation}
                disabled={isTransitioning}
              >
                Normal State
              </button>
              <button
                className={`btn ${isAnomaly ? 'btn--primary' : 'btn--secondary'}`}
                style={isAnomaly ? { background: 'var(--status-red)', borderColor: 'var(--status-red)' } : {}}
                onClick={simulateAnomaly}
                disabled={isTransitioning}
              >
                Trigger Anomaly
              </button>
            </div>
          )}

          <div className="fusion__diagram" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div className="fusion__inputs" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {inputs.map((input, i) => (
                <div key={i} className="fusion__input-card" style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', border: `1px solid var(--border-medium)` }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{input.label}</div>
                  <div style={{ 
                    fontWeight: '600', 
                    color: input.status === 'ok' ? 'var(--success)' : input.status === 'warning' ? 'var(--warning)' : 'var(--error)' 
                  }}>
                    {input.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="fusion__arrow">
              <div className="fusion__arrow-line" />
              <div className="fusion__arrow-head" />
            </div>

            <div className="fusion__core" style={{ margin: '24px auto' }}>
              {isConnected ? 'Trend Threshold Screening' : 'Simulated Sensor-Fusion Workflow'}
            </div>

            <div className="fusion__arrow">
              <div className="fusion__arrow-line" />
              <div className="fusion__arrow-head" />
            </div>

            <div className="fusion__output-card" style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', marginTop: '24px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Assessed Risk</div>
                  <div className={`hero__status-risk-value ${riskClass}`} style={{ fontSize: '1.5rem', marginTop: '8px' }}>{risk}</div>
                </div>
                <div style={{ width: '1px', height: '40px', background: 'var(--border-medium)' }}></div>
                <div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Recommendation</div>
                  <div style={{ 
                    fontSize: '1.1rem', 
                    marginTop: '8px',
                    fontWeight: '600',
                    color: isAnomaly ? 'var(--error)' : 'var(--text-primary)'
                  }}>{recommendation}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
