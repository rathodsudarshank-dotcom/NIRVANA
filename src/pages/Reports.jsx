import { useMemo } from 'react';
import PageLayout from '../components/PageLayout';
import { useSimulationContext } from '../context/SimulationContext';
import { BRIDGE_INFO } from '../data/bridgeData';

export default function Reports() {
  const { bridgeState, aiState } = useSimulationContext();
  const now = useMemo(() => new Date().toISOString().slice(0, 19).replace('T', ' '), []);

  return (
    <PageLayout>
      <div className="section">
        <div className="container container--wide">
          <div className="report-modal" style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', padding: '40px', border: '1px solid var(--border-subtle)' }}>
            <div className="report-modal__header">
              <h2 className="report-modal__title" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Bridge Health Report</h2>
            </div>

            {[
              {
                title: 'General Information',
                rows: [
                  ['Bridge ID', BRIDGE_INFO.id],
                  ['Bridge Name', BRIDGE_INFO.name],
                  ['Type', BRIDGE_INFO.type],
                  ['Span', BRIDGE_INFO.span],
                  ['Location', BRIDGE_INFO.location],
                  ['Built', BRIDGE_INFO.built],
                  ['Last Inspection', BRIDGE_INFO.lastInspection],
                  ['Monitoring Status', BRIDGE_INFO.status],
                ],
              },
              {
                title: 'Current Assessment',
                rows: [
                  ['Health Score', `${bridgeState.healthScore} / 100`],
                  ['Risk Level', bridgeState.risk],
                  ['Risk Percentage', `${bridgeState.riskPercent}%`],
                  ['AI Confidence', `${aiState.confidence}%`],
                ],
              },
              {
                title: 'Sensor Readings',
                rows: [
                  ['Vibration (ACC-01)', `${bridgeState.vibration.value} ${bridgeState.vibration.unit} (${bridgeState.vibration.trend > 0 ? '+' : ''}${bridgeState.vibration.trend}%)`],
                  ['Strain (SG-01)', `${bridgeState.strain.value} ${bridgeState.strain.unit} (${bridgeState.strain.trend > 0 ? '+' : ''}${bridgeState.strain.trend}%)`],
                  ['Deflection (LVDT-01)', `${bridgeState.deflection.value} ${bridgeState.deflection.unit} (${bridgeState.deflection.trend > 0 ? '+' : ''}${bridgeState.deflection.trend}%)`],
                  ['Tilt (TILT-01)', `${bridgeState.tilt.value} ${bridgeState.tilt.unit}`],
                  ['Temperature (TEMP-01)', `${bridgeState.temperature.value} ${bridgeState.temperature.unit}`],
                  ['Humidity', `${bridgeState.humidity.value} ${bridgeState.humidity.unit}`],
                ],
              },
              {
                title: 'AI Analysis Findings',
                rows: aiState.findings.map((f) => [
                  f.status === 'ok' ? '✓' : f.status === 'warning' ? '⚠' : '✕',
                  f.text,
                ]),
              },
            ].map((section, si) => (
              <div key={si} className="report-modal__section" style={{ marginBottom: '32px' }}>
                <div className="report-modal__section-title" style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--accent)' }}>{section.title}</div>
                {section.rows.map(([label, value], ri) => (
                  <div key={ri} className="report-modal__row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span className="report-modal__row-label" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                    <span className="report-modal__row-value" style={{ fontWeight: '500' }}>{value}</span>
                  </div>
                ))}
              </div>
            ))}

            <div className="report-modal__section" style={{ marginBottom: '32px' }}>
              <div className="report-modal__section-title" style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--accent)' }}>Recommendation</div>
              <div className="ai-analysis__recommendation" style={{ padding: '16px', background: 'var(--accent-dim)', borderLeft: '4px solid var(--accent)' }}>
                <div className="ai-analysis__recommendation-text">{aiState.recommendation}</div>
              </div>
            </div>

            <div className="report-modal__section">
              <div className="report-modal__row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span className="report-modal__row-label" style={{ color: 'var(--text-muted)' }}>Report Generated</span>
                <span className="report-modal__row-value" style={{ color: 'var(--text-muted)' }}>{now}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
