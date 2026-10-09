import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/nirvana-logo.jpeg';

export default function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">
            <img src={logoImg} alt="NIRVANA Logo" style={{ height: '28px' }} />
          </div>
          <p className="footer__tagline">
            Neural Infrastructure Risk &amp; Vulnerability Analytics Network
          </p>
          <p className="footer__subtitle">
            &ldquo;Predict Infrastructure Risk Before Failure.&rdquo;
          </p>
        </div>

        <div>
          <div className="footer__col-title">Navigation</div>
          <Link className="footer__link" to="/">Home</Link>
          <Link className="footer__link" to="/about">About</Link>
          <Link className="footer__link" to="/features">Features</Link>
          <Link className="footer__link" to="/monitor">Live Monitor</Link>
          <Link className="footer__link" to="/contact">Contact</Link>
        </div>

        <div>
          <div className="footer__col-title">Technology</div>
          <span className="footer__link">AI &amp; Neural Networks</span>
          <span className="footer__link">Computer Vision</span>
          <span className="footer__link">IoT Sensor Networks</span>
          <span className="footer__link">Cloud Infrastructure</span>
          <span className="footer__link">Edge Computing</span>
        </div>

        {/* Developer Card */}
        <div className="dev-card">
          <div className="dev-card__header">
            <svg className="dev-card__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            <span className="dev-card__label">Developed By</span>
          </div>
          <div className="dev-card__name">SUDARSHAN K RATHOD</div>
          <div className="dev-card__meta">
            <span>SRN: 24SUUBECS2148</span>
            <span>Department: CSE</span>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        &copy; {currentYear} NIRVANA — Neural Infrastructure Risk &amp; Vulnerability Analytics Network. All rights reserved.
      </div>
    </footer>
  );
}
