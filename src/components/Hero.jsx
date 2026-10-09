import { BRIDGE_INFO } from '../data/bridgeData';
import heroImg from '../assets/hero_image_nirvana_2.jpeg';
import { Link } from 'react-router-dom';

export default function Hero({ bridgeState }) {
  const riskClass = bridgeState.risk === 'LOW' ? 'risk-low' : bridgeState.risk === 'HIGH' ? 'risk-high' : 'risk-medium';

  return (
    <section className="hero" id="hero">
      {/* Full-width visual background canvas */}
      <img
        className="hero__bg-image"
        src={heroImg}
        alt="Riverside suspension bridge at dusk"
        loading="eager"
      />

      {/* Cinematic dark gradient overlay for text readability */}
      <div className="hero__bg-overlay" />

      {/* Hero content layer */}
      <div className="hero__container">
        <div className="hero__content">
          <div className="hero__text">
            <div className="hero__badge">
              <span className="status-dot status-dot--green" aria-hidden="true"></span>
              Neural Infrastructure Risk & Vulnerability Analytics Network
            </div>

            <h1 className="hero__title">
              Predict Infrastructure Risk{' '}
              <span className="hero__title-accent">Before Failure.</span>
            </h1>

            <p className="hero__description">
              NIRVANA combines structural sensors, computer vision and neural-network analytics
              to detect anomalies, assess infrastructure risk and support earlier intervention.
            </p>

            <div className="hero__actions">
              <Link to="/about" className="btn btn--primary">
                Explore NIRVANA
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/monitor" className="btn btn--secondary">
                View Live Monitoring
              </Link>
            </div>
          </div>

          {/* Floating Health Card */}
          <div className="hero__status-card health-card" aria-label="Bridge status summary">
            <div className="hero__status-header">
              <div>
                <div className="hero__status-bridge">{BRIDGE_INFO.name}</div>
                <div className="hero__status-id">{BRIDGE_INFO.id}</div>
              </div>
              <div className="hero__status-online">
                <span className="status-dot status-dot--green"></span>
                ONLINE
              </div>
            </div>

            <div className="hero__status-score">
              <div className="hero__status-score-value">
                {bridgeState.healthScore}<span className="hero__status-score-max">/100</span>
              </div>
              <div className="hero__status-score-label">Health Score</div>
            </div>

            <div className="hero__status-risk">
              <span className="hero__status-risk-label">Risk Level</span>
              <span className={`hero__status-risk-value ${riskClass}`}>
                {bridgeState.risk}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
