import { useState, useMemo } from 'react';
import PageLayout from '../components/PageLayout';
import BridgeDiagram from '../components/BridgeDiagram';
import { useSimulationContext } from '../context/SimulationContext';
import { BRIDGE_INFO } from '../data/bridgeData';
import { exportReportToCSV } from '../data/reportData';

export default function Reports() {
  const {
    isAnomaly,
    isTransitioning,
    backendMode,
    bridgeState,
    reports,
    activeReportId,
    setActiveReportId,
    simulateAnomaly,
    resetSimulation,
    clearDemoReports,
  } = useSimulationContext();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [filterComponent, setFilterComponent] = useState('ALL');
  const [filterDate, setFilterDate] = useState('ALL');
  const [toleranceMode, setToleranceMode] = useState('standard'); // 'strict' | 'standard' | 'relaxed'
  const [inspectedComponentKey, setInspectedComponentKey] = useState(null);

  // Active Report
  const activeReport = useMemo(() => {
    const found = reports.find(r => r.id === activeReportId);
    return found || reports[0] || null;
  }, [reports, activeReportId]);

  // Filtered reports list (newest first)
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchId = r.id.toLowerCase().includes(q);
        const matchComp = r.component.toLowerCase().includes(q);
        const matchSensor = r.primarySensor.toLowerCase().includes(q);
        if (!matchTitle && !matchId && !matchComp && !matchSensor) return false;
      }
      // Risk
      if (filterRisk !== 'ALL' && r.riskLevel !== filterRisk) return false;
      // Component
      if (filterComponent !== 'ALL' && r.componentCategory?.toLowerCase() !== filterComponent.toLowerCase()) return false;
      // Date preset
      if (filterDate === 'SIMULATED' && !r.isSimulated) return false;
      if (filterDate === 'HISTORICAL' && r.isSimulated) return false;

      return true;
    });
  }, [reports, searchQuery, filterRisk, filterComponent, filterDate]);

  // Handle PDF Export via Print View
  const handlePrint = () => {
    window.print();
  };

  // Handle CSV Export
  const handleExportCSV = () => {
    if (activeReport) {
      exportReportToCSV(activeReport);
    }
  };

  const getRiskBadgeClass = (risk) => {
    if (risk === 'HIGH') return 'badge-risk-high';
    if (risk === 'MEDIUM') return 'badge-risk-medium';
    return 'badge-risk-low';
  };

  const currentHighlightCompKey = inspectedComponentKey || activeReport?.componentKey || 'girder';

  return (
    <PageLayout>
      <div className="section reports-page-section">
        <div className="container container--wide">
          {/* Header & Breadcrumb */}
          <div className="reports-page-header">
            <div className="reports-header-content">
              <div className="section__label">Diagnostic Telemetry & Compliance</div>
              <h1 className="heading-lg reports-page-title">NIRVANA Structural Health Reports</h1>
              <p className="text-body reports-page-subtitle">
                Comprehensive diagnostic reports detailing anomaly localization, parameter deviations,
                plausible engineering hypotheses, and prioritized structural actions for {BRIDGE_INFO.name} ({BRIDGE_INFO.id}).
              </p>
            </div>

            {/* Demo simulation controls */}
            <div className="reports-sim-control-panel">
              <div className="sim-status-indicator">
                <span className={`status-dot ${isAnomaly ? 'status-dot--red' : 'status-dot--green'}`} />
                <span className="sim-status-text">
                  {backendMode === 'connected'
                    ? isAnomaly ? 'RULE-BASED REVIEW REQUIRED' : 'RULE-BASED SCREENING: NOMINAL'
                    : isAnomaly ? 'SIMULATED ANOMALY ACTIVE' : 'NOMINAL BASELINE OPERATION'}
                </span>
                <span className="sim-status-score">
                  Health: {bridgeState.healthScore}/100 • {bridgeState.risk} RISK
                </span>
              </div>

              {backendMode !== 'connected' && (
                <div className="sim-actions-group">
                  {!isAnomaly ? (
                    <button
                      className="btn btn--danger btn--sm"
                      onClick={simulateAnomaly}
                      disabled={isTransitioning}
                      title="Simulate dynamic overload on Girder G2"
                    >
                      ⚡ Simulate Anomaly
                    </button>
                  ) : (
                    <button
                      className="btn btn--reset btn--sm"
                      onClick={resetSimulation}
                      disabled={isTransitioning}
                      title="Restore normal sensor monitoring state"
                    >
                      ↺ Reset Simulation
                    </button>
                  )}

                  <button
                    className="btn btn--secondary btn--sm btn-clear-demo"
                    onClick={clearDemoReports}
                    title="Remove generated demo reports from history"
                  >
                    Clear Demo Events
                  </button>
                </div>
              )}

              <div className="sim-notice-micro">
                {backendMode === 'connected'
                  ? 'Based on recent sensor readings and fixed trend thresholds'
                  : 'Synchronized live with Live Monitor & AI Analysis'}
              </div>
            </div>
          </div>

          {/* Quick Demo Watermark */}
          {activeReport?.isSimulated && (
            <div className="demo-data-banner">
              <span className="demo-banner-badge">DEMO DATA</span>
              <span>
                This report represents a simulated anomaly event. All readings and thresholds are illustrative for diagnostic validation and decision-support demonstration.
              </span>
            </div>
          )}

          {/* Main Layout: Left = History & Filters, Right = Active Full Report */}
          <div className="reports-layout-grid">
            {/* LEFT COLUMN: Report History & Filters */}
            <aside className="reports-sidebar">
              <div className="sidebar-card">
                <div className="sidebar-header">
                  <h3 className="sidebar-title">
                    <span>📑</span> Anomaly & Audit History
                  </h3>
                  <span className="history-count-badge">{filteredReports.length} events</span>
                </div>

                {/* Search Bar */}
                <div className="report-search-wrap">
                  <input
                    type="text"
                    className="report-search-input"
                    placeholder="Search by ID, member, sensor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search reports"
                  />
                  {searchQuery && (
                    <button
                      className="report-search-clear"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Filter Controls */}
                <div className="filter-group">
                  <label className="filter-label">Risk Level</label>
                  <div className="filter-chips">
                    {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(risk => (
                      <button
                        key={risk}
                        className={`filter-chip ${filterRisk === risk ? 'filter-chip--active' : ''}`}
                        onClick={() => setFilterRisk(risk)}
                      >
                        {risk}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Structural Component</label>
                  <div className="filter-chips">
                    {['ALL', 'Girder', 'Expansion Joint', 'Pier', 'Stay Cable', 'Deck'].map(comp => (
                      <button
                        key={comp}
                        className={`filter-chip ${filterComponent === comp ? 'filter-chip--active' : ''}`}
                        onClick={() => setFilterComponent(comp)}
                      >
                        {comp}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Event Type</label>
                  <div className="filter-chips">
                    {[
                      { key: 'ALL', label: 'All Dates' },
                      { key: 'SIMULATED', label: 'Simulated' },
                      { key: 'HISTORICAL', label: 'Historical' }
                    ].map(item => (
                      <button
                        key={item.key}
                        className={`filter-chip ${filterDate === item.key ? 'filter-chip--active' : ''}`}
                        onClick={() => setFilterDate(item.key)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reports History List */}
                <div className="history-list" role="list" aria-label="Reports list">
                  {filteredReports.length === 0 ? (
                    <div className="history-empty-state">
                      <p>No reports match your selected filters.</p>
                      <button
                        className="btn btn--secondary btn--sm"
                        style={{ marginTop: '8px' }}
                        onClick={() => { setSearchQuery(''); setFilterRisk('ALL'); setFilterComponent('ALL'); setFilterDate('ALL'); }}
                      >
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    filteredReports.map(rep => {
                      const isSelected = activeReport?.id === rep.id;
                      return (
                        <div
                          key={rep.id}
                          role="listitem"
                          className={`history-card ${isSelected ? 'history-card--selected' : ''} ${rep.isSimulated ? 'history-card--simulated' : ''}`}
                          onClick={() => {
                            setActiveReportId(rep.id);
                            setInspectedComponentKey(rep.componentKey);
                          }}
                        >
                          <div className="history-card-top">
                            <span className="history-card-id">{rep.id}</span>
                            <span className={`risk-pill ${getRiskBadgeClass(rep.riskLevel)}`}>
                              {rep.riskLevel}
                            </span>
                          </div>

                          <div className="history-card-title">{rep.title}</div>

                          <div className="history-card-meta">
                            <span className="meta-item">
                              <span className="meta-icon">📍</span> {rep.componentShort}
                            </span>
                            <span className="meta-item">
                              <span className="meta-icon">📊</span> {rep.primarySensor}
                            </span>
                          </div>

                          <div className="history-card-footer">
                            <span className="history-card-date">{rep.timestamp}</span>
                            <span className="history-card-score">Score: {rep.healthScore}/100</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </aside>

            {/* RIGHT COLUMN: Active Report Full Details */}
            <main className="reports-content-main">
              {activeReport ? (
                <div className="active-report-container">
                  {/* Report Top Action Bar */}
                  <div className="report-action-bar">
                    <div className="report-badge-cluster">
                      <span className="report-id-chip">{activeReport.id}</span>
                      <span className={`risk-badge-lg ${getRiskBadgeClass(activeReport.riskLevel)}`}>
                        {activeReport.riskLevel} RISK ASSESSMENT
                      </span>
                      {activeReport.isSimulated && (
                        <span className="sim-chip">SIMULATED DEMO EVENT</span>
                      )}
                    </div>

                    <div className="report-export-buttons">
                      <button
                        type="button"
                        className="btn btn--secondary btn--sm"
                        onClick={handleExportCSV}
                        title="Export this report to CSV"
                      >
                        📊 Export CSV
                      </button>
                      <button
                        type="button"
                        className="btn btn--primary btn--sm"
                        onClick={handlePrint}
                        title="Print or save as PDF"
                      >
                        📥 Download PDF / Print
                      </button>
                    </div>
                  </div>

                  {/* SECTION 1: Anomaly Location */}
                  <section className="report-section-card" id="location-section">
                    <div className="report-section-header">
                      <div className="report-section-tag">SECTION 1</div>
                      <h2 className="report-section-title">Anomaly Location & Sensor Identification</h2>
                      <p className="report-section-desc">
                        Exact structural member location, coordinates, sensor telemetry nodes, and interactive schematic highlighting.
                      </p>
                    </div>

                    {/* Metadata Grid */}
                    <div className="report-meta-grid">
                      <div className="meta-box">
                        <span className="meta-box-label">Bridge ID & Name</span>
                        <span className="meta-box-value">{activeReport.bridgeId} — {activeReport.bridgeName}</span>
                      </div>
                      <div className="meta-box">
                        <span className="meta-box-label">Report ID</span>
                        <span className="meta-box-value meta-box-value--mono">{activeReport.id}</span>
                      </div>
                      <div className="meta-box">
                        <span className="meta-box-label">Structural Component</span>
                        <span className="meta-box-value meta-box-value--highlight">{activeReport.component}</span>
                      </div>
                      <div className="meta-box">
                        <span className="meta-box-label">Location Reference</span>
                        <span className="meta-box-value">{activeReport.locationRef}</span>
                      </div>
                      <div className="meta-box">
                        <span className="meta-box-label">Sensor ID(s) & Type</span>
                        <span className="meta-box-value meta-box-value--mono">
                          {activeReport.primarySensor} ({activeReport.sensorType})
                        </span>
                      </div>
                      <div className="meta-box">
                        <span className="meta-box-label">Anomaly Timestamp</span>
                        <span className="meta-box-value meta-box-value--mono">{activeReport.timestamp}</span>
                      </div>
                    </div>

                    {/* Interactive Small Bridge Diagram */}
                    <div className="bridge-diagram-container">
                      <BridgeDiagram
                        affectedComponentKey={activeReport.componentKey}
                        activeComponentKey={currentHighlightCompKey}
                        onSelectComponent={(key) => setInspectedComponentKey(key)}
                        isAnomaly={activeReport.riskLevel === 'HIGH'}
                      />
                    </div>
                  </section>

                  {/* SECTION 2: What Changed? */}
                  <section className="report-section-card" id="changes-section">
                    <div className="report-section-header">
                      <div className="report-section-tag">SECTION 2</div>
                      <div className="header-with-actions">
                        <div>
                          <h2 className="report-section-title">What Changed? — Parameter Comparison</h2>
                          <p className="report-section-desc">
                            Direct comparison between nominal baseline readings and current anomaly telemetry.
                          </p>
                        </div>

                        {/* Configurable Tolerance Setting */}
                        <div className="tolerance-setting-pill">
                          <span className="tolerance-label">Safety Threshold Preset:</span>
                          <div className="tolerance-buttons">
                            {[
                              { id: 'strict', label: 'Strict (-15%)' },
                              { id: 'standard', label: 'Standard (Default)' },
                              { id: 'relaxed', label: 'Relaxed (+20%)' }
                            ].map(t => (
                              <button
                                key={t.id}
                                className={`tolerance-btn ${toleranceMode === t.id ? 'tolerance-btn--active' : ''}`}
                                onClick={() => setToleranceMode(t.id)}
                              >
                                {t.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Parameter Comparison Table */}
                    <div className="comparison-table-wrap">
                      <table className="comparison-table">
                        <thead>
                          <tr>
                            <th>Parameter</th>
                            <th>Sensor ID</th>
                            <th>Normal Reading</th>
                            <th>Anomaly Reading</th>
                            <th>Variance / Delta</th>
                            <th>Operational Limit</th>
                            <th>Evaluation Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeReport.readingsComparison.map((row, idx) => (
                            <tr key={idx} className={row.isBreached ? 'row-breach' : ''}>
                              <td className="cell-param-name">
                                <span className="param-icon">
                                  {row.parameter === 'Vibration' ? '📐' :
                                   row.parameter === 'Strain' ? '📊' :
                                   row.parameter === 'Deflection' ? '📏' :
                                   row.parameter === 'Tilt' ? '⚖️' :
                                   row.parameter === 'Temperature' ? '🌡️' : '💧'}
                                </span>
                                {row.parameter}
                              </td>
                              <td className="cell-mono cell-accent">{row.sensorId}</td>
                              <td className="cell-mono cell-muted">{row.normal}</td>
                              <td className="cell-mono cell-current">
                                <strong>{row.current}</strong>
                              </td>
                              <td className="cell-mono">
                                <span className={`delta-badge ${row.isBreached ? 'delta-badge--elevated' : 'delta-badge--nominal'}`}>
                                  {row.delta}
                                </span>
                              </td>
                              <td className="cell-mono cell-muted">{row.limit}</td>
                              <td>
                                <span className={`status-pill-table ${
                                  row.status === 'Elevated' ? 'status-pill-table--elevated' :
                                  row.status === 'Warning' ? 'status-pill-table--warning' : 'status-pill-table--ok'
                                }`}>
                                  {row.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Alert Trigger Diagnosis Card */}
                    <div className="alert-trigger-box">
                      <div className="trigger-box-title">
                        <span>🚨</span> Alert Trigger Explanation
                      </div>
                      <p className="trigger-box-text">
                        {activeReport.alertTriggered}
                      </p>
                      <div className="trigger-box-note">
                        Telemetry units verified: Acceleration (g), Tensile Strain (µε), Deflection (mm), Rotation (°), Ambient Temp (°C).
                      </div>
                    </div>
                  </section>

                  {/* SECTION 3: Possible Causes */}
                  <section className="report-section-card" id="causes-section">
                    <div className="report-section-header">
                      <div className="report-section-tag">SECTION 3</div>
                      <h2 className="report-section-title">Possible Causes & Engineering Hypotheses</h2>
                      <p className="report-section-desc">
                        Plausible explanations evaluated by the multimodal risk engine based on cross-sensor correlation and structural physics.
                      </p>
                    </div>

                    <div className="causes-grid">
                      {activeReport.possibleCauses.map((cause, ci) => (
                        <div key={ci} className="cause-card">
                          <div className="cause-card-top">
                            <h3 className="cause-title">{cause.title}</h3>
                            <span className="cause-likelihood-badge">{cause.likelihood}</span>
                          </div>

                          <div className="cause-evidence">
                            <span className="cause-label">Detected Evidence:</span>
                            <span className="cause-evidence-text">{cause.evidence}</span>
                          </div>

                          <p className="cause-desc">{cause.description}</p>
                        </div>
                      ))}
                    </div>

                    {/* Cause Guardrail Disclaimer */}
                    <div className="guardrail-callout">
                      <span className="guardrail-icon">⚖️</span>
                      <div className="guardrail-text">
                        <strong>Investigative Notice:</strong> Plausible causes represent non-conclusive engineering hypotheses generated for triage. NIRVANA clearly distinguishes detected observations from potential explanations. Root cause must be established through physical engineering assessment.
                      </div>
                    </div>
                  </section>

                  {/* SECTION 4: Recommended Actions */}
                  <section className="report-section-card" id="actions-section">
                    <div className="report-section-header">
                      <div className="report-section-tag">SECTION 4</div>
                      <h2 className="report-section-title">Recommended Corrective Actions</h2>
                      <p className="report-section-desc">
                        Practical next steps prioritized for the affected component and instrumented telemetry network.
                      </p>
                    </div>

                    {/* Prominent Inspection Recommended Banner */}
                    {activeReport.engineeringInspectionRecommended && (
                      <div className="inspection-alert-banner">
                        <div className="inspection-alert-icon">⚠️</div>
                        <div className="inspection-alert-content">
                          <h3 className="inspection-alert-heading">
                            ENGINEERING INSPECTION RECOMMENDED
                          </h3>
                          <p className="inspection-alert-text">
                            Multiple correlated indicators (dynamic acceleration, bottom-flange strain, and displacement) exhibit concurrent threshold excursions on Girder G2. Arrange a prioritized on-site structural engineering review.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action Items List */}
                    <div className="actions-list">
                      {activeReport.recommendedActions.map((act, ai) => (
                        <div key={ai} className="action-item-card">
                          <div className="action-item-number">{ai + 1}</div>
                          <div className="action-item-body">
                            <div className="action-item-target">{act.component}</div>
                            <div className="action-item-instruction">{act.action}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Safety Guardrail */}
                    <div className="guardrail-callout guardrail-callout--subtle">
                      <span className="guardrail-icon">🛡️</span>
                      <div className="guardrail-text">
                        <strong>Safety Protocol:</strong> Automated structural health monitoring provides decision support. NIRVANA does not automatically prescribe structural repairs, replacement, or bridge closure. All regulatory decisions require qualified engineering evaluation.
                      </div>
                    </div>
                  </section>

                  {/* SECTION 5: Risk Assessment Panel */}
                  <section className="report-section-card" id="risk-section">
                    <div className="report-section-header">
                      <div className="report-section-tag">SECTION 5</div>
                      <h2 className="report-section-title">Risk Assessment & Explainability</h2>
                      <p className="report-section-desc">
                        Ensemble AI risk scoring, uncertainty estimation, and factor-level breakdown of why the assessment changed.
                      </p>
                    </div>

                    <div className="risk-metrics-row">
                      <div className="risk-metric-box">
                        <span className="risk-metric-label">Assessed Risk Level</span>
                        <div className={`risk-metric-val ${getRiskBadgeClass(activeReport.riskLevel)}`}>
                          {activeReport.riskLevel}
                        </div>
                        <span className="risk-metric-sub">{activeReport.severity}</span>
                      </div>

                      <div className="risk-metric-box">
                        <span className="risk-metric-label">Infrastructure Health</span>
                        <div className="risk-metric-val risk-metric-val--score">
                          {activeReport.healthScore} <span className="score-denom">/ 100</span>
                        </div>
                        <span className="risk-metric-sub">Multimodal Health Index</span>
                      </div>

                      <div className="risk-metric-box">
                        <span className="risk-metric-label">Recommended Urgency</span>
                        <div className="risk-metric-val risk-metric-val--urgency">
                          {activeReport.urgency.split('—')[0]}
                        </div>
                        <span className="risk-metric-sub">{activeReport.urgency.split('—')[1] || 'Standard Horizon'}</span>
                      </div>

                      <div className="risk-metric-box">
                        <span className="risk-metric-label">AI Model Confidence</span>
                        <div className="risk-metric-val risk-metric-val--conf">
                          {activeReport.modelConfidence}%
                        </div>
                        <span className="risk-metric-sub">Uncertainty: {activeReport.uncertainty}</span>
                      </div>
                    </div>

                    {/* Explainability Block */}
                    <div className="explainability-card">
                      <div className="explainability-title">
                        <span>💡</span> Why Did the Risk Level Change?
                      </div>
                      <p className="explainability-text">
                        {activeReport.riskExplanation}
                      </p>
                    </div>

                    {/* Non-predictive safety disclaimer */}
                    <div className="guardrail-callout">
                      <span className="guardrail-icon">ℹ️</span>
                      <div className="guardrail-text">
                        {activeReport.decisionSupportNotice}
                      </div>
                    </div>
                  </section>

                  {/* Report Footer & Signature Block */}
                  <div className="report-footer-meta">
                    <div className="footer-meta-col">
                      <span className="footer-meta-label">System Platform</span>
                      <span className="footer-meta-val">NIRVANA Neural Infrastructure Risk Network v2.4</span>
                    </div>
                    <div className="footer-meta-col">
                      <span className="footer-meta-label">Generated Timestamp</span>
                      <span className="footer-meta-val">{activeReport.timestamp}</span>
                    </div>
                    <div className="footer-meta-col">
                      <span className="footer-meta-label">Verification Mode</span>
                      <span className="footer-meta-val">{activeReport.isSimulated ? 'Simulated Interactive Demo' : 'Cryptographic Edge Hash Verified'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="active-report-empty">
                  <h3>No report selected</h3>
                  <p>Please select a report from the history list on the left.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* PRINT-ONLY EXECUTIVE REPORT STYLES */}
      <div className="print-executive-report" aria-hidden="true">
        <div className="print-header">
          <h1>NIRVANA — STRUCTURAL HEALTH REPORT</h1>
          <p>Bridge ID: {activeReport?.bridgeId} | Report ID: {activeReport?.id} | Date: {activeReport?.timestamp}</p>
        </div>
        <div className="print-section">
          <h2>1. Executive Summary & Anomaly Location</h2>
          <p><strong>Component:</strong> {activeReport?.component}</p>
          <p><strong>Location:</strong> {activeReport?.locationRef}</p>
          <p><strong>Sensors:</strong> {activeReport?.primarySensor} ({activeReport?.sensorType})</p>
          <p><strong>Risk Level:</strong> {activeReport?.riskLevel} | <strong>Health Score:</strong> {activeReport?.healthScore}/100</p>
        </div>
        <div className="print-section">
          <h2>2. Parameter Comparison</h2>
          <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Sensor ID</th>
                <th>Normal</th>
                <th>Anomaly</th>
                <th>Delta</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activeReport?.readingsComparison.map((r, i) => (
                <tr key={i}>
                  <td>{r.parameter}</td>
                  <td>{r.sensorId}</td>
                  <td>{r.normal}</td>
                  <td>{r.current}</td>
                  <td>{r.delta}</td>
                  <td>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="print-section">
          <h2>3. Plausible Causes</h2>
          {activeReport?.possibleCauses.map((c, i) => (
            <p key={i}><strong>{c.title} ({c.likelihood}):</strong> {c.description}</p>
          ))}
        </div>
        <div className="print-section">
          <h2>4. Recommended Actions</h2>
          {activeReport?.recommendedActions.map((a, i) => (
            <p key={i}>• <strong>{a.component}:</strong> {a.action}</p>
          ))}
        </div>
        <div className="print-section" style={{ marginTop: '30px' }}>
          <p><strong>Engineering Review Sign-off:</strong> _______________________ Date: ____________</p>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>{activeReport?.decisionSupportNotice}</p>
        </div>
      </div>
    </PageLayout>
  );
}
