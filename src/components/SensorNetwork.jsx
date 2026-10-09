import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
import { SENSORS } from '../data/bridgeData';

export default function SensorNetwork() {
  const headingRef = useScrollReveal();
  const setRef = useStaggerReveal(SENSORS.length, 100);

  return (
    <section className="section">
      <div className="container">
        <div ref={headingRef} className="reveal">
          <div className="section__label">Sensor Network</div>
          <h2 className="section__title">Every Signal Tells a Story.</h2>
          <p className="section__subtitle">
            Infrastructure can be monitored using multiple sensor types — each providing
            a unique perspective on structural health and environmental conditions.
          </p>
        </div>

        <div className="sensor-network__grid">
          {SENSORS.map((sensor, i) => (
            <div key={sensor.id} ref={setRef(i)} className="sensor-card reveal">
              <div className="sensor-card__header">
                <span className="sensor-card__id">{sensor.id}</span>
                <span className="sensor-card__status" aria-label="Active"></span>
              </div>
              <div className="sensor-card__type">{sensor.type}</div>
              <div className="sensor-card__label">Measures</div>
              <div className="sensor-card__measures">{sensor.measures}</div>
              <div className="sensor-card__label" style={{ marginTop: 8 }}>Location</div>
              <div className="sensor-card__location">{sensor.location}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
