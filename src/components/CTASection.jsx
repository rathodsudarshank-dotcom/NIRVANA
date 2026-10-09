import { useScrollReveal } from '../hooks/useScrollReveal';
import ctaImg from '../assets/bridge3.jpeg';
import { Link } from 'react-router-dom';

export default function CTASection() {
  const ref = useScrollReveal();

  return (
    <section className="section">
      <div className="container">
        <div className="cta-section" ref={ref}>
          <div className="cta-section__bg">
            <img
              src={ctaImg}
              alt="Infrastructure at dusk"
              loading="lazy"
            />
            <div className="cta-section__overlay" />
          </div>
          <div className="cta-section__content reveal" ref={useScrollReveal()}>
            <h2 className="cta-section__title">
              See the Infrastructure Before It Becomes a Crisis.
            </h2>
            <p className="cta-section__subtitle">
              Turn fragmented infrastructure signals into actionable intelligence.
            </p>
            <Link to="/monitor" className="btn btn--primary">
              Explore Live Dashboard
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
