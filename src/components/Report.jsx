import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { BRIDGE_INFO } from '../data/bridgeData';

const REPORT_GENERATED_AT = new Date().toISOString().slice(0, 19).replace('T', ' ');

export default function Report({ bridgeState, aiState }) {
  const [showModal, setShowModal] = useState(false);
  const ref = useScrollReveal();
  const assessmentMethod = aiState.source === 'rules'
    ? 'Rule-based sensor trend thresholds'
    : `${aiState.confidence}% model confidence`;

  return (
    <>
      <div ref={ref} className="reveal" style={{ textAlign: 'center', padding: '40px 0' }}>
        <button className="btn btn--secondary" onClick={() => setShowModal(true)}>
          View Full Report
        </button>
      </div>

      {showModal && (
        <div className="report-overlay" onClick={() => setShowModal(false)} role="dialog" aria-modal="true" aria-label="Bridge Health Report">
          <div className="report-modal" onClick={(e) => e.stopPropagation()}>
            <div className="report-modal__header">
              <h2 className="report-modal__title">Bridge Health Report</h2>
              <button className="report-modal__close" onClick={() => setShowModal(false)} aria-label="Close report">×</button>
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
                  ['Assessment Method', assessmentMethod],
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
                title: aiState.source === 'rules' ? 'Rule-Based Screening Findings' : 'AI Analysis Findings',
                rows: aiState.findings.map((f) => [
                  f.status === 'ok' ? '✓' : f.status === 'warning' ? '⚠' : '✕',
                  f.text,
                ]),
              },
            ].map((section, si) => (
              <div key={si} className="report-modal__section">
                <div className="report-modal__section-title">{section.title}</div>
                {section.rows.map(([label, value], ri) => (
                  <div key={ri} className="report-modal__row">
                    <span className="report-modal__row-label">{label}</span>
                    <span className="report-modal__row-value">{value}</span>
                  </div>
                ))}
              </div>
            ))}

            <div className="report-modal__section">
              <div className="report-modal__section-title">Recommendation</div>
              <div className="ai-analysis__recommendation">
                <div className="ai-analysis__recommendation-text">{aiState.recommendation}</div>
              </div>
            </div>

            <div className="report-modal__section">
              <div className="report-modal__row">
                <span className="report-modal__row-label">Report Generated</span>
                <span className="report-modal__row-value">{REPORT_GENERATED_AT}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
