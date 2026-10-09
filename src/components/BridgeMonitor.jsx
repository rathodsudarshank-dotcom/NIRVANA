import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { SENSORS } from '../data/bridgeData';
import monitorImg from '../assets/bridge1.jpeg';

function SensorMarker({ sensor, bridgeState, isAnomaly }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getValue = () => {
    if (sensor.isCamera) return 'ONLINE';
    const data = bridgeState[sensor.dataKey];
    return data ? `${data.value} ${data.unit}` : '—';
  };

  const getStatus = () => {
    if (sensor.isCamera) return isAnomaly ? 'warning' : 'normal';
    if (!sensor.dataKey) return 'normal';
    const data = bridgeState[sensor.dataKey];
    if (!data) return 'normal';
    if (data.trend > 15) return 'critical';
    if (data.trend > 5) return 'warning';
    return 'normal';
  };

  const status = getStatus();
  const statusClass = status === 'critical' ? 'sensor-marker--critical' :
                      status === 'warning' ? 'sensor-marker--warning' : '';
  const cameraClass = sensor.isCamera ? 'sensor-marker--camera' : '';
  const statusLabel = status === 'critical' ? 'CRITICAL' : status === 'warning' ? 'WARNING' : 'NORMAL';
  const statusColor = status === 'critical' ? 'var(--status-red)' :
                      status === 'warning' ? 'var(--status-amber)' : 'var(--status-green)';

  const tooltipStyle = {
    top: parseFloat(sensor.position.top) > 50 ? 'auto' : '100%',
    bottom: parseFloat(sensor.position.top) > 50 ? '100%' : 'auto',
    left: parseFloat(sensor.position.left) > 60 ? 'auto' : '50%',
    right: parseFloat(sensor.position.left) > 60 ? '0' : 'auto',
    transform: parseFloat(sensor.position.left) > 60 ? 'none' : 'translateX(-50%)',
    marginTop: parseFloat(sensor.position.top) > 50 ? 0 : 12,
    marginBottom: parseFloat(sensor.position.top) > 50 ? 12 : 0,
  };

  return (
    <div
      className={`sensor-marker ${statusClass} ${cameraClass}`}
      style={{ top: sensor.position.top, left: sensor.position.left }}
      onClick={() => setShowTooltip(!showTooltip)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      role="button"
      tabIndex={0}
      aria-label={`${sensor.id} - ${sensor.type}`}
      onKeyDown={(e) => e.key === 'Enter' && setShowTooltip(!showTooltip)}
    >
      <div className="sensor-marker__line" aria-hidden="true" />
      <div className="sensor-marker__label">{sensor.id}</div>
      <div className="sensor-marker__dot" />

      {showTooltip && (
        <div className="sensor-tooltip" style={tooltipStyle} onClick={(e) => e.stopPropagation()}>
          <div className="sensor-tooltip__header">
            <span className="sensor-tooltip__id">{sensor.id}</span>
            <button className="sensor-tooltip__close" onClick={() => setShowTooltip(false)} aria-label="Close">×</button>
          </div>
          <div className="sensor-tooltip__type">{sensor.type}</div>

          <div className="sensor-tooltip__row">
            <span className="sensor-tooltip__row-label">Value</span>
            <span className="sensor-tooltip__row-value">{getValue()}</span>
          </div>
          <div className="sensor-tooltip__row">
            <span className="sensor-tooltip__row-label">Status</span>
            <span className="sensor-tooltip__row-value" style={{ color: statusColor }}>
              {statusLabel}
            </span>
          </div>
          {!sensor.isCamera && bridgeState[sensor.dataKey] && (
            <div className="sensor-tooltip__row">
              <span className="sensor-tooltip__row-label">Range</span>
              <span className="sensor-tooltip__row-value">{bridgeState[sensor.dataKey].range}</span>
            </div>
          )}
          <div className="sensor-tooltip__row">
            <span className="sensor-tooltip__row-label">Location</span>
            <span className="sensor-tooltip__row-value" style={{ fontSize: '0.72rem' }}>{sensor.location}</span>
          </div>
          <div className="sensor-tooltip__row">
            <span className="sensor-tooltip__row-label">Purpose</span>
            <span className="sensor-tooltip__row-value" style={{ fontSize: '0.72rem', maxWidth: 140, textAlign: 'right' }}>{sensor.purpose}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BridgeMonitor({ bridgeState, isAnomaly, compact = false }) {
  const headerRef = useScrollReveal();
  const monitorRef = useScrollReveal();

  if (compact) {
    return (
      <div className="bridge-monitor bridge-monitor--compact">
        <div className="bridge-monitor__image-wrap bridge-monitor__image-wrap--compact">
          <img
            className="bridge-monitor__image bridge-monitor__image--compact"
            src={monitorImg}
            alt="Riverside Bridge with sensor overlay"
            loading="lazy"
          />
          <div className="bridge-monitor__overlay" />

          <div className="bridge-monitor__header">
            <div className="bridge-monitor__live-badge">
              <span className="status-dot status-dot--green" />
              LIVE
            </div>
            <div className="bridge-monitor__bridge-name">RIVERSIDE BRIDGE — B-27</div>
          </div>

          {SENSORS.map(sensor => (
            <SensorMarker
              key={sensor.id}
              sensor={sensor}
              bridgeState={bridgeState}
              isAnomaly={isAnomaly}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="container container--wide">
        <div ref={headerRef} className="reveal">
          <div className="section__label">Live Monitoring</div>
          <h2 className="section__title">Riverside Bridge — Sensor Overlay</h2>
          <p className="section__subtitle">
            Interactive sensor visualization. Click or hover on any sensor marker
            to view real-time readings and status information.
          </p>
        </div>

        <div className="bridge-monitor reveal-scale" ref={monitorRef}>
          <div className="bridge-monitor__image-wrap">
            <img
              className="bridge-monitor__image"
              src={monitorImg}
              alt="Riverside Bridge with sensor overlay"
              loading="lazy"
            />
            <div className="bridge-monitor__overlay" />

            <div className="bridge-monitor__header">
              <div className="bridge-monitor__live-badge">
                <span className="status-dot status-dot--green" />
                LIVE
              </div>
              <div className="bridge-monitor__bridge-name">RIVERSIDE BRIDGE — B-27</div>
            </div>

            {SENSORS.map(sensor => (
              <SensorMarker
                key={sensor.id}
                sensor={sensor}
                bridgeState={bridgeState}
                isAnomaly={isAnomaly}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
