import { STRUCTURAL_COMPONENTS } from '../data/reportData';

export default function BridgeDiagram({
  affectedComponentKey = 'girder',
  onSelectComponent,
  activeComponentKey,
  isAnomaly = false
}) {
  // If activeComponentKey is provided externally use it, otherwise default to affected or girder
  const currentKey = activeComponentKey || affectedComponentKey || 'girder';
  const currentComp = STRUCTURAL_COMPONENTS[currentKey] || STRUCTURAL_COMPONENTS.girder;

  const handleSelect = (key) => {
    if (onSelectComponent) {
      onSelectComponent(key);
    }
  };

  const isAffected = (key) => key === affectedComponentKey;
  const isSelected = (key) => key === currentKey;

  // Visual highlight colors
  const highlightColor = isAnomaly ? 'var(--status-red)' : 'var(--accent)';
  const warningColor = 'var(--status-amber)';
  const normalColor = 'var(--status-green)';

  return (
    <div className="bridge-diagram-card">
      <div className="bridge-diagram-header">
        <div>
          <div className="bridge-diagram-title">
            <span className="diagram-icon">🌉</span> Structural Member Schematic — Bridge B-27
          </div>
          <div className="bridge-diagram-subtitle">
            Interactive cable-stayed diagram. Click any structural component to inspect sensor telemetry and specifications.
          </div>
        </div>

        <div className="bridge-diagram-legend">
          <div className="legend-item">
            <span className="legend-dot legend-dot--affected" />
            <span>Affected Anomaly Zone</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-dot--selected" />
            <span>Selected Member</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-dot--nominal" />
            <span>Nominal Sensor</span>
          </div>
        </div>
      </div>

      {/* SVG Bridge Schematic */}
      <div className="bridge-diagram-svg-wrap">
        <svg
          viewBox="0 0 900 320"
          className="bridge-diagram-svg"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Riverside Bridge structural component diagram"
        >
          <defs>
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#14111F" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#07060D" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="pylonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2E284A" />
              <stop offset="50%" stopColor="#554B82" />
              <stop offset="100%" stopColor="#2E284A" />
            </linearGradient>

            <filter id="anomalyGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Waterway / Riverbed */}
          <rect x="0" y="240" width="900" height="80" fill="url(#waterGrad)" />
          <path
            d="M 0,240 Q 225,236 450,240 T 900,240"
            stroke="var(--border-subtle)"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Ground Abutments */}
          {/* West Abutment */}
          <polygon points="0,175 90,175 110,240 0,240" fill="#1A162B" stroke="var(--border-subtle)" strokeWidth="1.5" />
          <text x="35" y="215" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)">ABUT-W</text>

          {/* East Abutment */}
          <polygon points="810,175 900,175 900,240 790,240" fill="#1A162B" stroke="var(--border-subtle)" strokeWidth="1.5" />
          <text x="825" y="215" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)">ABUT-E</text>

          {/* 1. PIERS & SUBSTRUCTURE (Clickable) */}
          <g
            className={`diagram-comp-group ${isAffected('pier') ? 'comp-affected' : ''} ${isSelected('pier') ? 'comp-selected' : ''}`}
            onClick={() => handleSelect('pier')}
            cursor="pointer"
          >
            {/* Pier P1 (West River Pier) */}
            <rect
              x="270"
              y="185"
              width="45"
              height="65"
              rx="4"
              fill={isAffected('pier') ? 'rgba(239, 68, 68, 0.25)' : isSelected('pier') ? 'rgba(184, 166, 246, 0.2)' : '#1F1B33'}
              stroke={isAffected('pier') ? highlightColor : isSelected('pier') ? 'var(--accent)' : 'var(--border-medium)'}
              strokeWidth={isAffected('pier') || isSelected('pier') ? '2.5' : '1.5'}
            />
            {/* Pier P2 (East River Pier) */}
            <rect
              x="585"
              y="185"
              width="45"
              height="65"
              rx="4"
              fill={isAffected('pier') ? 'rgba(239, 68, 68, 0.25)' : isSelected('pier') ? 'rgba(184, 166, 246, 0.2)' : '#1F1B33'}
              stroke={isAffected('pier') ? highlightColor : isSelected('pier') ? 'var(--accent)' : 'var(--border-medium)'}
              strokeWidth={isAffected('pier') || isSelected('pier') ? '2.5' : '1.5'}
            />
            <text x="278" y="222" fill={isSelected('pier') ? 'var(--accent)' : 'var(--text-secondary)'} fontSize="11" fontWeight="600" fontFamily="var(--font-mono)">P1</text>
            <text x="593" y="222" fill={isSelected('pier') ? 'var(--accent)' : 'var(--text-secondary)'} fontSize="11" fontWeight="600" fontFamily="var(--font-mono)">P2</text>
            <text x="272" y="260" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">TILT-01</text>
          </g>

          {/* 2. BEARINGS (Clickable) */}
          <g
            className={`diagram-comp-group ${isAffected('bearing') ? 'comp-affected' : ''} ${isSelected('bearing') ? 'comp-selected' : ''}`}
            onClick={() => handleSelect('bearing')}
            cursor="pointer"
          >
            {/* Bearing B-01 on Pier 1 */}
            <rect
              x="276"
              y="177"
              width="33"
              height="8"
              rx="2"
              fill={isAffected('bearing') ? highlightColor : isSelected('bearing') ? 'var(--accent)' : '#403863'}
              stroke={isAffected('bearing') ? '#fff' : 'var(--accent-secondary)'}
              strokeWidth="1"
            />
            {/* Bearing B-02 on Pier 2 */}
            <rect
              x="591"
              y="177"
              width="33"
              height="8"
              rx="2"
              fill={isAffected('bearing') ? highlightColor : isSelected('bearing') ? 'var(--accent)' : '#403863'}
              stroke={isAffected('bearing') ? '#fff' : 'var(--accent-secondary)'}
              strokeWidth="1"
            />
          </g>

          {/* MAIN PYLONS / TOWERS */}
          {/* Tower 1 (West) */}
          <g>
            <polygon points="280,30 273,185 292,185 285,30" fill="url(#pylonGrad)" stroke="var(--border-medium)" strokeWidth="1.5" />
            <polygon points="305,30 298,185 317,185 310,30" fill="url(#pylonGrad)" stroke="var(--border-medium)" strokeWidth="1.5" />
            <rect x="278" y="75" width="34" height="8" fill="#1C182F" stroke="var(--border-subtle)" strokeWidth="1" />
            <rect x="276" y="125" width="38" height="8" fill="#1C182F" stroke="var(--border-subtle)" strokeWidth="1" />
            <text x="275" y="24" fill="var(--text-secondary)" fontSize="10" fontWeight="600" fontFamily="var(--font-mono)">TOWER T1</text>
          </g>

          {/* Tower 2 (East) */}
          <g>
            <polygon points="595,30 588,185 607,185 600,30" fill="url(#pylonGrad)" stroke="var(--border-medium)" strokeWidth="1.5" />
            <polygon points="620,30 613,185 632,185 625,30" fill="url(#pylonGrad)" stroke="var(--border-medium)" strokeWidth="1.5" />
            <rect x="593" y="75" width="34" height="8" fill="#1C182F" stroke="var(--border-subtle)" strokeWidth="1" />
            <rect x="591" y="125" width="38" height="8" fill="#1C182F" stroke="var(--border-subtle)" strokeWidth="1" />
            <text x="590" y="24" fill="var(--text-secondary)" fontSize="10" fontWeight="600" fontFamily="var(--font-mono)">TOWER T2</text>
          </g>

          {/* 3. STAY CABLES (Clickable) */}
          <g
            className={`diagram-comp-group ${isAffected('cable') ? 'comp-affected' : ''} ${isSelected('cable') ? 'comp-selected' : ''}`}
            onClick={() => handleSelect('cable')}
            cursor="pointer"
          >
            {/* Cables from Tower 1 */}
            <line x1="285" y1="50" x2="140" y2="175" stroke={isAffected('cable') ? highlightColor : isSelected('cable') ? 'var(--accent)' : '#7C6FA8'} strokeWidth={isAffected('cable') ? '2.5' : '1.5'} strokeDasharray={isAffected('cable') ? 'none' : 'none'} opacity={isAffected('cable') || isSelected('cable') ? 1 : 0.7} />
            <line x1="287" y1="70" x2="190" y2="175" stroke={isAffected('cable') ? highlightColor : isSelected('cable') ? 'var(--accent)' : '#7C6FA8'} strokeWidth={isAffected('cable') ? '2.5' : '1.5'} opacity={isAffected('cable') || isSelected('cable') ? 1 : 0.7} />
            <line x1="289" y1="90" x2="235" y2="175" stroke={isAffected('cable') ? highlightColor : isSelected('cable') ? 'var(--accent)' : '#7C6FA8'} strokeWidth={isAffected('cable') ? '2.5' : '1.5'} opacity={isAffected('cable') || isSelected('cable') ? 1 : 0.7} />

            <line x1="305" y1="90" x2="360" y2="175" stroke={isAffected('cable') ? highlightColor : isSelected('cable') ? 'var(--accent)' : '#7C6FA8'} strokeWidth={isAffected('cable') ? '2.5' : '1.5'} opacity={isAffected('cable') || isSelected('cable') ? 1 : 0.7} />
            <line x1="307" y1="70" x2="405" y2="175" stroke={isAffected('cable') ? highlightColor : isSelected('cable') ? 'var(--accent)' : '#7C6FA8'} strokeWidth={isAffected('cable') ? '2.5' : '1.5'} opacity={isAffected('cable') || isSelected('cable') ? 1 : 0.7} />
            <line x1="309" y1="50" x2="445" y2="175" stroke={isAffected('cable') ? highlightColor : isSelected('cable') ? 'var(--accent)' : '#7C6FA8'} strokeWidth={isAffected('cable') ? '2.5' : '1.5'} opacity={isAffected('cable') || isSelected('cable') ? 1 : 0.7} />

            {/* Cables from Tower 2 */}
            <line x1="600" y1="50" x2="455" y2="175" stroke={isAffected('cable') ? highlightColor : isSelected('cable') ? 'var(--accent)' : '#7C6FA8'} strokeWidth={isAffected('cable') ? '2.5' : '1.5'} opacity={isAffected('cable') || isSelected('cable') ? 1 : 0.7} />
            <line x1="602" y1="70" x2="495" y2="175" stroke={isAffected('cable') ? highlightColor : isSelected('cable') ? 'var(--accent)' : '#7C6FA8'} strokeWidth={isAffected('cable') ? '2.5' : '1.5'} opacity={isAffected('cable') || isSelected('cable') ? 1 : 0.7} />
            <line x1="604" y1="90" x2="540" y2="175" stroke={isAffected('cable') ? highlightColor : isSelected('cable') ? 'var(--accent)' : '#7C6FA8'} strokeWidth={isAffected('cable') ? '2.5' : '1.5'} opacity={isAffected('cable') || isSelected('cable') ? 1 : 0.7} />

            <line x1="620" y1="90" x2="665" y2="175" stroke={isAffected('cable') ? highlightColor : isSelected('cable') ? 'var(--accent)' : '#7C6FA8'} strokeWidth={isAffected('cable') ? '2.5' : '1.5'} opacity={isAffected('cable') || isSelected('cable') ? 1 : 0.7} />
            <line x1="622" y1="70" x2="710" y2="175" stroke={isAffected('cable') ? highlightColor : isSelected('cable') ? 'var(--accent)' : '#7C6FA8'} strokeWidth={isAffected('cable') ? '2.5' : '1.5'} opacity={isAffected('cable') || isSelected('cable') ? 1 : 0.7} />
            <line x1="624" y1="50" x2="760" y2="175" stroke={isAffected('cable') ? highlightColor : isSelected('cable') ? 'var(--accent)' : '#7C6FA8'} strokeWidth={isAffected('cable') ? '2.5' : '1.5'} opacity={isAffected('cable') || isSelected('cable') ? 1 : 0.7} />

            <text x="345" y="105" fill={isSelected('cable') ? 'var(--accent)' : 'var(--text-muted)'} fontSize="9" fontFamily="var(--font-mono)">CABLES (SC-01..08)</text>
          </g>

          {/* 4. LONGITUDINAL GIRDERS (Clickable) */}
          <g
            className={`diagram-comp-group ${isAffected('girder') ? 'comp-affected' : ''} ${isSelected('girder') ? 'comp-selected' : ''}`}
            onClick={() => handleSelect('girder')}
            onMouseEnter={() => setHoveredKey('girder')}
            onMouseLeave={() => setHoveredKey(null)}
            cursor="pointer"
          >
            {/* Approach Girder G1 */}
            <rect x="90" y="171" width="180" height="7" fill="#25203D" stroke="var(--border-medium)" strokeWidth="1" />

            {/* Main Center Girder G2 (Affected Zone) */}
            <rect
              x="315"
              y="170"
              width="270"
              height="9"
              rx="2"
              fill={isAffected('girder') ? 'rgba(239, 68, 68, 0.4)' : isSelected('girder') ? 'rgba(184, 166, 246, 0.3)' : '#2D274A'}
              stroke={isAffected('girder') ? highlightColor : isSelected('girder') ? 'var(--accent)' : 'var(--border-medium)'}
              strokeWidth={isAffected('girder') || isSelected('girder') ? '2.5' : '1.5'}
              filter={isAffected('girder') ? 'url(#anomalyGlow)' : 'none'}
            />

            {/* Approach Girder G3 */}
            <rect x="630" y="171" width="180" height="7" fill="#25203D" stroke="var(--border-medium)" strokeWidth="1" />

            <text x="410" y="164" fill={isAffected('girder') ? highlightColor : isSelected('girder') ? 'var(--accent)' : 'var(--text-secondary)'} fontSize="11" fontWeight="700" fontFamily="var(--font-mono)">
              GIRDER G2 (MID-SPAN)
            </text>
          </g>

          {/* 5. BRIDGE DECK (Clickable) */}
          <g
            className={`diagram-comp-group ${isAffected('deck') ? 'comp-affected' : ''} ${isSelected('deck') ? 'comp-selected' : ''}`}
            onClick={() => handleSelect('deck')}
            onMouseEnter={() => setHoveredKey('deck')}
            onMouseLeave={() => setHoveredKey(null)}
            cursor="pointer"
          >
            <rect
              x="80"
              y="166"
              width="740"
              height="5"
              fill={isAffected('deck') ? 'rgba(239, 68, 68, 0.5)' : isSelected('deck') ? 'var(--accent)' : '#49426E'}
              stroke={isAffected('deck') ? highlightColor : isSelected('deck') ? 'var(--accent)' : 'var(--border-subtle)'}
              strokeWidth="1"
            />
            <text x="130" y="160" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">ROADWAY DECK D-03</text>
          </g>

          {/* 6. EXPANSION JOINTS (Clickable) */}
          <g
            className={`diagram-comp-group ${isAffected('expansion_joint') ? 'comp-affected' : ''} ${isSelected('expansion_joint') ? 'comp-selected' : ''}`}
            onClick={() => handleSelect('expansion_joint')}
            onMouseEnter={() => setHoveredKey('expansion_joint')}
            onMouseLeave={() => setHoveredKey(null)}
            cursor="pointer"
          >
            {/* Expansion Joint West */}
            <rect
              x="266"
              y="164"
              width="6"
              height="16"
              rx="1"
              fill={isAffected('expansion_joint') ? highlightColor : isSelected('expansion_joint') ? 'var(--accent)' : warningColor}
              stroke="#fff"
              strokeWidth="0.8"
            />
            {/* Expansion Joint East (LVDT-01 monitoring) */}
            <rect
              x="628"
              y="164"
              width="6"
              height="16"
              rx="1"
              fill={isAffected('expansion_joint') ? highlightColor : isSelected('expansion_joint') ? 'var(--accent)' : warningColor}
              stroke="#fff"
              strokeWidth="0.8"
            />
            <text x="636" y="160" fill={isSelected('expansion_joint') ? 'var(--accent)' : warningColor} fontSize="9" fontWeight="600" fontFamily="var(--font-mono)">
              EJ-EAST (LVDT-01)
            </text>
          </g>

          {/* SENSOR NODES OVERLAY ON DIAGRAM */}
          {/* ACC-01 & SG-01 Pin on Girder G2 Mid-Span */}
          <g transform="translate(450, 175)">
            {/* Pulsing radar ring if girder or anomaly active */}
            {isAnomaly && (
              <>
                <circle cx="0" cy="0" r="18" fill="none" stroke={highlightColor} strokeWidth="1.5" opacity="0.6">
                  <animate attributeName="r" values="8;24;32" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.3;0" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="0" cy="0" r="10" fill="none" stroke={highlightColor} strokeWidth="2" opacity="0.9">
                  <animate attributeName="r" values="4;16;22" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.4;0" dur="2s" repeatCount="indefinite" />
                </circle>
              </>
            )}

            {/* Sensor Dot */}
            <circle
              cx="0"
              cy="0"
              r={isAnomaly ? "7" : "5"}
              fill={isAnomaly ? highlightColor : normalColor}
              stroke="#FFFFFF"
              strokeWidth="2"
            />

            {/* Pin Tag */}
            <g transform="translate(0, -28)">
              <rect
                x="-55"
                y="-18"
                width="110"
                height="22"
                rx="4"
                fill={isAnomaly ? "rgba(239, 68, 68, 0.95)" : "rgba(184, 166, 246, 0.95)"}
                stroke="#fff"
                strokeWidth="1"
              />
              <text
                x="0"
                y="-4"
                fill="#07060D"
                fontSize="10"
                fontWeight="700"
                textAnchor="middle"
                fontFamily="var(--font-mono)"
              >
                {isAnomaly ? "⚡ ACC-01 / SG-01" : "✓ ACC-01 / SG-01"}
              </text>
            </g>
          </g>

          {/* Additional Sensor Markers */}
          {/* LVDT-01 Marker at Joint East */}
          <circle cx="631" cy="172" r="4" fill={isAnomaly ? warningColor : normalColor} stroke="#fff" strokeWidth="1.5" />

          {/* TILT-01 Marker at Pier 1 */}
          <circle cx="292" cy="217" r="4" fill={isAnomaly ? warningColor : normalColor} stroke="#fff" strokeWidth="1.5" />

          {/* CAM-01 Marker at Tower 1 Peak */}
          <circle cx="295" cy="50" r="4" fill="var(--accent)" stroke="#fff" strokeWidth="1.5" />
          <text x="306" y="53" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)">CAM-01</text>
        </svg>
      </div>

      {/* Component Selection Pills */}
      <div className="diagram-component-bar">
        <span className="diagram-bar-label">Inspect Member:</span>
        <div className="diagram-pills">
          {Object.entries(STRUCTURAL_COMPONENTS).map(([key, comp]) => {
            const affected = isAffected(key);
            const active = isSelected(key);
            return (
              <button
                key={key}
                type="button"
                className={`diagram-pill ${active ? 'diagram-pill--active' : ''} ${affected ? 'diagram-pill--affected' : ''}`}
                onClick={() => handleSelect(key)}
              >
                {affected && <span className="pill-dot pill-dot--red" />}
                {!affected && active && <span className="pill-dot pill-dot--accent" />}
                {comp.category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Component Telemetry & Sensor Drawer */}
      <div className="component-detail-drawer">
        <div className="drawer-header">
          <div className="drawer-title-group">
            <span className="drawer-badge">
              {currentComp.category.toUpperCase()} SPECIFICATION
            </span>
            <h4 className="drawer-title">{currentComp.name}</h4>
          </div>

          <div className="drawer-status-group">
            {isAffected(currentKey) ? (
              <span className="status-badge status-badge--critical">
                <span className="status-dot status-dot--red" />
                ANOMALY DETECTED ON THIS COMPONENT
              </span>
            ) : (
              <span className="status-badge status-badge--normal">
                <span className="status-dot status-dot--green" />
                NOMINAL OPERATIONAL STATE
              </span>
            )}
          </div>
        </div>

        <div className="drawer-grid">
          <div className="drawer-field">
            <span className="drawer-field-label">Reference Location</span>
            <span className="drawer-field-value drawer-field-value--mono">{currentComp.locationRef}</span>
          </div>
          <div className="drawer-field">
            <span className="drawer-field-label">Design & Materials</span>
            <span className="drawer-field-value">{currentComp.material}</span>
          </div>
          <div className="drawer-field">
            <span className="drawer-field-label">Structural Function</span>
            <span className="drawer-field-value">{currentComp.structuralRole}</span>
          </div>
          <div className="drawer-field">
            <span className="drawer-field-label">Design Limits</span>
            <span className="drawer-field-value drawer-field-value--mono">{currentComp.designLimit}</span>
          </div>
        </div>

        {/* Instrumented Sensors Table for this component */}
        <div className="drawer-sensors-section">
          <div className="drawer-sensors-title">Instrumented Sensors on this Member</div>
          <div className="drawer-sensors-table-wrap">
            <table className="drawer-sensors-table">
              <thead>
                <tr>
                  <th>Sensor ID</th>
                  <th>Sensor Type</th>
                  <th>Measurement Axis</th>
                  <th>Operational Range</th>
                  <th>Sampling Rate</th>
                  <th>Monitoring Purpose</th>
                </tr>
              </thead>
              <tbody>
                {currentComp.sensorsDetail.map(s => (
                  <tr key={s.id} className={isAffected(currentKey) ? 'row-highlighted' : ''}>
                    <td className="cell-mono cell-accent">
                      <span className="sensor-chip">{s.id}</span>
                    </td>
                    <td>{s.type}</td>
                    <td className="cell-mono">{s.axis}</td>
                    <td className="cell-mono">{s.range}</td>
                    <td className="cell-mono">{s.sampling}</td>
                    <td className="cell-purpose">{s.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
